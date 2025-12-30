import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { validateUsername, formatUsername } from '@/lib/username-utils';

export const dynamic = 'force-dynamic';

/**
 * GET /api/username/check?username=sathishraj
 * Check if username is available and valid
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');

        if (!username) {
            return NextResponse.json(
                {
                    available: false,
                    valid: false,
                    message: 'Username is required',
                },
                { status: 400 }
            );
        }

        // Format username
        const formattedUsername = formatUsername(username);

        // Validate format and check reserved words
        const validation = validateUsername(formattedUsername);
        if (!validation.valid) {
            return NextResponse.json({
                available: false,
                valid: false,
                message: validation.error,
            });
        }

        // Check if username is already taken
        const existingUser = await prisma.user.findUnique({
            where: { username: formattedUsername },
            select: { id: true },
        });

        if (existingUser) {
            return NextResponse.json({
                available: false,
                valid: true,
                message: 'Username is already taken',
            });
        }

        // Username is available
        return NextResponse.json({
            available: true,
            valid: true,
            message: 'Username is available',
        });
    } catch (error) {
        console.error('Username check error:', error);
        return NextResponse.json(
            {
                available: false,
                valid: false,
                message: 'Error checking username availability',
            },
            { status: 500 }
        );
    }
}
