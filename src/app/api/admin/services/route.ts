import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createServiceSchema, validateRequest } from '@/lib/validations/admin';
import { logAdminAction } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

// GET /api/admin/services - List all services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const active = searchParams.get('active') || 'all';

    const skip = (page - 1) * limit;
    const where: any = {};

    // Search
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Category Filter (using categoryId)
    if (category !== 'all') {
      where.categoryId = category;
    }

    // Active Filter
    if (active === 'active') {
      where.isActive = true;
    } else if (active === 'inactive') {
      where.isActive = false;
    }

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          provider: {
            select: {
              id: true,
              name: true,
              email: true,
              isVerified: true,
              freelancerProfile: {
                select: {
                  rating: true
                }
              }
            }
          }
        }
      }),
      prisma.service.count({ where })
    ]);

    // Map to frontend format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedServices = services.map((s: any) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      category: s.categoryId, // We'll need to fetch category name if needed
      categoryId: s.categoryId,
      price: s.price,
      duration: s.duration,
      location: s.location || 'Not specified',
      providerName: s.provider.name,
      providerId: s.provider.id,
      providerRating: s.provider.freelancerProfile?.rating || 0,
      providerVerified: s.provider.isVerified,
      status: s.isActive ? 'approved' : 'pending', // Mock status based on isActive
      isActive: s.isActive,
      rating: s.rating,
      reviewCount: s.reviewCount,
      totalOrders: s.totalOrders,
      packages: s.packages ? JSON.parse(s.packages) : null,
      images: s.images ? JSON.parse(s.images) : [],
      tags: s.tags ? JSON.parse(s.tags) : [],
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString()
    }));

    return NextResponse.json({
      services: mappedServices,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Fetch services error:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

// POST /api/admin/services - Create new service (admin-created)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const validation = validateRequest(createServiceSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const {
      title,
      description,
      categoryId,
      price,
      duration,
      location,
      providerId
    } = validation.data;

    // Get admin info (mock)
    const adminEmail = 'admin@doodlance.com';
    const adminId = 'admin-1';

    // Verify provider exists
    const provider = await prisma.user.findUnique({
      where: { id: providerId as string }
    });

    if (!provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    const newService = await prisma.service.create({
      data: {
        title,
        description,
        price,
        duration: duration || 60,
        categoryId,
        providerId: providerId as string,
        location: location || 'Not specified',
        images: JSON.stringify([]),
        tags: JSON.stringify([categoryId]),
        coords: JSON.stringify([0, 0]),
        serviceType: 'in-person',
        requirements: 'To be specified',
        isActive: false,
      }
    });

    // Log admin action
    await logAdminAction({
      adminId,
      adminEmail,
      action: 'CREATE',
      resource: 'SERVICE',
      resourceId: newService.id,
      details: { title, providerId },
      request
    });

    return NextResponse.json(newService, { status: 201 });

  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
