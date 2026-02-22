import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/admin/verification - List KYC verification requests
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || 'all';

        // 1. Base Filters
        const where: any = {};

        // Always require docs to be present to be considered a "Request"
        where.verificationDocs = { not: null };

        // Search logic
        if (search) {
            where.user = {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ]
            };
        }

        // 2. Fetch ALL matching docs (lightweight) to calculate real stats & precise pagination
        // Since we can't query inside the JSON string easily for 'rejected', we have to fetch-and-filter
        const allCandidates = await prisma.freelancerProfile.findMany({
            where,
            select: {
                id: true,
                isVerified: true,
                verificationDocs: true,
                updatedAt: true
            },
            orderBy: { updatedAt: 'desc' }
        });

        // 3. Process & Categorize
        const processed = allCandidates.map((p: any) => {
            let kycStatus = 'pending';
            if (p.isVerified) {
                kycStatus = 'verified';
            } else {
                try {
                    const docs = JSON.parse(p.verificationDocs || '{}');
                    if (docs.kycStatus === 'rejected') {
                        kycStatus = 'rejected';
                    }
                } catch (e) { /* default pending */ }
            }
            return { ...p, kycStatus };
        });

        // 4. Calculate Stats
        const stats = {
            total: processed.length,
            verified: processed.filter((p: any) => p.kycStatus === 'verified').length,
            pending: processed.filter((p: any) => p.kycStatus === 'pending').length,
            rejected: processed.filter((p: any) => p.kycStatus === 'rejected').length
        };

        // 5. Apply Status Filter (Page-level)
        let filtered = processed;
        if (status !== 'all') {
            filtered = processed.filter((p: any) => p.kycStatus === status);
        }

        const totalFiltered = filtered.length;
        const totalPages = Math.ceil(totalFiltered / limit);

        // 6. Pagination Slice
        const startIndex = (page - 1) * limit;
        const pageItems = filtered.slice(startIndex, startIndex + limit);

        // 7. Hydrate Full Data for Page Items
        // We only have minimal data in pageItems, need to fetch full details including User
        const pageIds = pageItems.map((p: any) => p.id);

        const fullProfiles = await prisma.freelancerProfile.findMany({
            where: { id: { in: pageIds } },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    }
                }
            }
        });

        // Sort back to match 'pageItems' order (desc updatedAt)
        const sortedProfiles = pageIds.map((id: string) => fullProfiles.find((p: any) => p.id === id)!);

        // 8. Map to Response Format
        const kycRequests = sortedProfiles.map((p: any) => {
            let docs: any = {};
            let isRejected = false;
            let rejectionReason = '';
            try {
                docs = p.verificationDocs ? JSON.parse(p.verificationDocs) : {};
                if (docs.kycStatus === 'rejected') {
                    isRejected = true;
                    rejectionReason = docs.rejectionReason;
                }
            } catch (e) {
                docs = { raw: p.verificationDocs };
            }

            // Determine final status display
            const finalStatus = p.isVerified ? 'verified' : (isRejected ? 'rejected' : 'pending');

            // Normalize docs for UI
            if (typeof docs !== 'object' || docs === null) {
                docs = { document: { type: 'Upload', file: String(docs), status: finalStatus } };
            } else if (Array.isArray(docs)) {
                const newDocs: any = {};
                docs.forEach((item, index) => {
                    newDocs[`Document_${index}`] = { type: `Document ${index + 1}`, file: String(item), status: finalStatus };
                });
                docs = newDocs;
            } else {
                // Handle Object structure: extract known fields (documentUrls, selfieUrl) or fallback
                const newDocs: any = {};

                // If it's the newer format with documentUrls and selfieUrl
                let hasStandardDocs = false;
                if (Array.isArray(docs.documentUrls)) {
                    hasStandardDocs = true;
                    docs.documentUrls.forEach((url: string, index: number) => {
                        const typeName = docs.idType ? `${docs.idType} ${index + 1}` : `Document ${index + 1}`;
                        newDocs[`document_${index}`] = { type: typeName, file: url, status: finalStatus };
                    });
                } else if (typeof docs.documentUrl === 'string') {
                    hasStandardDocs = true;
                    const typeName = docs.idType || 'Document';
                    newDocs['document'] = { type: typeName, file: docs.documentUrl, status: finalStatus };
                }

                if (typeof docs.selfieUrl === 'string') {
                    hasStandardDocs = true;
                    newDocs['selfie'] = { type: 'Selfie', file: docs.selfieUrl, status: finalStatus };
                }

                if (docs.idType) {
                    newDocs['idType'] = { type: 'ID Type', file: String(docs.idType), status: finalStatus, isText: true };
                }
                if (docs.idNumber) {
                    newDocs['idNumber'] = { type: 'ID Number', file: String(docs.idNumber), status: finalStatus, isText: true };
                }
                if (docs.submittedAt) {
                    try {
                        newDocs['submittedAt'] = { type: 'Submitted At', file: new Date(docs.submittedAt).toLocaleString(), status: finalStatus, isText: true };
                    } catch (e) {
                        newDocs['submittedAt'] = { type: 'Submitted At', file: String(docs.submittedAt), status: finalStatus, isText: true };
                    }
                }

                // If no standard docs keys exist, try to infer from object (fallback for very old records)
                if (!hasStandardDocs) {
                    Object.keys(docs).forEach((key: string) => {
                        // Skip metadata keys
                        if (['kycStatus', 'rejectionReason', 'rejectedAt', 'documentUrls', 'documentUrl', 'selfieUrl', 'idType', 'idNumber', 'submittedAt'].includes(key)) return;

                        const val = docs[key];
                        if (typeof val === 'string') {
                            const isText = !(val.startsWith('http') || val.startsWith('/') || val.startsWith('blob:'));
                            newDocs[key] = { type: key, file: val, status: finalStatus, isText };
                        } else if (typeof val === 'object' && val !== null && val.file) {
                            newDocs[key] = { ...val, status: val.status || finalStatus };
                        }
                    });
                }

                // If we found absolutely nothing, we can just throw the stringified raw data as a single file,
                // but usually the above covers all cases.
                if (Object.keys(newDocs).length === 0 && Object.keys(docs).length > 0) {
                    newDocs['raw'] = { type: 'Raw Data', file: '', status: finalStatus, raw: true };
                }

                docs = newDocs;
            }

            return {
                id: p.id,
                userId: p.userId,
                userName: p.user.name || 'Unknown',
                userEmail: p.user.email,
                userRole: p.user.role,
                documents: docs,
                status: finalStatus,
                submittedAt: p.updatedAt.toLocaleString(),
                verifiedAt: p.verifiedAt ? p.verifiedAt.toLocaleString() : null,
                verifiedBy: p.isVerified ? 'Admin' : null,
                notes: isRejected ? rejectionReason : (p.isVerified ? 'Verified' : 'Pending Review')
            };
        });

        return NextResponse.json({
            requests: kycRequests,
            stats, // Return calculated real stats
            total: totalFiltered,
            page,
            totalPages
        });

    } catch (error) {
        console.error('Fetch KYC requests error:', error);
        return NextResponse.json({ error: 'Failed to fetch KYC requests' }, { status: 500 });
    }
}
