import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { updateTransactionSchema, validateRequest } from '@/lib/validations/admin';
import { logAdminAction } from '@/lib/audit-log';

// PATCH /api/admin/transactions/[id] - Update transaction status
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validate request
        const validation = validateRequest(updateTransactionSchema, body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const { status } = validation.data;
        const adminEmail = 'admin@doodlance.com';
        const adminId = 'admin-1';

        const updated = await prisma.transaction.update({
            where: { id },
            data: { status }
        });

        // Log action
        await logAdminAction({
            adminId,
            adminEmail,
            action: 'UPDATE',
            resource: 'TRANSACTION',
            resourceId: id,
            details: { status },
            request
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Update transaction error:', error);
        return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
    }
}
