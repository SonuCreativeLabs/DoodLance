import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userIdParam = searchParams.get('userId');

        // If userId is provided in query (client viewing freelancer), use that
        // Otherwise, get from auth (freelancer viewing their own)
        let targetUserId: string;

        if (userIdParam) {
            // Public access - client viewing a freelancer's availability listings
            targetUserId = userIdParam;
        } else {
            // Authenticated access - freelancer viewing their own
            const supabase = createClient();
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }

            targetUserId = user.id;
        }

        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: targetUserId },
            select: { listings: true }
        });

        if (!profile) {
            return NextResponse.json({ listings: [] });
        }

        // Parse listings JSON string
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

        const body = await request.json();
        const { listings } = body;

        // Stringify listings for storage
        const listingsString = typeof listings === 'string'
            ? listings
            : JSON.stringify(listings);

        await prisma.freelancerProfile.upsert({
            where: { userId: user.id },
            update: { listings: listingsString },
            create: {
                userId: user.id,
                listings: listingsString,
                title: '',
                about: '',
                skills: '[]',
                specializations: '[]',
                languages: 'English',
                coords: '[0,0]',
                hourlyRate: 0,
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Listings update error:', error);
        return NextResponse.json({ error: 'Failed to update listings' }, { status: 500 });
    }
}
