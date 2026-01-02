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
        let targetProfileId = searchParams.get('profileId');

        if (!targetProfileId) {
            const profile = await prisma.freelancerProfile.findUnique({
                where: { userId: user.id },
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
