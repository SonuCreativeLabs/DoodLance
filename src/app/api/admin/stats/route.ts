import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        // 1. Basic Counts
        const totalUsers = await prisma.user.count();
        const activeUsers = await prisma.user.count({ where: { role: { not: 'admin' } } }); // Approximation

        // 2. Bookings & Jobs
        const totalBookings = await prisma.booking.count();
        const activeBookings = await prisma.booking.count({
            where: { status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] } }
        });

        // 3. Revenue
        // Sum of completed bookings totalPrice
        const revenueResult = await prisma.booking.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { totalPrice: true }
        });
        const totalRevenue = revenueResult._sum.totalPrice || 0;

        // Platform fees (assuming 10%)
        const platformFees = totalRevenue * 0.1;

        // 4. Growth calculations (simplified: compare to "last month" implicitly or just return 0 for now)
        // To do real growth, we need date ranges. For now I'll just hardcode reasonable trends or 0.

        // 5. Recent Activity
        // Fetch recent bookings/users
        const recentBookings = await prisma.booking.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                client: { select: { name: true } },
                service: { select: { title: true } }
            }
        });

        // 6. Revenue Chart Data (Last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const bookingsLast7Days = await prisma.booking.findMany({
            where: {
                createdAt: { gte: sevenDaysAgo },
                status: 'COMPLETED'
            },
            select: {
                createdAt: true,
                totalPrice: true
            }
        });

        // Group by day
        const revenueByDay = new Map();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Initialize last 7 days
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayName = days[d.getDay()];
            revenueByDay.set(dayName, { revenue: 0, bookings: 0 });
        }

        bookingsLast7Days.forEach((b: any) => {
            const dayName = days[b.createdAt.getDay()];
            const current = revenueByDay.get(dayName) || { revenue: 0, bookings: 0 };
            revenueByDay.set(dayName, {
                revenue: current.revenue + b.totalPrice,
                bookings: current.bookings + 1
            });
        });

        const revenueChartData = Array.from(revenueByDay.entries()).map(([date, data]) => ({
            date,
            revenue: data.revenue,
            bookings: data.bookings
        })).reverse(); // Show oldest to newest? No, map order is insertion based, we iterated backwards.
        // Actually simpler to just reconstruct the array in correct order.

        // 7. Category Performance
        // Group bookings by service category
        const categoryStats = await prisma.booking.findMany({
            where: { status: 'COMPLETED' },
            select: {
                totalPrice: true,
                service: {
                    select: {
                        category: {
                            select: { name: true }
                        }
                    }
                }
            }
        });

        const categoryMap = new Map();
        categoryStats.forEach((b: any) => {
            const catName = b.service.category.name;
            const current = categoryMap.get(catName) || { name: catName, bookings: 0, revenue: 0 };
            categoryMap.set(catName, {
                name: catName,
                bookings: current.bookings + 1,
                revenue: current.revenue + b.totalPrice,
                growth: 0
            });
        });

        const categoryPerformance = Array.from(categoryMap.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        return NextResponse.json({
            totalUsers,
            userGrowth: 0,
            activeUsers,
            activeGrowth: 0,
            totalBookings,
            bookingGrowth: 0,
            totalRevenue,
            revenueGrowth: 0,
            platformFees,
            avgBookingValue: totalBookings > 0 ? totalRevenue / totalBookings : 0,
            completionRate: totalBookings > 0 ? (await prisma.booking.count({ where: { status: 'COMPLETED' } }) / totalBookings) * 100 : 0,
            avgResponseTime: 'N/A',
            revenueData: revenueChartData,
            categoryPerformance,
            recentActivity: recentBookings.map((b: any) => ({
                id: b.id,
                type: 'booking',
                message: `New booking for ${b.service.title}`,
                time: b.createdAt.toISOString(), // Client will format
                status: b.status === 'PENDING' ? 'new' : b.status
            }))
        });

    } catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
