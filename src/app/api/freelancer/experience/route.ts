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

        const { searchParams } = new URL(request.url);
        const profileId = searchParams.get('profileId');

        // Get user's FreelancerProfile first
        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: profileId || user.id }
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

        const body = await request.json();
        const { title, company, location, startDate, endDate, description, current } = body;

        // Get user's FreelancerProfile
        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: user.id }
        });

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
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

        const body = await request.json();
        const { id, role, company, location, startDate, endDate, description, isCurrent } = body;

        // Get user's profile to ensure they own this experience
        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: user.id }
        });

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        const experience = await prisma.experience.update({
            where: { id, profileId: profile.id },
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

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Experience ID required' }, { status: 400 });
        }

        // Get user's profile
        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: user.id }
        });

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        await prisma.experience.delete({
            where: { id, profileId: profile.id }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Experience delete error:', error);
        return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
    }
}
