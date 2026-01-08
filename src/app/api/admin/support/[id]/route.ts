import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const ticketId = params.id;
        const body = await request.json();
        const { status, assignedTo } = body;

        const updateData: any = {};
        if (status) updateData.status = status;
        if (assignedTo !== undefined) updateData.assignedTo = assignedTo;

        const updatedTicket = await prisma.supportTicket.update({
            where: { id: ticketId },
            data: updateData
        });

        return NextResponse.json(updatedTicket);

    } catch (error) {
        console.error('Update ticket error:', error);
        return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
    }
}
