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

        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: user.id },
            select: { availability: true }
        });

        if (!profile) {
            return NextResponse.json({ availability: [] });
        }

        // Parse availability JSON string
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

        const body = await request.json();
        const { availability } = body;

        // Stringify availability for storage
        const availabilityString = typeof availability === 'string'
            ? availability
            : JSON.stringify(availability);

        await prisma.freelancerProfile.upsert({
            where: { userId: user.id },
            update: { availability: availabilityString },
            create: {
                userId: user.id,
                availability: availabilityString,
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
        console.error('Availability update error:', error);
        return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 });
    }
}
