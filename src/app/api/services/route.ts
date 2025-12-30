import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { validateSession } from '@/lib/auth/jwt';

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
            const session = await validateSession();
            if (session?.userId) {
                targetUserId = session.userId;
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
        const formattedServices = services.map(svc => ({
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
        const session = await validateSession();
        if (!session || !session.userId) {
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
            category, // expect category Name or ID?
            skill
        } = body;

        if (!title || !price || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Resolve Category
        let categoryRecord = await prisma.category.findUnique({
            where: { name: category }
        });

        if (!categoryRecord) {
            // Try finding by ID if name failed
            categoryRecord = await prisma.category.findUnique({
                where: { id: category }
            });

            if (!categoryRecord) {
                // OPTIONAL: Create category if it doesn't exist?
                // For now, fail or pick a default?
                return NextResponse.json({ error: `Category '${category}' not found` }, { status: 400 });
            }
        }

        // Parse price
        const numPrice = parseFloat(price.replace(/[^0-9.]/g, ''));

        // Create Service
        const newService = await prisma.service.create({
            data: {
                title,
                description: description || '',
                price: numPrice || 0,
                duration: 60, // Default duration?
                categoryId: categoryRecord.id,
                providerId: session.userId,
                location: '', // Optional
                coords: '', // Optional
                serviceType: type || 'online',
                deliveryTime: deliveryTime,
                packages: JSON.stringify({ features: features || [] }),
                requirements: '', // Default
                images: '[]', // Default
                tags: skill || '', // Store skill in tags for now
            }
        });

        return NextResponse.json({ success: true, service: newService });

    } catch (error) {
        console.error('Failed to create service:', error);
        return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
    }
}
