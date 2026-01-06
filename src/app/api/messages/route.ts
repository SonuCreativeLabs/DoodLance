import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/messages - Get messages for a conversation
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const conversationId = searchParams.get('conversationId');
        const userId = searchParams.get('userId'); // Current user requesting messages (to mark as read)

        if (!conversationId) {
            return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
        }

        const messages = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                }
            }
        });

        // Mark messages as read if userId provided
        if (userId) {
            // Ideally we'd do this async without blocking return, but fine for now
            await prisma.message.updateMany({
                where: {
                    conversationId,
                    senderId: { not: userId },
                    isRead: false
                },
                data: {
                    isRead: true,
                    readAt: new Date()
                }
            });

            // Reset unread count on conversation
            const conversation = await prisma.conversation.findUnique({
                where: { id: conversationId }
            });

            if (conversation) {
                const isClient = conversation.clientId === userId;
                await prisma.conversation.update({
                    where: { id: conversationId },
                    data: {
                        [isClient ? 'clientUnreadCount' : 'freelancerUnreadCount']: 0
                    }
                });
            }
        }

        return NextResponse.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

// POST /api/messages - Send a message
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { conversationId, senderId, content, attachments } = body;

        if (!conversationId || !senderId || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create message
        const message = await prisma.message.create({
            data: {
                conversationId,
                senderId,
                content,
                attachments: attachments || '[]',
                isDelivered: true,
                deliveredAt: new Date()
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                }
            }
        });

        // Update conversation last message and unread count
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId }
        });

        if (conversation) {
            const isSenderClient = conversation.clientId === senderId;

            await prisma.conversation.update({
                where: { id: conversationId },
                data: {
                    lastMessage: content,
                    lastMessageAt: new Date(),
                    [isSenderClient ? 'freelancerUnreadCount' : 'clientUnreadCount']: { increment: 1 }
                }
            });
        }

        return NextResponse.json(message);

    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
