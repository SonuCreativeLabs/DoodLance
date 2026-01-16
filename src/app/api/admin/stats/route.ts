import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// Helper to get date ranges based on filter
function getDateRange(range: string) {
    const now = new Date();
    let currentStart = new Date();
    let previousStart = new Date();
    let previousEnd = new Date();

    if (range === 'day') {
        currentStart.setHours(0, 0, 0, 0); // Start of today
        previousStart.setDate(now.getDate() - 1); // Start of yesterday
        previousStart.setHours(0, 0, 0, 0);
        previousEnd.setDate(now.getDate() - 1); // End of yesterday
        previousEnd.setHours(23, 59, 59, 999);
    } else if (range === 'week') {
        // Last 7 Days
        currentStart.setDate(now.getDate() - 6);
        currentStart.setHours(0, 0, 0, 0);

        // Previous 7 Days
        previousStart.setDate(now.getDate() - 13);
        previousStart.setHours(0, 0, 0, 0);
        previousEnd.setDate(now.getDate() - 7);
        previousEnd.setHours(23, 59, 59, 999);
    } else {
        // Current Month (Calendar Month)
        currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
        currentStart.setHours(0, 0, 0, 0);

        // Previous Month
        previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        previousStart.setHours(0, 0, 0, 0);
        previousEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        previousEnd.setHours(23, 59, 59, 999);
    }

    return { currentStart, previousStart, previousEnd };
}

async function getGrowth(model: any, where: any = {}, range: string) {
    try {
        const { currentStart, previousStart, previousEnd } = getDateRange(range);

        const currentCount = await model.count({
            where: {
                ...where,
                createdAt: { gte: currentStart }
            }
        });

        const previousCount = await model.count({
            where: {
                ...where,
                createdAt: { gte: previousStart, lte: previousEnd }
            }
        });

        if (previousCount === 0) return currentCount > 0 ? 100 : 0;
        return Math.round(((currentCount - previousCount) / previousCount) * 100);
    } catch (error) {
        console.error('Error calculating growth:', error);
        return 0;
    }
}

async function getRevenueMetrics(range: string) {
    try {
        const { currentStart, previousStart, previousEnd } = getDateRange(range);

        const currentRevenueResult = await prisma.booking.aggregate({
            where: {
                status: 'COMPLETED',
                createdAt: { gte: currentStart }
            },
            _sum: { totalPrice: true }
        });

        const previousRevenueResult = await prisma.booking.aggregate({
            where: {
                status: 'COMPLETED',
                createdAt: { gte: previousStart, lte: previousEnd }
            },
            _sum: { totalPrice: true }
        });

        const currentRevenue = currentRevenueResult._sum.totalPrice || 0;
        const previousRevenue = previousRevenueResult._sum.totalPrice || 0;

        let growth = 0;
        if (previousRevenue === 0) {
            growth = currentRevenue > 0 ? 100 : 0;
        } else {
            growth = Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 100);
        }

        return { currentRevenue, growth };
    } catch (error) {
        return { currentRevenue: 0, growth: 0 };
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || 'month'; // 'day', 'week', 'month'

        // 1. Basic Counts & Growth
        const totalUsers = await prisma.user.count({ where: { role: { not: 'admin' } } });
        const userGrowth = await getGrowth(prisma.user, { role: { not: 'admin' } }, range);

        // Active users (active in last 30 days - always kept as 30 days for "Active" definition)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const activeUsers = await prisma.user.count({
            where: {
                role: { not: 'admin' },
                updatedAt: { gte: thirtyDaysAgo }
            }
        });

        // 2. Bookings (Filtered by Range for dashboard cards usually implies "Total this period",
        // but often "Total Active" implies current state.
        // Let's make "Active Bookings" represent CURRENTLY active, regardless of range)
        const activeBookings = await prisma.booking.count({
            where: { status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] } }
        });
        // Growth of bookings CREATED in this period
        const bookingGrowth = await getGrowth(prisma.booking, {}, range);


        // 3. Revenue & Fees
        const { currentRevenue, growth: revenueGrowth } = await getRevenueMetrics(range);

        // Platform fees: 5% Client + 25% Freelancer = 30%
        const platformFees = currentRevenue * 0.30;

        // 4. Pending Verifications (Replacing Avg Response Time)
        // Freelancers with unverified status but submitted docs
        const pendingVerifications = await prisma.freelancerProfile.count({
            where: {
                isVerified: false,
                verificationDocs: { not: null }
            }
        });

        // 5. Completion Rate (All time)
        const totalAllTimeBookings = await prisma.booking.count();
        const completedBookings = await prisma.booking.count({ where: { status: 'COMPLETED' } });
        const completionRate = totalAllTimeBookings > 0 ? (completedBookings / totalAllTimeBookings) * 100 : 0;


        // 6. Recent Activity
        const recentBookings = await prisma.booking.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                client: { select: { name: true, avatar: true } },
                service: { select: { title: true } }
            }
        });

        // 7. Revenue Chart Data (Dynamic based on range)
        let revenueData = [];

        if (range === 'day') {
            // Hourly breakdown for Today (00:00 to 23:59)
            const { currentStart } = getDateRange('day');

            const bookingsToday = await prisma.booking.findMany({
                where: {
                    createdAt: { gte: currentStart },
                    status: 'COMPLETED'
                },
                select: { createdAt: true, totalPrice: true }
            });

            // Groups of 4 hours: 0-4, 4-8, 8-12, 12-16, 16-20, 20-24
            const intervals = [0, 4, 8, 12, 16, 20];
            revenueData = intervals.map(hour => {
                const intervalStart = new Date(currentStart);
                intervalStart.setHours(hour, 0, 0, 0);
                const intervalEnd = new Date(currentStart);
                intervalEnd.setHours(hour + 4, 0, 0, -1);

                const intervalBookings = bookingsToday.filter((b: any) => {
                    const t = new Date(b.createdAt).getTime();
                    return t >= intervalStart.getTime() && t <= intervalEnd.getTime();
                });

                return {
                    date: `${hour}:00`,
                    revenue: intervalBookings.reduce((sum: number, b: any) => sum + b.totalPrice, 0),
                    bookings: intervalBookings.length
                };
            });

        } else if (range === 'month') {
            // Current Month Daily Breakdown
            const { currentStart } = getDateRange('month');

            // Get number of days in the current month
            const daysInMonth = new Date(currentStart.getFullYear(), currentStart.getMonth() + 1, 0).getDate();

            const monthBookings = await prisma.booking.findMany({
                where: {
                    createdAt: { gte: currentStart },
                    status: 'COMPLETED'
                },
                select: { createdAt: true, totalPrice: true }
            });

            // Loop through all days of the month
            for (let i = 0; i < daysInMonth; i++) {
                const dayDate = new Date(currentStart);
                dayDate.setDate(dayDate.getDate() + i);

                const dayStart = new Date(dayDate); dayStart.setHours(0, 0, 0, 0);
                const dayEnd = new Date(dayDate); dayEnd.setHours(23, 59, 59, 999);

                const dayBookings = monthBookings.filter((b: any) => {
                    const t = new Date(b.createdAt).getTime();
                    return t >= dayStart.getTime() && t <= dayEnd.getTime();
                });

                revenueData.push({
                    date: `${dayDate.getDate()} ${dayDate.toLocaleString('default', { month: 'short' })}`,
                    revenue: dayBookings.reduce((sum: number, b: any) => sum + b.totalPrice, 0),
                    bookings: dayBookings.length
                });
            }

        } else {
            // Default 'week' -> Last 7 Days
            const { currentStart } = getDateRange('week');
            const weekBookings = await prisma.booking.findMany({
                where: {
                    createdAt: { gte: currentStart },
                    status: 'COMPLETED'
                },
                select: { createdAt: true, totalPrice: true }
            });

            // 7 Days Loop
            for (let i = 0; i < 7; i++) {
                const dayDate = new Date(currentStart);
                dayDate.setDate(dayDate.getDate() + i);

                const dayStart = new Date(dayDate); dayStart.setHours(0, 0, 0, 0);
                const dayEnd = new Date(dayDate); dayEnd.setHours(23, 59, 59, 999);

                const dayBookings = weekBookings.filter((b: any) => {
                    const t = new Date(b.createdAt).getTime();
                    return t >= dayStart.getTime() && t <= dayEnd.getTime();
                });

                revenueData.push({
                    date: dayDate.toLocaleDateString('en-US', { weekday: 'short' }),
                    revenue: dayBookings.reduce((sum: number, b: any) => sum + b.totalPrice, 0),
                    bookings: dayBookings.length
                });
            }
        }

        // 8. Category Performance
        const categoryStats = await prisma.booking.groupBy({
            by: ['serviceId'],
            where: { status: 'COMPLETED' },
            _sum: { totalPrice: true },
            _count: { id: true },
            orderBy: { _sum: { totalPrice: 'desc' } },
            // Removed take: 5 to allow proper aggregation of all services into categories
        });

        const categoryPerformance = await Promise.all(categoryStats.map(async (stat: any) => {
            const service = await prisma.service.findUnique({
                where: { id: stat.serviceId },
                include: { category: true }
            });
            // Calculate growth? Complex without history. Keep as 0 or remove from UI if mostly 0.
            return {
                name: service?.category.name || 'Unknown',
                bookings: stat._count.id,
                revenue: stat._sum.totalPrice || 0,
                growth: 0
            };
        }));

        // Aggregate categories
        const aggregatedCategories = categoryPerformance.reduce((acc: any, curr) => {
            const existing = acc.find((c: any) => c.name === curr.name);
            if (existing) {
                existing.bookings += curr.bookings;
                existing.revenue += curr.revenue;
            } else {
                acc.push(curr);
            }
            return acc;
        }, []);


        return NextResponse.json({
            totalUsers,
            userGrowth,
            activeUsers,

            activeBookings: activeBookings, // Currently active, not grown
            bookingGrowth, // Growth of NEW bookings

            totalRevenue: currentRevenue, // Revenue IN THIS PERIOD
            revenueGrowth,

            platformFees,

            completionRate,
            pendingVerifications, // Replaces avgResponseTime

            revenueData,
            categoryPerformance: aggregatedCategories.sort((a: any, b: any) => b.revenue - a.revenue).slice(0, 5),
            recentActivity: recentBookings.map((b: any) => ({
                id: b.id,
                type: 'booking',
                message: `New booking (${b.service.title})`,
                user: b.client.name,
                avatar: b.client.avatar,
                time: b.createdAt.toISOString(),
                status: b.status === 'PENDING' ? 'new' : b.status
            }))
        });

    } catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
