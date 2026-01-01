import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/services
 * Fetch services.
 * - If `userId` query param provided: fetch services for that provider.
 * - If no query param: fetch services for current authenticated user (freelancer view).
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userIdParam = searchParams.get('userId');

        let targetUserId = userIdParam;

        // If no specific userId requested, try to use authenticated user's ID
        if (!targetUserId) {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user?.id) {
                targetUserId = user.id;
            }
        }

        if (!targetUserId) {
            // Return empty or error? For public browsing we might want all services?
            // For now, let's return all active services if no user specified (marketplace view)
            // But usually marketplace has filters.
            // Let's stick to: "If no user specified, return 400 or empty" unless we want a feed.
            // The requirement is mostly for the Freelancer to manage THEIR services.
            return NextResponse.json({ services: [] });
        }

        const services = await prisma.service.findMany({
            where: {
                providerId: targetUserId,
                isActive: true, // Only show active services?
            },
            include: {
                category: true
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Transform to frontend ServicePackage format
        const formattedServices = services.map((svc: typeof services[0]) => ({
            id: svc.id,
            title: svc.title,
            description: svc.description,
            price: `₹${svc.price}`,
            deliveryTime: svc.deliveryTime || '',
            type: svc.serviceType,
            features: svc.packages ? JSON.parse(svc.packages).features || [] : [],
            category: svc.category.name,
            // skill: ?? - not directly in Service model unless we parse tags or something
        }));

        return NextResponse.json({ services: formattedServices });

    } catch (error) {
        console.error('Failed to fetch services:', error);
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

/**
 * POST /api/services
 * Create a new service.
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        console.log('📦 Service creation request:', body);

        const {
            title,
            description,
            price,
            deliveryTime,
            type,
            features,
            category, // expect category Name or ID?
            skill
        } = body;

        if (!title || !price || !category) {
            console.error('❌ Missing required fields:', { title: !!title, price: !!price, category: !!category });
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Resolve Category - Find or Create
        let categoryRecord = await prisma.category.findUnique({
            where: { name: category }
        });

        if (!categoryRecord) {
            // Try finding by ID if it looks like a CUID
            if (category.startsWith('c')) {
                try {
                    categoryRecord = await prisma.category.findUnique({
                        where: { id: category }
                    });
                } catch (e) {
                    console.log('Not a valid category ID, will create new');
                }
            }

            if (!categoryRecord) {
                // Create if not found (auto-seed)
                console.log(`📝 Creating new category: '${category}'`);
                const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                categoryRecord = await prisma.category.create({
                    data: {
                        name: category,
                        slug: slug,
                        description: `Services related to ${category}`
                    }
                });
            }
        }

        console.log('✅ Using category:', categoryRecord.id, categoryRecord.name);

        // Parse price
        const numPrice = typeof price === 'number' ? price : parseFloat(String(price).replace(/[^0-9.]/g, ''));
        console.log('💰 Parsed price:', numPrice);

        // Create Service
        const newService = await prisma.service.create({
            data: {
                title,
                description: description || '',
                price: numPrice || 0,
                duration: 60, // Default duration
                categoryId: categoryRecord.id,
                providerId: user.id,
                location: '',
                coords: '[0,0]', // Default coords
                serviceType: type || 'online',
                deliveryTime: deliveryTime || '1 week',
                packages: JSON.stringify({ features: features || [] }),
                requirements: '',
                images: '[]',
                tags: skill || '',
            }
        });

        console.log('✅ Service created:', newService.id);
        return NextResponse.json({ success: true, service: newService });

    } catch (error: any) {
        console.error('❌ Failed to create service:', error);
        console.error('Error details:', error.message, error.stack);
        return NextResponse.json({
            error: 'Failed to create service',
            details: error.message
        }, { status: 500 });
    }
}
