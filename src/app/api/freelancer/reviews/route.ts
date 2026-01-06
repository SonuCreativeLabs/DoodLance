export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';


async function getDbUser(supabaseUserId: string, email?: string) {
    if (!supabaseUserId) return null;
    let dbUser = await prisma.user.findUnique({ where: { supabaseUid: supabaseUserId } });
    if (!dbUser) {
        dbUser = await prisma.user.findUnique({ where: { id: supabaseUserId } });
    }
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

        const { searchParams } = new URL(request.url);
        let targetProfileId = searchParams.get('profileId');

        if (!targetProfileId) {
            const dbUser = await getDbUser(user.id, user.email);
            if (!dbUser) {
                return NextResponse.json({ reviews: [] });
            }

            const profile = await prisma.freelancerProfile.findUnique({
                where: { userId: dbUser.id },
                select: { id: true }
            });

            if (!profile) {
                return NextResponse.json({ reviews: [] });
            }
            targetProfileId = profile.id;
        }

        const reviews = await prisma.review.findMany({
            where: { profileId: targetProfileId },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ reviews });

    } catch (error) {
        console.error('Reviews fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}
