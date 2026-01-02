import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/conversations - Get all conversations for the current user
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Determine if user is client or freelancer based on their profile existence or role
        // For simplicity efficiently, we check both fields
        const conversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    { clientId: userId },
                    { freelancerId: userId }
                ],
                isActive: true
            },
            include: {
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        // Enhance conversations with other participant's details
        const enhancedConversations = await Promise.all(conversations.map(async (conv: any) => {
            const isClient = conv.clientId === userId;
            const otherUserId = isClient ? conv.freelancerId : conv.clientId;

            const otherUser = await prisma.user.findUnique({
                where: { id: otherUserId },
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                    freelancerProfile: { select: { title: true } },
                    clientProfile: { select: { company: true } }
                }
            });

            return {
                id: conv.id,
                recipientId: otherUserId,
                recipientName: otherUser?.name || 'Unknown User',
                recipientAvatar: otherUser?.avatar || '/images/default-avatar.svg',
                recipientJobTitle: isClient
                    ? (otherUser?.freelancerProfile?.title || 'Freelancer')
                    : (otherUser?.clientProfile?.company || 'Client'),
                lastMessage: conv.lastMessage || '',
                unread: isClient ? conv.clientUnreadCount > 0 : conv.freelancerUnreadCount > 0,
                online: false, // We don't have real-time online status yet
                updatedAt: conv.updatedAt,
                jobId: conv.jobId
            };
        }));

        return NextResponse.json(enhancedConversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
    }
}

// POST /api/conversations - Create or get a conversation
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { currentUserId, otherUserId, jobId } = body;

        if (!currentUserId || !otherUserId) {
            return NextResponse.json({ error: 'Missing user IDs' }, { status: 400 });
        }

        // Check if conversation already exists (userIds could be swapped depending on who is who)
        // We need to know who is client and who is freelancer
        // Let's assume the frontend passes correct IDs or we check role

        // Quick check: find roles
        const [user1, user2] = await Promise.all([
            prisma.user.findUnique({ where: { id: currentUserId } }),
            prisma.user.findUnique({ where: { id: otherUserId } })
        ]);

        if (!user1 || !user2) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        let clientId, freelancerId;

        // Simple role assignment logic
        if (user1.role === 'client' && user2.role === 'freelancer') {
            clientId = user1.id;
            freelancerId = user2.id;
        } else if (user1.role === 'freelancer' && user2.role === 'client') {
            clientId = user2.id;
            freelancerId = user1.id;
        } else {
            // Fallback for same-role or undefined roles (shouldn't happen in happy path but safety)
            // Check profiles
            const user1IsClient = await prisma.clientProfile.findUnique({ where: { userId: user1.id } });
            if (user1IsClient) {
                clientId = user1.id;
                freelancerId = user2.id;
            } else {
                clientId = user2.id;
                freelancerId = user1.id;
            }
        }

        let conversation = await prisma.conversation.findFirst({
            where: {
                clientId,
                freelancerId,
                jobId: jobId || undefined
            }
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    clientId,
                    freelancerId,
                    jobId: jobId || undefined,
                    lastMessage: 'Started conversation',
                    lastMessageAt: new Date(),
                }
            });
        }

        return NextResponse.json(conversation);

    } catch (error) {
        console.error('Error creating conversation:', error);
        return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
    }
}
