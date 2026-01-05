import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Resolve DB User (CUID)
        let userId = user.id;
        const dbUser = await prisma.user.findUnique({ where: { supabaseUid: user.id } });
        if (dbUser) {
            userId = dbUser.id;
        } else {
            // Fallback
            const byId = await prisma.user.findUnique({ where: { id: user.id } });
            if (byId) userId = byId.id;
        }

        const services = await prisma.service.findMany({
            where: {
                providerId: userId
            },
            include: {
                category: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Map database service to UI format
        const formattedServices = services.map((service: any) => ({
            id: service.id,
            title: service.title,
            description: service.description,
            price: `₹${service.price.toString()}`,
            deliveryTime: service.deliveryTime || '',
            type: service.serviceType, // 'online' | 'in-person' | 'hybrid'
            features: service.packages ? JSON.parse(service.packages) : [], // We store features in 'packages' column field for now or 'tags'? 
            // Wait, schema says 'tags' is String and 'packages' is String?. 
            // Let's use 'packages' to store the features array as JSON for now as it seems most appropriate among available fields
            // or check if there is a better field. 
            // Looking at schema: packages String?
            // Let's use 'packages' for features JSON.
            category: service.category.name,
            skill: service.serviceType === 'Match Player' ? service.tags : undefined // Storing skill in tags for Match Player if needed, or we can just return category name
        }));

        return NextResponse.json({ services: formattedServices });
    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            title,
            description,
            price,
            deliveryTime,
            type,
            features,
            category,
            skill
        } = body;

        // Validate required fields
        if (!title || !description || !price || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // specific handling for "Match Player" skill if needed
        // We will store features in 'packages' column as JSON string

        // Find or create category
        let categoryRecord = await prisma.category.findUnique({
            where: { name: category }
        });

        if (!categoryRecord) {
            // Create new category if it doesn't exist (or fallback to General)
            // For now, let's create it to be flexible
            // Needs slug
            const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            try {
                categoryRecord = await prisma.category.create({
                    data: {
                        name: category,
                        slug: slug + '-' + Date.now(), // Ensure uniqueness
                        description: `Category for ${category}`,
                    }
                });
            } catch (e) {
                // Fallback if slug collision or other error, try to find 'General' or similar
                // For this implementation, let's just fail if we can't create, or maybe standard categories should be seeded.
                // Let's assume we can create it.
                console.error("Error creating category:", e);
                return NextResponse.json({ error: 'Failed to process category' }, { status: 500 });
            }
        }

        // Clean price string to float
        const numericPrice = parseFloat(String(price).replace(/[^0-9.]/g, ''));

        const service = await prisma.service.create({
            data: {
                title,
                description,
                price: numericPrice,
                duration: 0, // Default duration if not provided
                coords: '', // Required field
                images: '[]', // Required field
                tags: skill || '', // Store skill in tags if present
                location: '', // Optional
                serviceType: type || 'online',
                deliveryTime,
                packages: JSON.stringify(features || []), // Store features here
                requirements: '', // Required

                provider: {
                    connect: { id: userId }
                },
                category: {
                    connect: { id: categoryRecord.id }
                }
            },
            include: {
                category: true
            }
        });

        const formattedService = {
            id: service.id,
            title: service.title,
            description: service.description,
            price: `₹${service.price.toString()}`,
            deliveryTime: service.deliveryTime,
            type: service.serviceType,
            features: service.packages ? JSON.parse(service.packages) : [],
            category: service.category.name,
            skill: service.tags
        };

        return NextResponse.json({ service: formattedService });

    } catch (error) {
        console.error('Error creating service:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
