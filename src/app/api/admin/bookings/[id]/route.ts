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

// DELETE /api/admin/bookings/[id] - Delete and archive a booking
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // 1. Fetch the booking with all related data to archive it
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                client: true,
                service: true,
            }
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // 2. Archive the booking
        // @ts-ignore - Property exists at runtime but IDE may lag on generated client
        await prisma.archivedItem.create({
            data: {
                resourceType: 'BOOKING',
                resourceId: id,
                data: JSON.parse(JSON.stringify(booking)), // Ensure it's serializable
                deletedBy: 'Admin', // In a real app, get from session
            }
        });

        // 3. Delete the booking
        // Delete associated reviews first if they exist
        await prisma.review.deleteMany({
            where: { bookingId: id }
        });

        await prisma.booking.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: 'Booking archived and deleted' });
    } catch (error) {
        console.error('Delete booking error:', error);
        return NextResponse.json({
            error: 'Failed to delete booking',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
