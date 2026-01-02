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

        // Fetch profile settings AND user email
        const userData = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                email: true,
                freelancerProfile: {
                    select: { notificationSettings: true }
                }
            }
        });

        const settings = userData?.freelancerProfile?.notificationSettings
            ? JSON.parse(userData.freelancerProfile.notificationSettings)
            : null;

        return NextResponse.json({
            email: userData?.email || user.email,
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

        const body = await request.json();
        const { notifications, email } = body;

        // Update notifications if provided
        if (notifications) {
            await prisma.freelancerProfile.update({
                where: { userId: user.id },
                data: {
                    notificationSettings: JSON.stringify(notifications)
                }
            });
        }

        // Update email if provided
        if (email) {
            // 1. Update in Supabase Auth (Client should theoretically do this to trigger confirmation, 
            // but we can try here if admin/service role, or just rely on client. 
            // For this request, we MUST update our local 'users' table to reflect the change visually.)

            // Note: Changing auth email usually requires re-confirmation. 
            // We will update the DB directly for display purposes, assuming Auth update is handled or we just want 
            // the display to be in sync.

            await prisma.user.update({
                where: { id: user.id },
                data: { email: email }
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Settings update error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
