import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/user/profile - Get current user profile
export async function GET(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Query user from database
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                avatar: true,
                location: true,
                bio: true,
                gender: true,
                username: true,
                displayId: true,
                address: true,
                city: true,
                state: true,
                postalCode: true,
                role: true,
                currentRole: true,
                isVerified: true,
                phoneVerified: true,
                createdAt: true,
            }
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(dbUser);

    } catch (error) {
        console.error('[API] Error fetching user profile:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user profile' },
            { status: 500 }
        );
    }
}
