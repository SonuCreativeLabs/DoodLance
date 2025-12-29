import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { updateKYCSchema, validateRequest } from '@/lib/validations/admin';
import { logAdminAction } from '@/lib/audit-log';

// PATCH /api/admin/verification/[id] - Verify or reject KYC
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validate request
        const validation = validateRequest(updateKYCSchema, body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const { action, notes } = validation.data;
        const adminEmail = 'admin@doodlance.com';
        const adminId = 'admin-1';

        // Extract user ID from KYC ID (format: KYCxxxxxx)
        const userId = id.replace('KYC', '');

        if (action === 'verify') {
            await prisma.user.update({
                where: { id: userId },
                data: { isVerified: true }
            });

            await logAdminAction({
                adminId,
                adminEmail,
                action: 'VERIFY',
                resource: 'KYC',
                resourceId: id,
                details: { userId },
                request
            });

            return NextResponse.json({ success: true, status: 'verified' });
        }

        if (action === 'reject') {
            await prisma.user.update({
                where: { id: userId },
                data: { isVerified: false }
            });

            await logAdminAction({
                adminId,
                adminEmail,
                action: 'REJECT',
                resource: 'KYC',
                resourceId: id,
                details: { userId, notes },
                request
            });

            return NextResponse.json({ success: true, status: 'rejected', notes });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Update KYC error:', error);
        return NextResponse.json({ error: 'Failed to update KYC' }, { status: 500 });
    }
}
