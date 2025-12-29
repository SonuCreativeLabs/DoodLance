import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/admin/bookings - List all bookings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';

    const skip = (page - 1) * limit;
    const where: any = {};

    // Search
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Status Filter
    if (status !== 'all') {
      where.status = status;
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          service: {
            select: {
              title: true,
              categoryId: true
            }
          },
          client: {
            select: {
              name: true,
              email: true
            }
          },
          freelancer: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.booking.count({ where })
    ]);

    // Map to frontend format
    const mappedBookings = bookings.map(b => ({
      id: b.id,
      serviceTitle: b.service.title,
      serviceCategory: b.service.categoryId,
      clientName: b.client.name,
      clientId: b.clientId,
      freelancerName: b.freelancer.name,
      freelancerId: b.freelancerId,
      scheduledAt: b.scheduledAt.toLocaleDateString(),
      duration: b.duration,
      status: b.status,
      progress: b.status === 'COMPLETED' ? 100 : b.status === 'IN_PROGRESS' ? 50 : b.status === 'CONFIRMED' ? 25 : 0,
      totalPrice: b.totalPrice,
      platformFee: b.platformFee,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString()
    }));

    return NextResponse.json({
      bookings: mappedBookings,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
