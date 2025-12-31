import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/support - Get support tickets for a user
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const tickets = await prisma.supportTicket.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        return NextResponse.json(tickets);

    } catch (error) {
        console.error('Error fetching support tickets:', error);
        return NextResponse.json({ error: 'Failed to fetch support tickets' }, { status: 500 });
    }
}

// POST /api/support - Create a new support ticket
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, category, subject, description, priority } = body;

        if (!userId || !category || !subject || !description) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const ticket = await prisma.supportTicket.create({
            data: {
                userId,
                category,
                subject,
                description,
                priority: priority || 'MEDIUM',
                status: 'OPEN'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        // TODO: Notify admins about new ticket
        // eventEmitter.emit('newSupportTicket', { ticketId: ticket.id });

        return NextResponse.json(ticket, { status: 201 });

    } catch (error) {
        console.error('Error creating support ticket:', error);
        return NextResponse.json({ error: 'Failed to create support ticket' }, { status: 500 });
    }
}
