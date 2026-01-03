import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

async function getDbUser(supabaseUserId: string, email?: string) {
    if (!supabaseUserId) return null;
    let dbUser = await prisma.user.findUnique({ where: { id: supabaseUserId } });
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

        const dbUser = await getDbUser(user.id, user.email);

        let settings = null;
        let email = user.email;

        // Only try to fetch profile if we found a DB User
        if (dbUser) {
            email = dbUser.email;
            const profile = await prisma.freelancerProfile.findUnique({
                where: { userId: dbUser.id },
                select: { notificationSettings: true }
            });
            if (profile?.notificationSettings) {
                try {
                    settings = JSON.parse(profile.notificationSettings);
                } catch (e) {
                    console.error("Error parsing settings:", e);
                }
            }
        }

        return NextResponse.json({
            email: email,
            settings: settings || {
                jobAlerts: true,
                messageNotifications: true,
                paymentNotifications: true,
                marketingEmails: false
            }
        });

    } catch (error) {
        console.error('Settings fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await getDbUser(user.id, user.email);
        if (!dbUser) {
            // If user simply doesn't exist in DB yet, we might want to fail gracefully or auto-create?
            // For settings, failing is appropriate as profile should exist.
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await request.json();
        const { notifications, email } = body;

        // Update notifications if provided
        if (notifications) {
            // Upsert profile if missing?
            // "Settings" implies Profile Settings.
            // If profile missing, create it.

            const settingsString = JSON.stringify(notifications);

            await prisma.freelancerProfile.upsert({
                where: { userId: dbUser.id },
                update: {
                    notificationSettings: settingsString
                },
                create: {
                    userId: dbUser.id,
                    notificationSettings: settingsString,
                    // Minimal required fields
                    skills: '[]',
                    specializations: '[]',
                    coords: JSON.stringify([0, 0])
                }
            });
        }

        // Update email if provided
        if (email) {
            await prisma.user.update({
                where: { id: dbUser.id },
                data: { email: email }
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Settings update error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
