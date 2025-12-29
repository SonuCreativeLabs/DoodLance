import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { updateServiceSchema, validateRequest } from '@/lib/validations/admin';
import { logAdminAction } from '@/lib/audit-log';

// PATCH /api/admin/services/[id] - Update service (approve, reject, toggle active)
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validate request
        const validation = validateRequest(updateServiceSchema, body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const { action, title, description, price, isActive } = validation.data;
        const adminEmail = 'admin@doodlance.com';
        const adminId = 'admin-1';

        let updateData: any = {};
        let logAction = 'UPDATE';

        if (action === 'approve') {
            updateData.isActive = true;
            logAction = 'APPROVE';
        } else if (action === 'reject') {
            updateData.isActive = false;
            logAction = 'REJECT';
        } else if (action === 'toggle_active') {
            // We need current status to toggle
            const current = await prisma.service.findUnique({ where: { id }, select: { isActive: true } });
            if (current) updateData.isActive = !current.isActive;
            logAction = 'UPDATE';
        } else {
            // Regular update
            if (title) updateData.title = title;
            if (description) updateData.description = description;
            if (price) updateData.price = price;
            if (isActive !== undefined) updateData.isActive = isActive;
        }

        const updated = await prisma.service.update({
            where: { id },
            data: updateData
        });

        // Log action
        await logAdminAction({
            adminId,
            adminEmail,
            action: logAction as any,
            resource: 'SERVICE',
            resourceId: id,
            details: updateData,
            request
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Update service error:', error);
        return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
    }
}

// DELETE /api/admin/services/[id] - Delete service
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const adminEmail = 'admin@doodlance.com';
        const adminId = 'admin-1';

        await prisma.service.delete({
            where: { id }
        });

        // Log action
        await logAdminAction({
            adminId,
            adminEmail,
            action: 'DELETE',
            resource: 'SERVICE',
            resourceId: id,
            request
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete service error:', error);
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}
