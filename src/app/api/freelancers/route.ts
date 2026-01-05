
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        // Get current user to exclude from results
        const { createClient } = await import('@/lib/supabase/server');
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Build filter - exclude current user
        const where: any = {};
        if (user) {
            where.userId = { not: user.id };
        }

        const profiles = await prisma.freelancerProfile.findMany({
            where,
            include: {
                user: {
                    include: {
                        services: true
                    }
                },
                reviews: true,
                experiences: {
                    orderBy: { startDate: 'desc' }
                }
            }
        });

        // Transform to match Professional interface
        const formattedProfiles = profiles.map((p: any) => {
            const rating = p.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / (p.reviews.length || 1);

            // Services come from the User relation now
            // We assume the user linked to this profile owns the services
            const userServices = p.user.services || [];

            // Attempt to determine primary service/category
            const primaryService = userServices[0]?.title || p.title || 'Freelancer';

            // Parse skills
            let skills: string[] = [];
            if (p.skills) {
                if (typeof p.skills === 'string') {
                    // Try JSON parse, fallback to comma split, fallback to single item
                    try {
                        const parsed = JSON.parse(p.skills);
                        if (Array.isArray(parsed)) {
                            skills = parsed.map((s: any) => {
                                if (typeof s === 'object' && s !== null) {
                                    return s.name || s.title || s.label || JSON.stringify(s);
                                }
                                return String(s);
                            });
                        }
                        else skills = [typeof parsed === 'object' ? (parsed.name || JSON.stringify(parsed)) : String(parsed)];
                    } catch (e) {
                        // If not JSON, maybe comma separated?
                        if (p.skills.includes(',')) {
                            skills = (p.skills as string).split(',').map((s: string) => s.trim());
                        } else {
                            skills = [p.skills];
                        }
                    }
                } else if (Array.isArray(p.skills)) {
                    skills = p.skills;
                }
            }

            // Calculate experience
            const experience = p.experiences && p.experiences.length > 0
                ? `${p.experiences.length} roles`
                : (p.experience || 'New Talent');

            return {
                id: p.id,
                userId: p.userId,
                name: p.user.name || 'Anonymous',
                service: primaryService,
                rating: p.rating || rating || 0,
                reviews: p.reviewCount || p.reviews.length,
                completedJobs: p.completedJobs || 0,
                location: p.user.city ? `${p.user.city}, ${p.user.state || ''}` : (p.location || p.user.location || 'Remote'),
                responseTime: p.responseTime || '1 hour',
                image: p.user.avatar || p.user.profileImage || '/placeholder-user.jpg',
                avatar: p.user.avatar || p.user.profileImage || '/placeholder-user.jpg',
                distance: 5, // Geo-calc required for real distance
                price: p.hourlyRate || userServices[0]?.price || 0,
                priceUnit: 'hr',
                coords: p.coords ? JSON.parse(p.coords) : [80.2707, 13.0827],
                expertise: skills,
                experience: experience,
                description: p.bio || p.about || '',
                cricketRole: p.cricketRole,
                services: userServices.map((s: any) => ({
                    id: s.id,
                    title: s.title,
                    price: s.price,
                    category: s.categoryId
                }))
            };
        });

        // Client-side filtering for category if strict filtering needed
        let filtered = formattedProfiles;
        if (category && category !== 'All') {
            filtered = formattedProfiles.filter((p: any) =>
                p.service.toLowerCase().includes(category.toLowerCase()) ||
                p.services.some((s: any) => s.category === category || s.title.toLowerCase().includes(category.toLowerCase()))
            );
        }

        return NextResponse.json(filtered);
    } catch (error) {
        console.error('Error fetching freelancers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch freelancers' },
            { status: 500 }
        );
    }
}
