import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/admin/analytics - Get platform analytics
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const timeRange = searchParams.get('timeRange') || '7days';

        // Calculate date range
        const now = new Date();
        let startDate = new Date();

        switch (timeRange) {
            case '24hours':
                startDate.setDate(now.getDate() - 1);
                break;
            case '7days':
                startDate.setDate(now.getDate() - 7);
                break;
            case '30days':
                startDate.setDate(now.getDate() - 30);
                break;
            case '90days':
                startDate.setDate(now.getDate() - 90);
                break;
            default:
                startDate.setDate(now.getDate() - 7);
        }

        // Fetch aggregated data
        const [
            totalUsers,
            activeUsers,
            newSignups,
            totalBookings,
            totalRevenue,
            totalServices
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { updatedAt: { gte: startDate } } }),
            prisma.user.count({ where: { createdAt: { gte: startDate } } }),
            prisma.booking.count({ where: { createdAt: { gte: startDate } } }),
            prisma.transaction.aggregate({
                where: {
                    type: 'EARNING',
                    createdAt: { gte: startDate }
                },
                _sum: { amount: true }
            }),
            prisma.service.count({ where: { isActive: true } })
        ]);

        // Performance data (daily breakdown for last 7 days)
        const performanceData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const [dayUsers, dayRevenue, dayBookings] = await Promise.all([
                prisma.user.count({
                    where: {
                        createdAt: { gte: date, lt: nextDate }
                    }
                }),
                prisma.transaction.aggregate({
                    where: {
                        type: 'EARNING',
                        createdAt: { gte: date, lt: nextDate }
                    },
                    _sum: { amount: true }
                }),
                prisma.booking.count({
                    where: {
                        createdAt: { gte: date, lt: nextDate }
                    }
                })
            ]);

            performanceData.push({
                name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                users: dayUsers,
                revenue: dayRevenue._sum.amount || 0,
                bookings: dayBookings
            });
        }

        // Service distribution by category
        const services = await prisma.service.groupBy({
            by: ['categoryId'],
            _count: { id: true },
            where: { isActive: true }
        });

        const serviceDistribution = services.map(s => ({
            name: s.categoryId,
            value: s._count.id
        }));

        // User metrics
        const retentionRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
        const conversionRate = totalUsers > 0 ? (totalBookings / totalUsers) * 100 : 0;

        return NextResponse.json({
            userMetrics: {
                activeUsers,
                newSignups,
                retentionRate: retentionRate.toFixed(1),
                engagementRate: 65.2 // Placeholder
            },
            performanceData,
            serviceDistribution,
            stats: {
                totalRevenue: totalRevenue._sum.amount || 0,
                totalBookings,
                totalServices,
                conversionRate: conversionRate.toFixed(1)
            }
        });

    } catch (error) {
        console.error('Fetch analytics error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
