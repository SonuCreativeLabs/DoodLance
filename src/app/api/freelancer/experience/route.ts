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
            return NextResponse.json({ experiences: [] });
        }

        // Now query experiences by profileId
        const experiences = await prisma.experience.findMany({
            where: { profileId: profile.id },
            orderBy: { startDate: 'desc' }
        });

        return NextResponse.json({ experiences });

    } catch (error) {
        console.error('Experience fetch error DETAILS:', error);
        return NextResponse.json({ error: 'Failed to fetch experiences', details: String(error) }, { status: 500 });
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
        const { title, company, location, startDate, endDate, description, current } = body;

        // Get user's FreelancerProfile
        let profile = await prisma.freelancerProfile.findUnique({
            where: { userId: dbUser.id }
        });

        if (!profile) {
            console.log('Profile missing during Experience Create. Auto-creating...');
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

        const experience = await prisma.experience.create({
            data: {
                profileId: profile.id,
                role: title,
                company,
                location,
                startDate,
                endDate: endDate || null,
                description,
                isCurrent: current || false
            }
        });

        return NextResponse.json({ experience });

    } catch (error) {
        console.error('Experience create error:', error);
        return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
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
        const { id, role, company, location, startDate, endDate, description, isCurrent } = body;

        // Get user's profile
        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: dbUser.id }
        });

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // Verify ownership
        const existingExp = await prisma.experience.findUnique({
            where: { id }
        });

        if (!existingExp || existingExp.profileId !== profile.id) {
            return NextResponse.json({ error: 'Experience not found or unauthorized' }, { status: 403 });
        }

        const experience = await prisma.experience.update({
            where: { id },
            data: {
                role,
                company,
                location,
                startDate,
                endDate: endDate || null,
                description,
                isCurrent: isCurrent || false
            }
        });

        return NextResponse.json({ experience });

    } catch (error) {
        console.error('Experience update error:', error);
        return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
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
            return NextResponse.json({ error: 'Experience ID required' }, { status: 400 });
        }

        // Get user's profile
        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: dbUser.id }
        });

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // Verify ownership
        const existingExp = await prisma.experience.findUnique({
            where: { id }
        });

        if (!existingExp || existingExp.profileId !== profile.id) {
            return NextResponse.json({ error: 'Experience not found or unauthorized' }, { status: 403 });
        }

        await prisma.experience.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Experience delete error:', error);
        return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
    }
}
