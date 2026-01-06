import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { validateUsername, formatUsername } from '@/lib/username-utils';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/user/username
 * Update user's username
 */
export async function PATCH(request: NextRequest) {
    try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            console.error('Username update: No valid session found');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = user.id;

        const body = await request.json();
        const { username } = body;

        if (!username) {
            return NextResponse.json(
                { error: 'Username is required' },
                { status: 400 }
            );
        }

        // Format username
        const formattedUsername = formatUsername(username);

        // Validate format
        const validation = validateUsername(formattedUsername);
        if (!validation.valid) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            );
        }

        // Check if username is already taken by another user
        const existingUser = await prisma.user.findUnique({
            where: { username: formattedUsername },
            select: { id: true },
        });

        if (existingUser && existingUser.id !== userId) {
            return NextResponse.json(
                { error: 'Username is already taken' },
                { status: 409 }
            );
        }

        // Update username
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { username: formattedUsername },
            select: {
                id: true,
                username: true,
                displayId: true,
            },
        });

        return NextResponse.json({
            success: true,
            username: updatedUser.username,
            profileUrl: `/${updatedUser.username}`,
            message: 'Username updated successfully',
        });
    } catch (error) {
        console.error('Username update error:', error);
        return NextResponse.json(
            {
                error: 'Failed to update username',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/user/username
 * Remove user's username (make profile private)
 */
export async function DELETE(request: NextRequest) {
    try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = user.id;

        // Remove username
        await prisma.user.update({
            where: { id: userId },
            data: { username: null },
        });

        return NextResponse.json({
            success: true,
            message: 'Username removed successfully',
        });
    } catch (error) {
        console.error('Username delete error:', error);
        return NextResponse.json(
            { error: 'Failed to remove username' },
            { status: 500 }
        );
    }
}
