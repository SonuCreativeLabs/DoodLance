import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const timeRange = searchParams.get('timeRange') || '7days';

        // 1. Calculate Date Range
        const now = new Date();
        const startDate = new Date();
        let daysToLookBack = 7;

        switch (timeRange) {
            case '24hours':
                startDate.setDate(now.getDate() - 1);
                daysToLookBack = 1;
                break;
            case '7days':
                startDate.setDate(now.getDate() - 7);
                daysToLookBack = 7;
                break;
            case '30days':
                startDate.setDate(now.getDate() - 30);
                daysToLookBack = 30;
                break;
            case '90days':
                startDate.setDate(now.getDate() - 90);
                daysToLookBack = 90;
                break;
            default:
                startDate.setDate(now.getDate() - 7);
                daysToLookBack = 7;
        }

        // 2. Fetch High-Level Stats (Parallel)
        const [
            totalUsers,
            periodUsers,
            totalBookings,
            totalServices,
            periodBookings,
            periodRevenueResult
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { createdAt: { gte: startDate } } }),
            prisma.booking.count(),
            prisma.service.count({ where: { isActive: true } }),
            prisma.booking.count({ where: { createdAt: { gte: startDate } } }),
            prisma.booking.aggregate({
                where: {
                    status: 'COMPLETED',
                    createdAt: { gte: startDate }
                },
                _sum: { totalPrice: true }
            })
        ]);

        // Revenue is 30% of Total Booking Value (Platform Fee)
        const periodRevenue = (periodRevenueResult._sum.totalPrice || 0) * 0.30;

        // 3. Performance Data (Daily Breakdown)
        const performanceData = [];
        // Map allows faster lookups for fetched data
        // However, standard groupBy by date in Prisma is tricky with converting DateTime to Date string directly in query
        // So we will loop and query OR fetch all and aggregate in JS. 
        // For distinct days < 90, simple loop with index ranges is acceptable or one big fetch.
        // Let's use the loop approach for clarity and filling gaps.

        // Optimize: If > 30 days, maybe group by week? For now, day-by-day is fine for reasonable volume.
        // To avoid N+1 queries being too slow, we can execute them in parallel batches or strict range.
        // Better: Fetch ALL data for the period and bucket in JS.

        const periodBookingsData = await prisma.booking.findMany({
            where: { createdAt: { gte: startDate } },
            select: { createdAt: true, totalPrice: true, clientId: true, status: true }
        });

        const periodUsersData = await prisma.user.findMany({
            where: { createdAt: { gte: startDate } },
            select: { createdAt: true }
        });

        // Generate date buckets
        const dailyStats: any = {};
        for (let i = 0; i <= daysToLookBack; i++) {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            const dateKey = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }); // e.g. "Mon 12"
            // Use ISO string YYYY-MM-DD for matching
            const isoKey = d.toISOString().split('T')[0];
            dailyStats[isoKey] = { name: dateKey, revenue: 0, users: 0, bookings: 0 };
        }

        // Bucket Data
        periodBookingsData.forEach((b: any) => {
            const dateKey = b.createdAt.toISOString().split('T')[0];
            if (dailyStats[dateKey]) {
                dailyStats[dateKey].bookings += 1;
                if (b.status === 'COMPLETED') {
                    // 30% fee
                    dailyStats[dateKey].revenue += (b.totalPrice * 0.30);
                }
            }
        });

        periodUsersData.forEach((u: any) => {
            const dateKey = u.createdAt.toISOString().split('T')[0];
            if (dailyStats[dateKey]) {
                dailyStats[dateKey].users += 1;
            }
        });

        // Convert to array and sort
        const sortedPerformanceData = Object.entries(dailyStats)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([, val]: [string, any]) => val);


        // 4. Service Distribution
        // Get bookings grouped by service -> service.categoryId
        // Since we can't deep include in groupBy, we fetch bookings with service.category
        const bookingsWithCategory = await prisma.booking.findMany({
            where: { createdAt: { gte: startDate } },
            select: {
                service: {
                    select: {
                        category: { select: { name: true } }
                    }
                }
            }
        });

        const categoryCounts: Record<string, number> = {};
        bookingsWithCategory.forEach((b: any) => {
            const catName = b.service?.category?.name || 'Uncategorized';
            categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
        });

        const serviceDistribution = Object.entries(categoryCounts).map(([name, value]) => ({
            name,
            value
        }));

        // If no bookings, fallback to all service counts
        if (serviceDistribution.length === 0) {
            const allServices = await prisma.service.findMany({
                where: { isActive: true },
                include: { category: true }
            });
            allServices.forEach((s: any) => {
                const catName = s.category?.name || 'Other';
                categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
            });
            // update serviceDistribution again
            serviceDistribution.push(...Object.entries(categoryCounts).map(([name, value]) => ({
                name,
                value
            })));
        }


        // 5. User Metrics (Active, Retention, Engagement)
        // Definition:
        // Active Users: Users who made a booking or logged in (updatedAt) in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);

        const activeUserCount = await prisma.user.count({
            where: {
                OR: [
                    { bookings: { some: { createdAt: { gte: thirtyDaysAgo } } } },
                    { updatedAt: { gte: thirtyDaysAgo } }
                ]
            }
        });

        // Retention: Users with > 1 booking / Users with >= 1 booking
        // Engagement: Active Users / Total Users

        const userBookingsCounts = await prisma.booking.groupBy({
            by: ['clientId'],
            _count: { id: true }
        });

        const totalBookers = userBookingsCounts.length; // Users who have booked at least once
        const repeatBookers = userBookingsCounts.filter((u: any) => u._count.id > 1).length;

        const retentionRate = totalBookers > 0 ? (repeatBookers / totalBookers) * 100 : 0;
        const engagementRate = totalUsers > 0 ? (activeUserCount / totalUsers) * 100 : 0;


        // 6. Conversion Funnel
        // Signups -> Profile Data Filled? -> Looked at Service? -> Booked -> Completed
        // Simplified: Total Users -> Active Users -> Users with Bookings -> Users with Completed Bookings
        const usersWithCompletedBookings = (await prisma.booking.groupBy({
            by: ['clientId'],
            where: { status: 'COMPLETED' },
            _count: true
        })).length;

        const conversionData = [
            { name: 'Total Users', value: totalUsers, fill: '#8B5CF6' },
            { name: 'Active Users', value: activeUserCount, fill: '#A78BFA' },
            { name: 'Booked a Service', value: totalBookers, fill: '#C4B5FD' },
            { name: 'Completed Booking', value: usersWithCompletedBookings, fill: '#DDD6FE' },
        ];


        // 7. Stats Object
        // Convert to response format
        const stats = {
            totalRevenue: periodRevenue, // Revenue in selected period
            totalBookings: periodBookings, // Bookings in selected period
            totalServices,
            conversionRate: (totalUsers > 0 ? (totalBookers / totalUsers) * 100 : 0).toFixed(1),
            avgBookingValue: periodBookings > 0 ? ((periodRevenueResult._sum.totalPrice || 0) / periodBookings) : 0, // Avg Value per booking (GMV)
            bookingCompletionRate: periodBookings > 0
                ? ((bookingsWithCategory.filter(() => true).length) / periodBookings * 100).toFixed(1) // Placeholder, need exact count
                : 0
        };

        // Re-calc completion rate correctly for the period
        const periodCompletedCount = await prisma.booking.count({
            where: { status: 'COMPLETED', createdAt: { gte: startDate } }
        });
        stats.bookingCompletionRate = periodBookings > 0
            ? ((periodCompletedCount / periodBookings) * 100).toFixed(1)
            : '0';


        return NextResponse.json({
            userMetrics: {
                activeUsers: activeUserCount,
                newSignups: periodUsers,
                retentionRate: retentionRate.toFixed(1),
                engagementRate: engagementRate.toFixed(1)
            },
            performanceData: sortedPerformanceData,
            serviceDistribution,
            stats,
            conversionData
        });

    } catch (error) {
        console.error('Fetch analytics error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
