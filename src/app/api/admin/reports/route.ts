import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/admin/reports - Get report data
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const reportType = searchParams.get('type') || 'all';
        const fromDate = searchParams.get('from');
        const toDate = searchParams.get('to');

        // Date Filtering Logic
        const dateFilter: any = {};
        if (fromDate && toDate) {
            dateFilter.createdAt = {
                gte: new Date(fromDate),
                lte: new Date(toDate)
            };
        }

        // 1. Overall Stats (Affected by Date Range)
        const [
            totalUsers,
            totalBookings,
            bookingRevenue, // Calculate revenue from bookings
            totalServices
        ] = await Promise.all([
            prisma.user.count({ where: dateFilter }),
            prisma.booking.count({ where: dateFilter }),
            prisma.booking.aggregate({
                where: {
                    ...dateFilter,
                    status: 'COMPLETED' // Only completed counts as realized revenue
                },
                _sum: { totalPrice: true }
            }),
            prisma.service.count({ where: dateFilter }) // Services created in this range
        ]);

        const revenue = bookingRevenue._sum.totalPrice || 0;
        const platformFees = revenue * 0.30; // 30% Platform Fee Assumption

        // 2. Growth Rate (Month over Month comparing to last COMPLETE month)
        // For simplicity in date range mode, we might skip or adapt this.
        // Let's keep it simple: Compare current selected period volume vs. previous same-length period?
        // Or just fixed 30-day lookback if no date selected.
        // 2. Growth Rate logic
        // Compare Current Period vs Previous Period
        let growthRate = 0;
        let currentPeriodRevenue = revenue; // Already calculated above
        let previousPeriodRevenue = 0;

        let prevStart, prevEnd;

        if (fromDate && toDate) {
            // Dynamic Range: Compare with same duration immediately before
            const start = new Date(fromDate);
            const end = new Date(toDate);
            const durationMs = end.getTime() - start.getTime();

            prevEnd = new Date(start);
            prevStart = new Date(start.getTime() - durationMs);
        } else {
            // Default: Compare This Month vs Last Month
            const now = new Date();
            // Current is start of this month to now
            // Previous is start of last month to same day last month
            prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            prevEnd = new Date(now.getFullYear(), now.getMonth(), 0);
            // Ideally we compare partial months if current is partial, but for simplicity let's compare full last month for now
            // Or better: Full Last Month vs Full 2-Months Ago? 
            // Let's stick to: "Growth over last 30 days" vs "30-60 days ago" if no range.
        }

        const prevPeriodStats = await prisma.booking.aggregate({
            where: {
                status: 'COMPLETED',
                createdAt: {
                    gte: prevStart,
                    lte: prevEnd
                }
            },
            _sum: { totalPrice: true }
        });
        previousPeriodRevenue = prevPeriodStats._sum.totalPrice || 0;

        if (previousPeriodRevenue > 0) {
            growthRate = ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100;
        } else if (currentPeriodRevenue > 0) {
            growthRate = 100; // 0 to something is 100% growth (technically infinite)
        }


        // 3. Charts: Monthly/Daily Trend
        // If date range < 3 months, show Daily? For now, stick to Monthly for robustness
        const revenueData = [];
        // Default to Jan 1, 2026 if no dates provided
        let historyStart;
        if (fromDate) {
            historyStart = new Date(fromDate);
        } else {
            // Hardcode default start to Jan 1, 2026 as requested
            historyStart = new Date('2026-01-01');
        }
        historyStart.setDate(1); // Align to month start for clean charting

        const historyEnd = toDate ? new Date(toDate) : new Date();

        // Iterate months
        let iterDate = new Date(historyStart);
        while (iterDate <= historyEnd) {
            const monthStart = new Date(iterDate.getFullYear(), iterDate.getMonth(), 1);
            const monthEnd = new Date(iterDate.getFullYear(), iterDate.getMonth() + 1, 0);

            // Cap at today/toDate
            const effectiveEnd = monthEnd > historyEnd ? historyEnd : monthEnd;

            const [monthRev, monthBookingsCount, monthNewUsers] = await Promise.all([
                prisma.booking.aggregate({
                    where: {
                        status: 'COMPLETED',
                        createdAt: { gte: monthStart, lte: effectiveEnd }
                    },
                    _sum: { totalPrice: true }
                }),
                prisma.booking.count({
                    where: { createdAt: { gte: monthStart, lte: effectiveEnd } }
                }),
                prisma.user.count({
                    where: { createdAt: { gte: monthStart, lte: effectiveEnd } }
                })
            ]);

            revenueData.push({
                month: monthStart.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
                revenue: monthRev._sum.totalPrice || 0,
                bookings: monthBookingsCount,
                users: monthNewUsers
            });

            iterDate.setMonth(iterDate.getMonth() + 1);
        }

        // 4. Category Breakdown
        // Need to join with Category table to get names
        // Prisma groupBy doesn't support relation include easily.
        // We fetch grouping then fetch category names or fetch all services with category included.
        // Optimization: Group by categoryId, then findMany categories where id IN keys.
        const categoryStats = await prisma.service.groupBy({
            by: ['categoryId'],
            _count: { id: true },
            where: dateFilter
        });

        const categoryIds = categoryStats.map((c: any) => c.categoryId);
        const categories = await prisma.category.findMany({
            where: { id: { in: categoryIds } }
        });

        const categoryData = categoryStats.map((stat: any, index: number) => {
            const cat = categories.find((c: any) => c.id === stat.categoryId);
            return {
                name: cat ? cat.name : 'Unknown',
                value: stat._count.id,
                color: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#6B7280', '#3B82F6'][index % 6]
            };
        });


        // 5. User Growth (Accumulative or New? Chart usually shows New Over Time)
        // reusing revenueData.users which is "New Users" per interval
        const userGrowthData = revenueData.map(d => ({
            date: d.month,
            clients: d.users, // Simplified: Total new users. To split Client/Freelancer needs separate queries inside loop
            freelancers: 0 // Placeholder or needs query update
        }));

        return NextResponse.json({
            stats: {
                totalRevenue: revenue,
                totalBookings,
                totalUsers,
                avgOrderValue: totalBookings > 0 ? (revenue / totalBookings) : 0,
                conversionRate: totalUsers > 0 ? (totalBookings / totalUsers) * 100 : 0,
                growthRate
            },
            revenueData,
            categoryData,
            userGrowthData
        });

    } catch (error) {
        console.error('Fetch reports error:', error);
        return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
    }
}
