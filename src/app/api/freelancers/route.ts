
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        // Build filter
        const where: any = {};

        // If filtering by category, we might need to filter users who have services in that category
        // But since we query FreelancerProfile, filtering by user.services.some(...) is harder in simple where.
        // For now, let's fetch all and filter in memory or rely on basic profile filtering if added later.

        const profiles = await prisma.freelancerProfile.findMany({
            where,
            include: {
                user: {
                    include: {
                        services: true
                    }
                },
                reviews: true,
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
                        if (Array.isArray(parsed)) skills = parsed;
                        else skills = [p.skills];
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

            return {
                id: p.id,
                userId: p.userId,
                name: p.user.name || 'Anonymous',
                service: primaryService,
                rating: p.rating || rating || 0,
                reviews: p.reviewCount || p.reviews.length,
                completedJobs: p.completedJobs || 0,
                location: p.location || p.user.location || 'Remote', // Fallback to user location if profile location missing? Schema has location on user? No, schema has coords on user. Service has location.
                // Profile has coords? Schema line 399: coords String.
                responseTime: p.responseTime || '1 hour',
                image: p.user.profileImage || '/placeholder-user.jpg',
                avatar: p.user.profileImage || '/placeholder-user.jpg',
                distance: 5, // Mock
                price: p.hourlyRate || userServices[0]?.price || 0,
                priceUnit: 'hr',
                coords: p.coords ? JSON.parse(p.coords) : [80.2707, 13.0827], // Safe parse needed? Schema says String.
                expertise: skills,
                experience: 'Entry Level', // Profile doesn't have experience level string? It has `Experience[]` relation. Logic was `p.experience || 'Entry Level'`. Schema doesn't have `experience` string field on Profile, only relation.
                description: p.about || p.bio || '',
                services: userServices.map((s: any) => ({
                    id: s.id,
                    title: s.title,
                    price: s.price,
                    category: s.categoryId // Model has categoryId, not category name directly?
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
