import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

async function getDbUser(supabaseUserId: string, email?: string) {
    if (!supabaseUserId) return null;

    // First try by Supabase UID
    let dbUser = await prisma.user.findUnique({
        where: { supabaseUid: supabaseUserId }
    });

    // Fallback to ID (in case it IS a CUID, though unlikely from Supabase Auth)
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
            if (!dbUser) {
                // Return empty if user not found in DB
                return NextResponse.json({ availability: [] });
            }
            targetUserId = dbUser.id;
        }

        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: targetUserId },
            select: { availability: true }
        });

        if (!profile) {
            return NextResponse.json({ availability: [] });
        }

        let availability = [];
        if (profile.availability) {
            try {
                availability = typeof profile.availability === 'string'
                    ? JSON.parse(profile.availability)
                    : profile.availability;
            } catch {
                availability = [];
            }
        }

        return NextResponse.json({ availability });

    } catch (error) {
        console.error('Availability fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
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
        const { availability } = body;

        const availabilityString = typeof availability === 'string'
            ? availability
            : JSON.stringify(availability);

        await prisma.freelancerProfile.upsert({
            where: { userId: dbUser.id },
            update: { availability: availabilityString },
            create: {
                userId: dbUser.id,
                availability: availabilityString,
                title: '',
                about: '',
                skills: '[]',
                specializations: '[]',
                // languages removed
                coords: JSON.stringify([0, 0]), // Required
                hourlyRate: 0,
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
        console.error('Availability update error:', error);
        return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 });
    }
}
