export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';


async function getDbUser(supabaseUserId: string, email?: string) {
    if (!supabaseUserId) return null;

    // First try by supabaseUid
    let dbUser = await prisma.user.findUnique({ where: { supabaseUid: supabaseUserId } });

    // Fallback to ID
    if (!dbUser) {
        dbUser = await prisma.user.findUnique({ where: { id: supabaseUserId } });
    }

    // Fallback to email
    if (!dbUser && email) {
        dbUser = await prisma.user.findUnique({ where: { email } });
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

        // Fetch from Prisma with robust lookup
        const dbUser = await getDbUser(user.id, user.email);
        if (!dbUser) {
            return NextResponse.json({ profile: null });
        }

        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: dbUser.id },
        });

        if (!profile) {
            return NextResponse.json({ profile: null });
        }

        return NextResponse.json({ profile });

    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}
