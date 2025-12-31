import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// PATCH /api/support/[id] - Update ticket status or add admin response
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { status, priority, assignedTo, adminResponse } = body;

        const updateData: any = {};

        if (status) updateData.status = status;
        if (priority) updateData.priority = priority;
        if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
        if (status) updateData.updatedAt = new Date();

        const ticket = await prisma.supportTicket.update({
            where: { id: params.id },
            data: updateData
        });

        // If admin response provided, create a message
        if (adminResponse) {
            await prisma.ticketMessage.create({
                data: {
                    ticketId: params.id,
                    senderId: assignedTo || 'admin',
                    message: adminResponse,
                    isAdminReply: true
                }
            });
        }

        return NextResponse.json(ticket);

    } catch (error) {
        console.error('Error updating support ticket:', error);
        return NextResponse.json({ error: 'Failed to update support ticket' }, { status: 500 });
    }
}

// GET /api/support/[id] - Get specific ticket details
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const ticket = await prisma.supportTicket.findUnique({
            where: { id: params.id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        return NextResponse.json(ticket);

    } catch (error) {
        console.error('Error fetching support ticket:', error);
        return NextResponse.json({ error: 'Failed to fetch support ticket' }, { status: 500 });
    }
}
