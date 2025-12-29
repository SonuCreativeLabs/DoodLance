import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/admin/reports - Get report data
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const reportType = searchParams.get('type') || 'all';

        // Similar to analytics but formatted for reports
        const [
            totalUsers,
            totalBookings,
            totalRevenue,
            platformFees,
            totalServices
        ] = await Promise.all([
            prisma.user.count(),
            prisma.booking.count(),
            prisma.transaction.aggregate({
                where: { type: 'EARNING' },
                _sum: { amount: true }
            }),
            prisma.transaction.aggregate({
                where: { type: 'PLATFORM_FEE' },
                _sum: { amount: true }
            }),
            prisma.service.count()
        ]);

        // Monthly revenue data (last 6 months)
        const revenueData = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            date.setDate(1);
            date.setHours(0, 0, 0, 0);

            const nextMonth = new Date(date);
            nextMonth.setMonth(nextMonth.getMonth() + 1);

            const [monthRevenue, monthBookings, monthUsers] = await Promise.all([
                prisma.transaction.aggregate({
                    where: {
                        type: 'EARNING',
                        createdAt: { gte: date, lt: nextMonth }
                    },
                    _sum: { amount: true }
                }),
                prisma.booking.count({
                    where: {
                        createdAt: { gte: date, lt: nextMonth }
                    }
                }),
                prisma.user.count({
                    where: {
                        createdAt: { gte: date, lt: nextMonth }
                    }
                })
            ]);

            revenueData.push({
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                revenue: monthRevenue._sum.amount || 0,
                bookings: monthBookings,
                users: monthUsers
            });
        }

        // Category breakdown
        const categoryData = await prisma.service.groupBy({
            by: ['categoryId'],
            _count: { id: true }
        });

        // User growth data
        const userGrowthData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - (i * 5)); // Every 5 days

            const [clients, freelancers] = await Promise.all([
                prisma.user.count({
                    where: {
                        role: 'CLIENT',
                        createdAt: { lte: date }
                    }
                }),
                prisma.user.count({
                    where: {
                        role: 'FREELANCER',
                        createdAt: { lte: date }
                    }
                })
            ]);

            userGrowthData.push({
                date: (i * 5).toString(),
                clients,
                freelancers
            });
        }

        return NextResponse.json({
            stats: {
                totalRevenue: totalRevenue._sum.amount || 0,
                totalBookings,
                totalUsers,
                avgOrderValue: totalBookings > 0 ? (totalRevenue._sum.amount || 0) / totalBookings : 0,
                conversionRate: totalUsers > 0 ? (totalBookings / totalUsers) * 100 : 0,
                growthRate: 15.3 // Placeholder - would need historical data
            },
            revenueData,
            categoryData: categoryData.map((c, i) => ({
                name: c.categoryId,
                value: Math.round((c._count.id / totalServices) * 100),
                color: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#6B7280'][i % 5]
            })),
            userGrowthData
        });

    } catch (error) {
        console.error('Fetch reports error:', error);
        return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
    }
}
