import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

async function getDbUser(supabaseUserId: string, email?: string) {
    if (!supabaseUserId) return null;

    // First try by ID (most reliable if synced)
    let dbUser = await prisma.user.findUnique({
        where: { id: supabaseUserId }
    });

    // Fallback to email if ID mismatch (common after seed/re-auth)
    if (!dbUser && email) {
        dbUser = await prisma.user.findUnique({
            where: { email }
        });
    }

    return dbUser;
}

export async function GET(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        let targetProfileId = searchParams.get('profileId');

        // If no explicit profileId, find the current user's profile
        if (!targetProfileId) {
            const dbUser = await getDbUser(user.id, user.email);
            if (!dbUser) {
                return NextResponse.json({ portfolio: [] });
            }

            const profile = await prisma.freelancerProfile.findUnique({
                where: { userId: dbUser.id },
                select: { id: true }
            });

            if (!profile) {
                return NextResponse.json({ portfolio: [] });
            }
            targetProfileId = profile.id;
        }

        const portfolio = await prisma.portfolio.findMany({
            where: { profileId: targetProfileId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ portfolio });

    } catch (error) {
        console.error('Portfolio fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch portfolio' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await getDbUser(user.id, user.email);
        if (!dbUser) return NextResponse.json({ error: 'User not found in database' }, { status: 404 });

        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: dbUser.id }
        });

        if (!profile) {
            return NextResponse.json({ error: 'Freelancer profile not found. Please create a profile first.' }, { status: 404 });
        }

        const body = await request.json();
        const { title, description, images, category, skills, clientName, completedAt } = body;

        const item = await prisma.portfolio.create({
            data: {
                profileId: profile.id, // Correctly link to Profile
                title,
                description,
                images: typeof images === 'string' ? images : JSON.stringify(images || []),
                category: category || 'Other',
                skills: typeof skills === 'string' ? skills : JSON.stringify(skills || []),
                clientName,
                completedAt: completedAt ? new Date(completedAt) : null,
            }
        });

        return NextResponse.json({ item });

    } catch (error) {
        console.error('Portfolio create error:', error);
        return NextResponse.json({ error: 'Failed to create portfolio item' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await getDbUser(user.id, user.email);
        if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: dbUser.id }
        });
        if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

        const body = await request.json();
        const { id, title, description, images, category, skills, clientName, completedAt } = body;

        // Verify ownership via profileId
        const existingItem = await prisma.portfolio.findUnique({
            where: { id },
        });

        if (!existingItem || existingItem.profileId !== profile.id) {
            return NextResponse.json({ error: 'Portfolio item not found or unauthorized' }, { status: 403 });
        }

        const item = await prisma.portfolio.update({
            where: { id },
            data: {
                title,
                description,
                images: typeof images === 'string' ? images : JSON.stringify(images || []),
                category,
                skills: typeof skills === 'string' ? skills : JSON.stringify(skills || []),
                clientName,
                completedAt: completedAt ? new Date(completedAt) : null,
            }
        });

        return NextResponse.json({ item });

    } catch (error) {
        console.error('Portfolio update error:', error);
        return NextResponse.json({ error: 'Failed to update portfolio item' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await getDbUser(user.id, user.email);
        if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: dbUser.id }
        });
        if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Portfolio ID required' }, { status: 400 });
        }

        // Verify ownership
        const existingItem = await prisma.portfolio.findUnique({
            where: { id },
        });

        if (!existingItem || existingItem.profileId !== profile.id) {
            return NextResponse.json({ error: 'Portfolio item not found or unauthorized' }, { status: 403 });
        }

        await prisma.portfolio.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Portfolio delete error:', error);
        return NextResponse.json({ error: 'Failed to delete portfolio item' }, { status: 500 });
    }
}
