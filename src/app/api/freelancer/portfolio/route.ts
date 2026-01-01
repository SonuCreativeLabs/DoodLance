import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const profileId = searchParams.get('profileId');

        const portfolio = await prisma.portfolio.findMany({
            where: { userId: profileId || user.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ portfolio });

    } catch (error) {
        console.error('Portfolio fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, images, category, tags, client, completedAt, projectUrl } = body;

        const item = await prisma.portfolio.create({
            data: {
                userId: user.id,
                title,
                description,
                images: typeof images === 'string' ? images : JSON.stringify(images),
                category,
                tags: typeof tags === 'string' ? tags : JSON.stringify(tags),
                client,
                completedAt: completedAt ? new Date(completedAt) : new Date(),
                projectUrl
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

        const body = await request.json();
        const { id, title, description, images, category, tags, client, completedAt, projectUrl } = body;

        const item = await prisma.portfolio.update({
            where: { id, userId: user.id },
            data: {
                title,
                description,
                images: typeof images === 'string' ? images : JSON.stringify(images),
                category,
                tags: typeof tags === 'string' ? tags : JSON.stringify(tags),
                client,
                completedAt: completedAt ? new Date(completedAt) : null,
                projectUrl
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

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Portfolio ID required' }, { status: 400 });
        }

        await prisma.portfolio.delete({
            where: { id, userId: user.id }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Portfolio delete error:', error);
        return NextResponse.json({ error: 'Failed to delete portfolio item' }, { status: 500 });
    }
}
