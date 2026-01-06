import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

async function getDbUser(supabaseUserId: string, email?: string) {
    if (!supabaseUserId) return null;
    // Prioritize supabaseUid lookup since we are passing a Supabase UUID
    let dbUser = await prisma.user.findUnique({ where: { supabaseUid: supabaseUserId } });

    // Fallback to ID (in case supabaseUid is not set but ID maps to it, or for legacy)
    if (!dbUser) {
        dbUser = await prisma.user.findUnique({ where: { id: supabaseUserId } });
    }

    // Fallback to email
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
        if (!dbUser) return NextResponse.json({ skills: [] });

        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: dbUser.id },
            select: { skills: true }
        });

        if (!profile) {
            return NextResponse.json({ skills: [] });
        }

        let skills = [];
        if (profile.skills) {
            console.log(`Raw skills from DB for ${dbUser.id} (Type: ${typeof profile.skills}):`, profile.skills);
            try {
                // Handle case where it might be double stringified or just a string
                // Check if it's already an object (though Prisma usually returns string for String types)
                if (typeof profile.skills === 'object') {
                    skills = profile.skills;
                }
                else if (profile.skills.trim().startsWith('[') || profile.skills.trim().startsWith('{')) {
                    skills = JSON.parse(profile.skills);
                } else {
                    // Assume it's a comma separated string or single value
                    skills = [profile.skills];
                }
                console.log('Parsed skills to return:', skills);
            } catch (e) {
                console.error("Error parsing skills JSON:", e);
                // Fallback: return as simple string array if parse fails
                skills = [profile.skills];
            }
        } else {
            console.log(`No skills found in DB for ${dbUser.id} (profile.skills is null/empty)`);
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

        const dbUser = await getDbUser(user.id, user.email);
        if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const body = await request.json();
        const { skills } = body;

        const skillsString = (typeof skills === 'string' ? skills : JSON.stringify(skills)) || "[]";

        console.log(`Updating skills for ${dbUser.id}:`, skillsString);

        await prisma.freelancerProfile.upsert({
            where: { userId: dbUser.id },
            update: { skills: skillsString },
            create: {
                userId: dbUser.id,
                skills: skillsString,
                title: '',
                about: '',
                specializations: '[]',
                coords: JSON.stringify([0, 0]),
                hourlyRate: 0,
                // Ensure optional fields don't cause issues
                availability: "[]",
                rating: 0,
                reviewCount: 0,
                completedJobs: 0
            }
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Skills update error:', error);
        console.error('Error Stack:', error.stack);
        return NextResponse.json({ error: 'Failed to update skills: ' + error.message }, { status: 500 });
    }
}
