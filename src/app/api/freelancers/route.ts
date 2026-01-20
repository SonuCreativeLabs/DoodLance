
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
            // Get internal user ID from Supabase UID
            const internalUser = await prisma.user.findUnique({
                where: { supabaseUid: user.id },
                select: { id: true }
            });

            if (internalUser) {
                where.userId = { not: internalUser.id };
            }
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
                achievements: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        const latParam = searchParams.get('lat');
        const lngParam = searchParams.get('lng');
        const userLat = latParam ? parseFloat(latParam) : 13.0827; // Default Chennai
        const userLng = lngParam ? parseFloat(lngParam) : 80.2707;

        // Helper for distance calculation (Haversine formula)
        const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
            const R = 6371; // Radius of the earth in km
            const dLat = (lat2 - lat1) * (Math.PI / 180);
            const dLon = (lon2 - lon1) * (Math.PI / 180);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // Distance in km
        };

        // Transform to match Professional interface
        const formattedProfiles = profiles.map((p: any) => {
            const rating = p.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / (p.reviews.length || 1);

            // Services come from the User relation now
            const userServices = p.user.services || [];

            // Calculate starting price from services
            const servicePrices = userServices.map((s: any) => s.price).filter((price: any) => typeof price === 'number' && price > 0);
            const minServicePrice = servicePrices.length > 0 ? Math.min(...servicePrices) : 0;
            const finalPrice = minServicePrice || p.hourlyRate || 0;

            // Primary service
            const primaryService = userServices[0]?.title || p.title || 'Freelancer';

            // Parse skills (simplified)
            let skills: string[] = [];
            try {
                if (typeof p.skills === 'string') {
                    const parsed = JSON.parse(p.skills);
                    skills = Array.isArray(parsed) ? parsed.map(s => typeof s === 'object' ? s.name || s.title : String(s)) : [String(parsed)];
                } else if (Array.isArray(p.skills)) {
                    skills = p.skills;
                }
            } catch (e) {
                skills = p.skills && typeof p.skills === 'string' ? p.skills.split(',') : [];
            }

            // Experience
            const experience = p.achievements && p.achievements.length > 0
                ? `${p.achievements.length} achievements`
                : 'New Talent';

            // Coordinates & Distance - NO DEFAULT, null if missing
            let coords: [number, number] | null = null;
            let distance: number | null = null;

            try {
                if (p.coords && p.coords.trim() !== '') {
                    const parsed = JSON.parse(p.coords);
                    if (Array.isArray(parsed) && parsed.length === 2 &&
                        typeof parsed[0] === 'number' && typeof parsed[1] === 'number') {
                        coords = [parsed[0], parsed[1]];
                        distance = calculateDistance(userLat, userLng, coords[1], coords[0]);
                    }
                }
            } catch (e) {
                // coords stays null
            }

            // Calculate profile completion
            const hasName = p.user.name && p.user.name.trim().length > 0;

            // Bio is stored in User table, not FreelancerProfile
            const bioText = p.user.bio || p.bio || p.about || '';
            const hasBio = bioText.trim().length > 0;
            const hasLocation = coords !== null;
            const hasService = userServices.length > 0;
            const hasPrice = finalPrice > 0;
            const hasSkills = skills.length > 0;

            const completionFields = [hasName, hasBio, hasLocation, hasService, hasPrice, hasSkills];
            const completionPercentage = (completionFields.filter(Boolean).length / completionFields.length) * 100;
            const isComplete = completionPercentage === 100;

            return {
                id: p.id,
                userId: p.userId,
                name: p.user.name || 'Anonymous',
                email: p.user.email, // Added for sorting
                service: primaryService,
                rating: p.rating || rating || 0,
                reviews: p.reviews.length,
                completedJobs: p.completedJobs || 0,
                area: p.user.area,
                city: p.user.city,
                location: p.user.area && p.user.city
                    ? `${p.user.area}, ${p.user.city}`
                    : (p.user.location || (p.user.city ? `${p.user.city}, ${p.user.state || ''}` : '')),
                responseTime: p.responseTime || '1 hour',
                image: p.user.avatar || p.user.profileImage || '/placeholder-user.jpg',
                avatar: p.user.avatar || p.user.profileImage || '/placeholder-user.jpg',
                distance: distance,
                price: finalPrice,
                priceUnit: 'hr',
                coords: coords,
                expertise: skills,
                experience: experience,
                description: bioText,
                cricketRole: p.cricketRole,
                services: userServices.map((s: any) => ({
                    id: s.id,
                    title: s.title,
                    price: s.price,
                    category: s.categoryId
                })),
                isComplete,
                completionPercentage
            };
        });


        // Filter to show profiles with at least 50% completion (3/6 criteria)
        // User requested to lower to 50% for now (allows ~4/6 incomplete profiles to show)
        const qualityProfiles = formattedProfiles.filter((p: any) => p.completionPercentage >= 50);

        // Client-side filtering for category if strict filtering needed
        let filtered = qualityProfiles;
        if (category && category !== 'All') {
            filtered = qualityProfiles.filter((p: any) =>
                p.service.toLowerCase().includes(category.toLowerCase()) ||
                p.services.some((s: any) => s.category === category || s.title.toLowerCase().includes(category.toLowerCase()))
            );
        }

        // Custom Sort: Prioritize 'sonucreativelabs@gmail.com'
        const PRIORITY_EMAIL = 'sonucreativelabs@gmail.com';
        filtered.sort((a: any, b: any) => {
            if (a.email === PRIORITY_EMAIL) return -1;
            if (b.email === PRIORITY_EMAIL) return 1;
            return 0; // Keep original order for others
        });

        return NextResponse.json(filtered);
    } catch (error) {
        console.error('Error fetching freelancers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch freelancers' },
            { status: 500 }
        );
    }
}
