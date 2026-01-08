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

        const skip = (page - 1) * limit;
        const where: any = {};

        // We focus on Freelancers for now as they are the primary targets for KYC
        // But we can also include Clients if they have verification docs

        // Search logic needs to search on related User model
        if (search) {
            where.user = {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ]
            };
        }

        // Status logic
        if (status === 'verified') {
            where.isVerified = true;
        } else if (status === 'pending') {
            where.isVerified = false;
            where.verificationDocs = { not: null }; // Only those who submitted docs
        } else if (status === 'rejected') {
            // We don't have a specific 'rejected' status column, 
            // usually rejection assumes clearing docs or setting a flag.
            // For now, we'll skip 'rejected' or assume validation fails lead to null docs?
            // Let's rely on 'pending' and 'verified' mostly.
        }

        // If status is 'all', we probably want validation requests (docs not null)
        if (status === 'all') {
            where.verificationDocs = { not: null };
        }

        const [profiles, total] = await Promise.all([
            prisma.freelancerProfile.findMany({
                where,
                skip,
                take: limit,
                orderBy: { updatedAt: 'desc' },
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
            }),
            prisma.freelancerProfile.count({ where })
        ]);

        // Map to KYC format
        const kycRequests = profiles.map((p: any) => {
            let docs = {};
            try {
                docs = p.verificationDocs ? JSON.parse(p.verificationDocs) : {};
            } catch (e) {
                docs = { raw: p.verificationDocs };
            }

            // Normalize docs structure for frontend
            // Expecting object with keys like idProof, addressProof etc.
            // If docs is just an array or string, map it to a generic 'Document'
            if (typeof docs !== 'object' || Array.isArray(docs)) {
                docs = { document: { type: 'Upload', file: docs, status: p.isVerified ? 'verified' : 'pending' } };
            } else {
                // Add status to each doc if missing
                Object.keys(docs).forEach(key => {
                    if (docs[key] && !docs[key].status) {
                        docs[key] = { ...docs[key], status: p.isVerified ? 'verified' : 'pending' };
                    }
                });
            }

            return {
                id: p.id, // Profile ID as Request ID
                userId: p.userId,
                userName: p.user.name || 'Unknown',
                userEmail: p.user.email,
                userRole: p.user.role,
                documents: docs,
                status: p.isVerified ? 'verified' : 'pending',
                submittedAt: p.updatedAt.toLocaleString(), // Using update time as submission time
                verifiedAt: p.verifiedAt ? p.verifiedAt.toLocaleString() : null,
                verifiedBy: p.isVerified ? 'Admin' : null,
                notes: p.isVerified ? 'Verified' : 'Pending Review'
            };
        });

        return NextResponse.json({
            requests: kycRequests,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });

    } catch (error) {
        console.error('Fetch KYC requests error:', error);
        return NextResponse.json({ error: 'Failed to fetch KYC requests' }, { status: 500 });
    }
}
