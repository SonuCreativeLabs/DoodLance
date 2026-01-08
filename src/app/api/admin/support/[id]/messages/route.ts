import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { logAdminAction } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const ticketId = params.id;
        const body = await request.json();
        const { message } = body;

        // Verify ticket
        const ticket = await prisma.supportTicket.findUnique({
            where: { id: ticketId }
        });

        if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });

        // Create message
        const newMessage = await prisma.ticketMessage.create({
            data: {
                ticketId,
                senderId: 'admin', // Placeholder for admin ID
                message,
                isAdminReply: true
            }
        });

        // Update ticket updated_at and status
        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: {
                status: 'IN_PROGRESS',
                updatedAt: new Date()
            }
        });

        // Log
        await logAdminAction({
            adminId: 'admin-1',
            adminEmail: 'admin@doodlance.com',
            action: 'UPDATE',
            resource: 'SUPPORT_TICKET',
            resourceId: ticketId,
            details: { messageId: newMessage.id, content: message },
            request
        });

        const messages = await prisma.ticketMessage.findMany({
            where: { ticketId },
            orderBy: { createdAt: 'asc' }
        });

        const mappedMessages = messages.map(m => ({
            id: m.id,
            sender: m.isAdminReply ? 'Admin' : 'User',
            senderType: m.isAdminReply ? 'admin' : 'user',
            message: m.message,
            timestamp: m.createdAt.toLocaleString()
        }));

        return NextResponse.json({ messages: mappedMessages });

    } catch (error) {
        console.error('Send message error:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
