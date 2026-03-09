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
        const adminEmail = 'admin@bails.in';
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

// DELETE /api/admin/transactions/[id] - Delete and archive transaction
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // 1. Get the transaction data
        const transaction = await prisma.transaction.findUnique({
            where: { id },
            include: { wallet: { include: { user: true } } }
        });

        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        // 2. Archive the transaction
        // @ts-ignore - Property exists at runtime but IDE may lag on generated client
        await prisma.archivedItem.create({
            data: {
                resourceType: 'TRANSACTION',
                resourceId: id,
                data: JSON.parse(JSON.stringify(transaction)),
                deletedBy: 'admin@bails.in'
            }
        });

        // 3. Delete the transaction
        await prisma.transaction.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: 'Transaction deleted and archived' });
    } catch (error) {
        console.error('Delete transaction error:', error);
        return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
    }
}
