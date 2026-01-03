import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';


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
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await getDbUser(user.id, user.email);

        if (!dbUser) {
            // If user doesn't exist in DB yet (race condition on first login), return empty
            return NextResponse.json({
                user: null,
                profile: null,
                skills: [],
                experiences: [],
                portfolios: [],
                reviews: [],
                bankAccount: null
            });
        }

        const userId = dbUser.id; // Use the Correct CUID

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

            // 3. Skills - placeholder
            Promise.resolve(null),

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

        // Format Skills
        let formattedSkills = [];
        if (freelancerProfile?.skills) {
            try {
                const rawSkills = freelancerProfile.skills;
                if (typeof rawSkills === 'string' && (rawSkills.trim().startsWith('[') || rawSkills.trim().startsWith('{'))) {
                    formattedSkills = JSON.parse(rawSkills);
                } else if (typeof rawSkills === 'object') {
                    formattedSkills = rawSkills; // Already parsed (e.g. if Prisma Json type)
                } else {
                    formattedSkills = [rawSkills];
                }
            } catch (e) {
                console.error("Error parsing skills in dashboard:", e);
                formattedSkills = [];
            }
        }

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
