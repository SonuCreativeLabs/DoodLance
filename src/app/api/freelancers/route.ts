
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
                        services: {
                            where: {
                                isActive: true
                            }
                        },
                        bankAccount: true
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
        const userLat = latParam ? parseFloat(latParam) : null;
        const userLng = lngParam ? parseFloat(lngParam) : null;

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
                        // Only calculate distance if user coordinates are available
                        if (userLat !== null && userLng !== null) {
                            distance = calculateDistance(userLat, userLng, coords[1], coords[0]);
                        }
                    }
                }
            } catch (e) {
                // coords stays null
            }

            // Calculate profile completion with WEIGHTED scoring (12 CRITERIA)

            // Define weights based on user priority (Critical > Important > Lower)
            const weights = {
                // CRITICAL (50%)
                services: 20,        // Critical: What clients hire for
                availability: 15,    // Critical: When freelancer is available
                publicProfile: 15,   // Critical: Shareable profile link
                // IMPORTANT (40%)
                profilePic: 8,       // Important: Professional appearance
                personalInfo: 8,     // Important: Builds trust
                location: 8,         // Important: For local matching
                contactInfo: 8,      // Important: Essential for communication
                cricketInfo: 8,      // Important: Role/style matching
                // LOWER PRIORITY (10%)
                skills: 3,           // Lower: Nice to have
                bankAccount: 3,      // Lower: Can add later
                achievements: 2,     // Lower: Credibility boost
                coverImage: 2        // Lower: Aesthetic
            };

            let completionPercentage = 0;

            // 1. Personal Information Card: DOB, gender, name, bio
            const hasPersonalInfo = !!(p.user.dateOfBirth && p.user.gender && p.user.name && p.user.bio);
            if (hasPersonalInfo) completionPercentage += weights.personalInfo;

            // 2. Public Profile Link: username
            const hasPublicProfile = !!(p.user.username && p.user.username.trim().length > 0);
            if (hasPublicProfile) completionPercentage += weights.publicProfile;

            // 3. Cricket Information: role, batting style, bowling style
            const hasCricketInfo = !!(p.cricketRole && p.battingStyle && p.bowlingStyle);
            if (hasCricketInfo) completionPercentage += weights.cricketInfo;

            // 4. Location Card: area, address, city, state, postalCode
            const hasLocation = !!(p.user.area && p.user.address && p.user.city && p.user.state && p.user.postalCode);
            if (hasLocation) completionPercentage += weights.location;

            // 5. Cricket Services: count > 0
            const hasServices = userServices.length > 0;
            if (hasServices) completionPercentage += weights.services;

            // 6. Skills: count > 0
            const hasSkills = skills.length > 0;
            if (hasSkills) completionPercentage += weights.skills;

            // 7. Achievements: count > 0
            const hasAchievements = p.achievements && p.achievements.length > 0;
            if (hasAchievements) completionPercentage += weights.achievements;

            // 8. Availability: schedule set
            const hasAvailability = !!(p.availability && p.availability.trim().length > 0);
            if (hasAvailability) completionPercentage += weights.availability;

            // 9. Bank Account: relation exists
            const hasBankAccount = !!p.user.bankAccount;
            if (hasBankAccount) completionPercentage += weights.bankAccount;

            // 10. Profile Picture: avatar not placeholder
            const hasProfilePic = !!(p.user.avatar && p.user.avatar !== '/placeholder-user.jpg');
            if (hasProfilePic) completionPercentage += weights.profilePic;

            // 11. Cover Picture: coverImage set
            const hasCoverPic = !!(p.coverImage && p.coverImage.trim().length > 0);
            if (hasCoverPic) completionPercentage += weights.coverImage;

            // 12. Contact Information: email, phone
            const hasContactInfo = !!(p.user.email && p.user.phone);
            if (hasContactInfo) completionPercentage += weights.contactInfo;

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
                description: p.user.bio || p.about || '',
                cricketRole: p.cricketRole,
                mainSport: p.mainSport,
                otherSports: p.otherSports,
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


        // Filter to show profiles with at least 30% completion
        // Lowered from 50% to 30% to show more freelancers
        const qualityProfiles = formattedProfiles.filter((p: any) => p.completionPercentage >= 30);

        // Client-side filtering for category if strict filtering needed
        let filtered = qualityProfiles;
        if (category && category !== 'All') {
            filtered = qualityProfiles.filter((p: any) =>
                p.service.toLowerCase().includes(category.toLowerCase()) ||
                p.services.some((s: any) => s.category === category || s.title.toLowerCase().includes(category.toLowerCase()))
            );
        }

        // Custom Sort: Priority Email -> Distance -> Others
        const PRIORITY_EMAIL = 'sonucreativelabs@gmail.com';

        filtered.sort((a: any, b: any) => {
            // 1. Priority Email (Featured)
            if (a.email === PRIORITY_EMAIL) return -1;
            if (b.email === PRIORITY_EMAIL) return 1;

            // 2. Distance sorting (if coordinates available)
            if (userLat !== null && userLng !== null) {
                const distA = a.distance ?? Infinity;
                const distB = b.distance ?? Infinity;

                // If distances are significantly different (e.g., > 1km diff), sort by distance
                if (Math.abs(distA - distB) > 1) {
                    return distA - distB;
                }
            }

            // 3. Fallback to Rating/Reviews if review count > 0 // Secondary sort
            // This maintains "Top Rated" order for equidistant profiles
            return 0;
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
