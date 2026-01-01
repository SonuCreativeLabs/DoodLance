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
            select: { skills: true }
        });

        if (!profile) {
            return NextResponse.json({ skills: [] });
        }

        // Parse skills JSON string
        let skills = [];
        if (profile.skills) {
            try {
                skills = JSON.parse(profile.skills);
            } catch {
                skills = [];
            }
        }

        return NextResponse.json({ skills });

    } catch (error) {
        console.error('Skills fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
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
        const { skills } = body;

        // Stringify skills for storage
        const skillsString = typeof skills === 'string' ? skills : JSON.stringify(skills);

        await prisma.freelancerProfile.upsert({
            where: { userId: user.id },
            update: { skills: skillsString },
            create: {
                userId: user.id,
                skills: skillsString,
                title: '',
                about: '',
                specializations: '[]',
                languages: 'English',
                coords: '[0,0]',
                hourlyRate: 0,
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Skills update error:', error);
        return NextResponse.json({ error: 'Failed to update skills' }, { status: 500 });
    }
}
