import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { updateTicketSchema, validateRequest } from '@/lib/validations/admin';
import { logAdminAction } from '@/lib/audit-log';

// GET /api/admin/support/[id] - Get details
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const ticket = await prisma.supportTicket.findUnique({
            where: { id }
        });

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        // Fetch user details
        let userDetails = { name: 'Unknown', email: '', role: '' };
        if (ticket.userId) {
            const u = await prisma.user.findUnique({ where: { id: ticket.userId } });
            if (u) {
                userDetails = { name: u.name, email: u.email, role: u.role };
            }
        }

        return NextResponse.json({
            ...ticket,
            messages: ticket.messages ? JSON.parse(ticket.messages) : [],
            category: ticket.type.toLowerCase(),
            userName: userDetails.name,
            userEmail: userDetails.email,
            userRole: userDetails.role,
            createdAt: ticket.createdAt.toLocaleString(),
            updatedAt: ticket.updatedAt.toLocaleString()
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch ticket' }, { status: 500 });
    }
}

// PATCH /api/admin/support/[id] - Update status/priority
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validate request
        const validation = validateRequest(updateTicketSchema, body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const { status, priority } = validation.data;
        const adminEmail = 'admin@doodlance.com';
        const adminId = 'admin-1';

        // If updating status to RESOLVED, set resolvedAt
        const updateData: any = {};
        if (status === 'RESOLVED') {
            updateData.status = 'RESOLVED';
            updateData.resolvedAt = new Date();
        } else if (status) {
            updateData.status = status;
        }

        if (priority) updateData.priority = priority;

        const updated = await prisma.supportTicket.update({
            where: { id },
            data: updateData
        });

        // Log action
        await logAdminAction({
            adminId,
            adminEmail,
            action: 'UPDATE',
            resource: 'SUPPORT_TICKET',
            resourceId: id,
            details: updateData,
            request
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
    }
}
