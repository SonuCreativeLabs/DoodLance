import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { updateBookingSchema, validateRequest } from '@/lib/validations/admin';
import { logAdminAction } from '@/lib/audit-log';

// PATCH /api/admin/bookings/[id] - Update booking status
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validate request
        const validation = validateRequest(updateBookingSchema, body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const { status, notes } = validation.data;
        const adminEmail = 'admin@bails.in';
        const adminId = 'admin-1';

        const updated = await prisma.booking.update({
            where: { id },
            data: {
                status,
                ...(status === 'COMPLETED' ? { completedAt: new Date() } : {})
            }
        });

        // Log action
        await logAdminAction({
            adminId,
            adminEmail,
            action: 'UPDATE',
            resource: 'BOOKING',
            resourceId: id,
            details: { status, notes },
            request
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Update booking error:', error);
        return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }
}
