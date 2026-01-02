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
            // Public access - client viewing a freelancer's settings
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
            select: {
                serviceRadius: true,
                advanceNoticeHours: true
            }
        });

        if (!profile) {
            return NextResponse.json({
                serviceRadius: 10,
                advanceNoticeHours: 0
            });
        }

        return NextResponse.json({
            serviceRadius: profile.serviceRadius || 10,
            advanceNoticeHours: profile.advanceNoticeHours || 0
        });

    } catch (error) {
        console.error('Availability settings fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch availability settings' }, { status: 500 });
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
        const { serviceRadius, advanceNoticeHours } = body;

        await prisma.freelancerProfile.upsert({
            where: { userId: user.id },
            update: {
                serviceRadius: serviceRadius !== undefined ? parseFloat(serviceRadius) : undefined,
                advanceNoticeHours: advanceNoticeHours !== undefined ? parseInt(advanceNoticeHours) : undefined
            },
            create: {
                userId: user.id,
                serviceRadius: serviceRadius !== undefined ? parseFloat(serviceRadius) : 10,
                advanceNoticeHours: advanceNoticeHours !== undefined ? parseInt(advanceNoticeHours) : 0,
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
        console.error('Availability settings update error:', error);
        return NextResponse.json({ error: 'Failed to update availability settings' }, { status: 500 });
    }
}
