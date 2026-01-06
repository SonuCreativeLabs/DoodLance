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
            if (!dbUser) return NextResponse.json({
                serviceRadius: 10,
                advanceNoticeHours: 0
            });
            targetUserId = dbUser.id;
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

        const dbUser = await getDbUser(user.id, user.email);
        if (!dbUser) return NextResponse.json({ error: 'User not found in database' }, { status: 404 });

        const body = await request.json();
        const { serviceRadius, advanceNoticeHours } = body;

        await prisma.freelancerProfile.upsert({
            where: { userId: dbUser.id },
            update: {
                serviceRadius: serviceRadius !== undefined ? parseFloat(serviceRadius) : undefined,
                advanceNoticeHours: advanceNoticeHours !== undefined ? parseInt(advanceNoticeHours) : undefined
            },
            create: {
                userId: dbUser.id,
                serviceRadius: serviceRadius !== undefined ? parseFloat(serviceRadius) : 10,
                advanceNoticeHours: advanceNoticeHours !== undefined ? parseInt(advanceNoticeHours) : 0,
                title: '',
                about: '',
                skills: '[]',
                specializations: '[]',
                // languages removed
                coords: JSON.stringify([0, 0]),
                hourlyRate: 0,
                availability: "[]",
                rating: 0,
                reviewCount: 0,
                completedJobs: 0,
                totalEarnings: 0,
                thisMonthEarnings: 0,
                avgProjectValue: 0,
                isOnline: false,
                isProfilePublic: true
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Availability settings update error:', error);
        return NextResponse.json({ error: 'Failed to update availability settings' }, { status: 500 });
    }
}
