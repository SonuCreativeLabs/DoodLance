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

        // For now, we'll use User.isVerified field
        // In production, you'd have a separate KYCRequest table
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Map status filter to isVerified
        if (status === 'verified') {
            where.isVerified = true;
        } else if (status === 'pending' || status === 'rejected') {
            where.isVerified = false;
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isVerified: true,
                    createdAt: true,
                    updatedAt: true
                }
            }),
            prisma.user.count({ where })
        ]);

        // Map to KYC format
        const kycRequests = users.map((u: any) => ({
            id: `KYC${u.id.substring(0, 6).toUpperCase()}`,
            userId: u.id,
            userName: u.name,
            userEmail: u.email,
            userRole: u.role.toLowerCase(),
            documents: {
                idProof: { type: 'Placeholder', status: u.isVerified ? 'verified' : 'pending', file: 'doc.pdf' },
                addressProof: { type: 'Placeholder', status: u.isVerified ? 'verified' : 'pending', file: 'doc.pdf' },
                panCard: { type: 'Placeholder', status: u.isVerified ? 'verified' : 'pending', file: 'doc.pdf' }
            },
            status: u.isVerified ? 'verified' : 'pending',
            submittedAt: u.createdAt.toLocaleString(),
            verifiedAt: u.isVerified ? u.updatedAt.toLocaleString() : null,
            verifiedBy: u.isVerified ? 'Admin' : null,
            notes: u.isVerified ? 'Verified successfully' : 'Awaiting verification'
        }));

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
