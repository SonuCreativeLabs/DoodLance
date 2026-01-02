import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = user.id;

        // Parallelize all fetches
        const [
            userProfile,
            freelancerProfile,
            skills,
            experiences,
            portfolios,
            reviews,
            bankAccount
        ] = await Promise.all([
            // 1. User Profile (Personal Details)
            prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true, email: true, name: true, phone: true, avatar: true,
                    location: true, bio: true, gender: true, username: true,
                    displayId: true, address: true, city: true, state: true,
                    postalCode: true, role: true, currentRole: true, isVerified: true,
                    phoneVerified: true, createdAt: true,
                }
            }),

            // 2. Freelancer Profile (Main settings)
            prisma.freelancerProfile.findUnique({
                where: { userId },
            }),

            // 3. Skills (Usually stored in FreelancerProfile.skills or separate table? 
            // Based on SkillsContext, it calls /api/freelancer/skills which reads .skills jsonb from profile)
            // We can just use the profile fetch above for this if it's the same table.
            // Let's assume we extract it from freelancerProfile later.
            Promise.resolve(null), // Placeholder if skills are in profile

            // 4. Experiences
            prisma.experience.findMany({
                where: {
                    profile: { userId }
                },
                orderBy: { startDate: 'desc' }
            }),

            // 5. Portfolios
            prisma.portfolio.findMany({
                where: {
                    profile: { userId }
                },
                orderBy: { createdAt: 'desc' }
            }),

            // 6. Reviews
            prisma.review.findMany({
                where: {
                    profile: { userId }
                },
                orderBy: { createdAt: 'desc' }
            }),

            // 7. Bank Account
            prisma.bankAccount.findUnique({
                where: { userId }
            })
        ]);

        // Format Skills (if they are just JSON in profile)
        // The current /api/freelancer/skills endpoint just returns { skills: profile.skills }
        const formattedSkills = freelancerProfile?.skills || [];

        return NextResponse.json({
            user: userProfile,
            profile: freelancerProfile,
            skills: formattedSkills,
            experiences: experiences || [],
            portfolios: portfolios || [],
            reviews: reviews || [],
            bankAccount: bankAccount || null
        });

    } catch (error) {
        console.error('Dashboard fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data' },
            { status: 500 }
        );
    }
}
