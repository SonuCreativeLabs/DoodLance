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
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const queryUserId = searchParams.get('profileId');

        const dbUser = await getDbUser(user.id, user.email);
        const targetUserId = queryUserId || (dbUser ? dbUser.id : user.id);

        // Get user's FreelancerProfile
        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: targetUserId }
        });

        if (!profile) {
            return NextResponse.json({ achievements: [] });
        }

        // Now query achievements by profileId
        // Ordered by creation since date fields are removed
        const achievements = await prisma.achievement.findMany({
            where: { profileId: profile.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ achievements });

    } catch (error) {
        console.error('Achievement fetch error DETAILS:', error);
        return NextResponse.json({ error: 'Failed to fetch achievements', details: String(error) }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await getDbUser(user.id, user.email);
        if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const body = await request.json();
        const { title, company } = body;

        if (!title || !company) {
            return NextResponse.json({ error: 'Title and Company are required' }, { status: 400 });
        }

        // Get user's FreelancerProfile
        let profile = await prisma.freelancerProfile.findUnique({
            where: { userId: dbUser.id }
        });

        if (!profile) {
            console.log('Profile missing during Achievement Create. Auto-creating...');
            // Auto-create profile if missing
            profile = await prisma.freelancerProfile.create({
                data: {
                    userId: dbUser.id,
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
        }

        const achievement = await prisma.achievement.create({
            data: {
                profileId: profile.id,
                title,
                company
            }
        });

        return NextResponse.json({ achievement });

    } catch (error) {
        console.error('Achievement create error:', error);
        return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 });
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
        if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const body = await request.json();
        const { id, title, company } = body;

        // Get user's profile
        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: dbUser.id }
        });

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // Verify ownership
        const existingAch = await prisma.achievement.findUnique({
            where: { id }
        });

        if (!existingAch || existingAch.profileId !== profile.id) {
            return NextResponse.json({ error: 'Achievement not found or unauthorized' }, { status: 403 });
        }

        const achievement = await prisma.achievement.update({
            where: { id },
            data: {
                title,
                company
            }
        });

        return NextResponse.json({ achievement });

    } catch (error) {
        console.error('Achievement update error:', error);
        return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await getDbUser(user.id, user.email);
        if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Achievement ID required' }, { status: 400 });
        }

        // Get user's profile
        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: dbUser.id }
        });

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // Verify ownership
        const existingAch = await prisma.achievement.findUnique({
            where: { id }
        });

        if (!existingAch || existingAch.profileId !== profile.id) {
            return NextResponse.json({ error: 'Achievement not found or unauthorized' }, { status: 403 });
        }

        await prisma.achievement.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Achievement delete error:', error);
        return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 });
    }
}
