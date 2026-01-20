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
    console.log('🔵 PATCH /api/user/username - START');
    try {
        console.log('🔵 Creating Supabase client...');
        const supabase = createClient()

        console.log('🔵 Getting user from Supabase...');
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            console.error('❌ Username update: No valid session found');
            console.error('Auth error:', authError);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = user.id;
        console.log('✅ User authenticated:', userId);

        console.log('🔵 Parsing request body...');
        const body = await request.json();
        const { username } = body;
        console.log('✅ Username from request:', username);

        if (!username) {
            console.log('❌ No username provided');
            return NextResponse.json(
                { error: 'Username is required' },
                { status: 400 }
            );
        }

        // Format username
        console.log('🔵 Formatting username...');
        const formattedUsername = formatUsername(username);
        console.log('✅ Formatted username:', formattedUsername);

        // Validate format
        console.log('🔵 Validating username format...');
        const validation = validateUsername(formattedUsername);
        console.log('✅ Validation result:', validation);

        if (!validation.valid) {
            console.log('❌ Invalid username format');
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            );
        }

        // Check if username is already taken by another user
        console.log('🔵 Checking if username exists...');
        const existingUser = await prisma.user.findUnique({
            where: { username: formattedUsername },
            select: { id: true },
        });
        console.log('✅ Existing user check:', existingUser);

        if (existingUser && existingUser.id !== userId) {
            console.log('❌ Username already taken');
            return NextResponse.json(
                { error: 'Username is already taken' },
                { status: 409 }
            );
        }

        // Update username (or create user if doesn't exist)
        console.log('🔵 Upserting username in database...');
        const updatedUser = await prisma.user.upsert({
            where: { id: userId },
            update: {
                username: formattedUsername
            },
            create: {
                id: userId,
                email: user.email!,
                username: formattedUsername,
                displayId: `DL${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                coords: '', // Default empty coords - will be updated when user sets location
            },
            select: {
                id: true,
                username: true,
                displayId: true,
            },
        });
        console.log('✅ Username updated successfully:', updatedUser);

        return NextResponse.json({
            success: true,
            username: updatedUser.username,
            profileUrl: `/${updatedUser.username}`,
            message: 'Username updated successfully',
        });
    } catch (error) {
        console.error('❌ Username update error:', error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            name: error instanceof Error ? error.name : 'Unknown',
        });
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
