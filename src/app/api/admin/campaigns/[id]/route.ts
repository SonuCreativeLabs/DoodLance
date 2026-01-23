import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Helper to verify admin session
async function verifyAdminSession(request: NextRequest) {
    const authToken = request.cookies.get('auth-token')?.value;
    if (!authToken) return null;

    try {
        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET || 'fallback-secret-for-dev'
        );
        const { payload } = await jwtVerify(authToken, secret);
        if (payload.role !== 'ADMIN') return null;
        return { adminId: payload.userId as string, adminEmail: payload.email as string };
    } catch { return null; }
}

// PATCH /api/admin/campaigns/[id] - Update campaign details
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const admin = await verifyAdminSession(request);
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, contactEmail, contactPhone } = body;

        const updated = await prisma.campaign.update({
            where: { id: params.id },
            data: {
                name,
                contactEmail,
                contactPhone
            }
        });

        return NextResponse.json({ success: true, campaign: updated });
    } catch (error) {
        console.error('Campaign update error:', error);
        return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
    }
}
