import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { addMessageSchema, validateRequest } from '@/lib/validations/admin';
import { logAdminAction } from '@/lib/audit-log';

// POST /api/admin/support/[id]/messages - Send a reply
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validate request
        const validation = validateRequest(addMessageSchema, body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const { message, senderId } = validation.data;
        // senderType usually determined by who is logged in. For admin API it's 'admin'.
        const senderType = 'admin';

        const adminEmail = 'admin@doodlance.com';
        // In real app, senderId should match logged in admin ID.

        const ticket = await prisma.supportTicket.findUnique({ where: { id } });
        if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });

        const currentMessages = ticket.messages ? JSON.parse(ticket.messages) : [];

        const newMessage = {
            id: `MSG${Date.now()}`,
            sender: 'Admin', // Or specific admin name
            senderType,
            message,
            timestamp: new Date().toLocaleString()
        };

        const updatedMessages = [...currentMessages, newMessage];

        await prisma.supportTicket.update({
            where: { id },
            data: {
                messages: JSON.stringify(updatedMessages),
                updatedAt: new Date() // bumping update time
            }
        });

        // Log action (optional for messages, but good for tracking)
        await logAdminAction({
            adminId: senderId,
            adminEmail,
            action: 'UPDATE',
            resource: 'SUPPORT_TICKET',
            resourceId: id,
            details: { action: 'reply', messageSnippet: message.substring(0, 50) },
            request
        });

        return NextResponse.json({ success: true, messages: updatedMessages });
    } catch (error) {
        console.error('Send message error:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
