import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

async function getDbUser(supabaseUserId: string, email?: string) {
    if (!supabaseUserId) return null;

    // First try by supabaseUid
    let dbUser = await prisma.user.findUnique({
        where: { supabaseUid: supabaseUserId }
    });

    // Fallback to ID
    if (!dbUser) {
        dbUser = await prisma.user.findUnique({
            where: { id: supabaseUserId }
        });
    }

    // Fallback to email
    if (!dbUser && email) {
        dbUser = await prisma.user.findUnique({
            where: { email }
        });
    }

    return dbUser;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userIdParam = searchParams.get('userId');

        let targetUserId: string;

        if (userIdParam) {
            targetUserId = userIdParam;
        } else {
            const supabase = createClient();
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }

            const dbUser = await getDbUser(user.id, user.email);
            if (!dbUser) return NextResponse.json({ listings: [] });
            targetUserId = dbUser.id;
        }

        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: targetUserId },
            select: { listings: true }
        });

        if (!profile) {
            return NextResponse.json({ listings: [] });
        }

        let listings = [];
        if (profile.listings) {
            try {
                listings = typeof profile.listings === 'string'
                    ? JSON.parse(profile.listings)
                    : profile.listings;
            } catch {
                listings = [];
            }
        }

        return NextResponse.json({ listings });

    } catch (error) {
        console.error('Listings fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await getDbUser(user.id, user.email);
        if (!dbUser) return NextResponse.json({ error: 'User not found in database' }, { status: 404 });

        const body = await request.json();
        const { listings } = body;

        const listingsString = typeof listings === 'string'
            ? listings
            : JSON.stringify(listings);

        await prisma.freelancerProfile.upsert({
            where: { userId: dbUser.id },
            update: { listings: listingsString },
            create: {
                userId: dbUser.id,
                listings: listingsString,
                title: '',
                about: '',
                skills: '[]',
                specializations: '[]',
                coords: JSON.stringify([0, 0]),
                hourlyRate: 0,
                availability: "[]",
                rating: 0,
                reviewCount: 0,
                completedJobs: 0,
                serviceRadius: 0,
                advanceNoticeHours: 0,
                totalEarnings: 0,
                thisMonthEarnings: 0,
                avgProjectValue: 0,
                isOnline: false,
                isProfilePublic: true
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Listings update error:', error);
        return NextResponse.json({ error: 'Failed to update listings' }, { status: 500 });
    }
}
