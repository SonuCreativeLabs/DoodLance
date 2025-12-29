import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { updatePromoSchema, validateRequest } from '@/lib/validations/admin';
import { logAdminAction } from '@/lib/audit-log';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validate request
        const validation = validateRequest(updatePromoSchema, body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const adminEmail = 'admin@doodlance.com';
        const adminId = 'admin-1';

        const updated = await prisma.promoCode.update({
            where: { id },
            data: validation.data
        });

        // Log action
        await logAdminAction({
            adminId,
            adminEmail,
            action: 'UPDATE',
            resource: 'PROMO',
            resourceId: id,
            details: body,
            request
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Update promo error:', error);
        return NextResponse.json({ error: 'Failed to update promo' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const adminEmail = 'admin@doodlance.com';
        const adminId = 'admin-1';

        await prisma.promoCode.delete({
            where: { id }
        });

        // Log action
        await logAdminAction({
            adminId,
            adminEmail,
            action: 'DELETE',
            resource: 'PROMO',
            resourceId: id,
            request
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete promo error:', error);
        return NextResponse.json({ error: 'Failed to delete promo' }, { status: 500 });
    }
}
