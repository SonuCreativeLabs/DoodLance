
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        const where: any = {};

        if (category && category !== 'All') {
            // Basic category filtering - in real app, might need more complex logic or relation check
            // For now, assume simple filtering if applicable, or we might filter in client.
            // But typically filtering in DB is better.
            // However, our FreelancerProfile doesn't strictly have 'category' field in top level in some versions?
            // Let's check schema. If needed we can filter by services.
        }

        const profiles = await prisma.freelancerProfile.findMany({
            where,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        profileImage: true,
                    }
                },
                services: true, // properties like title, price
                reviews: true,  // for rating calculation
            }
        });

        // Transform to match Professional interface (roughly)
        const formattedProfiles = profiles.map(p => {
            const rating = p.reviews.reduce((acc, r) => acc + r.rating, 0) / (p.reviews.length || 1);

            // Attempt to determine primary service/category
            const primaryService = p.services[0]?.title || 'Freelancer';

            // Parse skills if stored as string, or use if array
            let skills: string[] = [];
            if (typeof p.skills === 'string') {
                try {
                    skills = JSON.parse(p.skills);
                } catch (e) {
                    skills = [p.skills];
                }
            } else if (Array.isArray(p.skills)) {
                skills = p.skills; // if it's already an array type in Prisma
            }

            return {
                id: p.id, // String ID
                name: p.user.name || 'Anonymous',
                service: primaryService,
                rating: rating || 0,
                reviews: p.reviews.length,
                completedJobs: 0, // Need to fetch from bookings or add field
                location: p.location || 'Remote',
                responseTime: '1 hour', // Placeholder or calculation
                image: p.user.profileImage || '/placeholder-user.jpg',
                avatar: p.user.profileImage || '/placeholder-user.jpg',
                distance: 5, // Placeholder, would need Geospatial query
                price: p.rate || 0,
                priceUnit: 'hr', // Default
                coords: [80.2707, 13.0827], // Default to Chennai or parse location
                expertise: skills,
                experience: p.experience || 'Entry Level',
                description: p.bio,
                services: p.services.map(s => ({
                    id: s.id,
                    title: s.title,
                    price: s.price,
                    category: s.category
                }))
            };
        });

        return NextResponse.json(formattedProfiles);
    } catch (error) {
        console.error('Error fetching freelancers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch freelancers' },
            { status: 500 }
        );
    }
}
