import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        // Get user from Supabase auth
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get database user
        const dbUser = await prisma.user.findUnique({
            where: { supabaseUid: user.id }
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { pausedDates } = await request.json();

        if (!Array.isArray(pausedDates)) {
            return NextResponse.json({ error: 'pausedDates must be an array' }, { status: 400 });
        }

        // Get existing listings
        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: dbUser.id },
            select: { listings: true }
        });

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // Parse existing listings or create new object
        let listings: any = {};
        try {
            listings = profile.listings ? JSON.parse(profile.listings) : {};
        } catch (error) {
            console.error('Error parsing existing listings:', error);
            listings = {};
        }

        // Update paused dates
        listings.pausedDates = pausedDates;

        // Save back to database
        await prisma.freelancerProfile.update({
            where: { userId: dbUser.id },
            data: { listings: JSON.stringify(listings) }
        });

        return NextResponse.json({ success: true, pausedDates });

    } catch (error) {
        console.error('Error saving paused dates:', error);
        return NextResponse.json(
            { error: 'Failed to save paused dates' },
            { status: 500 }
        );
    }
}
