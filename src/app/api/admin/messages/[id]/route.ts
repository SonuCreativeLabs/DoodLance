import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const conversation = await prisma.conversation.findUnique({
            where: { id },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                                role: true
                            }
                        }
                    }
                }
            }
        });

        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        // Fetch participants details manually as discussed
        const client = await prisma.user.findUnique({
            where: { id: conversation.clientId },
            select: { name: true, email: true, avatar: true }
        });
        const freelancer = await prisma.user.findUnique({
            where: { id: conversation.freelancerId },
            select: { name: true, email: true, avatar: true }
        });

        return NextResponse.json({
            ...conversation,
            client,
            freelancer
        });

    } catch (error) {
        console.error('Error fetching conversation details:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
