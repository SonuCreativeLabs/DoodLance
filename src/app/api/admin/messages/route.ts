import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const skip = (page - 1) * limit;

        const where = search ? {
            OR: [
                { id: { contains: search } },
                { lastMessage: { contains: search, mode: 'insensitive' } },
                // Simple search on conversation ID or message content
            ]
        } : {};

        const [conversations, total] = await Promise.all([
            prisma.conversation.findMany({
                where,
                skip,
                take: limit,
                orderBy: { updatedAt: 'desc' },
                include: {
                    messages: {
                        take: 1,
                        orderBy: { createdAt: 'desc' }
                    }
                    // We would ideally like to include client and freelancer details,
                    // but the schema relates them via ID, not a direct Relation field in Conversation?
                    // Wait, let me check schema again. schema lines 238-257.
                    // clientId and freelancerId are fields, but NO relation field is defined in Conversation model to User!
                    // This is a schema limitation. We have to fetch users separately or fix schema.
                    // Fix schema is 'Phase 0' work, I should report it or work around it.
                    // I'll fetch users manually or assumed they are related?
                    // Looking at line 276: sender User @relation(...) in Message.
                    // But Conversation doesn't seem to have `client User` or `freelancer User`.
                }
            }),
            prisma.conversation.count({ where })
        ]);

        // Workaround: manual fetch of user names
        // This is N+1 but acceptable for admin panel with pagination 10
        const enhancedConversations = await Promise.all(conversations.map(async (conv) => {
            const client = await prisma.user.findUnique({
                where: { id: conv.clientId },
                select: { name: true, email: true, avatar: true }
            });
            const freelancer = await prisma.user.findUnique({
                where: { id: conv.freelancerId },
                select: { name: true, email: true, avatar: true }
            });

            return {
                ...conv,
                clientName: client?.name || 'Unknown',
                clientEmail: client?.email || '',
                freelancerName: freelancer?.name || 'Unknown',
                freelancerEmail: freelancer?.email || '',
            };
        }));

        return NextResponse.json({
            conversations: enhancedConversations,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
