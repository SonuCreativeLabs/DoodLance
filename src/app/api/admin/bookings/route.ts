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
        // Also allow searching by client name potentially, but ID is safest for now
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
              categoryId: true,
              duration: true,
              provider: { // Fetch freelancer via service provider
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true
                }
              }
            }
          },
          client: {
            select: {
              name: true,
              email: true,
              phone: true
            }
          }
        }
      }),
      prisma.booking.count({ where })
    ]);

    // Map to frontend format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedBookings = bookings.map((b: any) => ({
      id: b.id,
      serviceTitle: b.service?.title || 'Unknown Service',
      serviceCategory: b.service?.categoryId || 'Unknown',
      clientName: b.client?.name || 'Unknown Client',
      clientId: b.clientId,
      freelancerName: b.service?.provider?.name || 'Unknown Freelancer',
      freelancerId: b.service?.provider?.id,
      scheduledAt: b.scheduledAt ? new Date(b.scheduledAt).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      }) : 'Not Scheduled',
      duration: b.duration || b.service?.duration || 60, // Fallback to service duration or default 60 mins
      location: b.location || b.service?.location || 'Remote',
      clientEmail: b.client?.email,
      clientPhone: b.client?.phone || 'N/A',
      freelancerEmail: b.service?.provider?.email,
      freelancerPhone: b.service?.provider?.phone || 'N/A',
      status: b.status,
      progress: b.status === 'COMPLETED' ? 100 : b.status === 'IN_PROGRESS' ? 50 : b.status === 'CONFIRMED' ? 25 : 0,
      totalPrice: b.totalPrice,
      platformFee: b.totalPrice * 0.3, // Platform Commission (30%)
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
      notes: b.notes,
      disputeReason: b.cancellationReason, // Mapping cancellation/dispute reason
      disputeRaisedAt: b.cancelledAt ? b.cancelledAt.toISOString() : null,
    }));

    // Calculate stats
    const [statsStatus, statsFinancial] = await Promise.all([
      prisma.booking.groupBy({
        by: ['status'],
        _count: { status: true }
      }),
      prisma.booking.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalPrice: true }
      })
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const statusCounts = statsStatus.reduce((acc: any, curr: any) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);

    // Calculate global total from status counts
    const globalTotal = Object.values(statusCounts).reduce((a: any, b: any) => a + b, 0);

    const stats = {
      totalBookings: globalTotal, // Global total for stats card
      pending: statusCounts['PENDING'] || 0,
      confirmed: statusCounts['CONFIRMED'] || 0, // Upcoming
      inProgress: statusCounts['IN_PROGRESS'] || 0, // Ongoing
      completed: statusCounts['COMPLETED'] || 0,
      cancelled: statusCounts['CANCELLED'] || 0,
      disputed: statusCounts['DISPUTED'] || 0,
      totalRevenue: statsFinancial._sum.totalPrice || 0,
      platformEarnings: (statsFinancial._sum.totalPrice || 0) * 0.3, // Platform Commission (30%)
    };

    return NextResponse.json({
      bookings: mappedBookings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats
    });

  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
