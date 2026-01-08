export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: user.id },
            select: {
                id: true,
                totalEarnings: true,
                thisMonthEarnings: true,
                completedJobs: true,
                rating: true,
                reviewCount: true,
                completionRate: true,
                avgProjectValue: true
            }
        });

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // Fetch ALL completed bookings for services provided by this user
        const userServices = await prisma.service.findMany({
            where: { providerId: user.id },
            select: { id: true }
        });

        const serviceIds = userServices.map((s: { id: string }) => s.id);

        const allCompletedBookings = await prisma.booking.findMany({
            where: {
                serviceId: { in: serviceIds },
                status: { in: ['completed', 'delivered'] } // Lowercase status values
            },
            select: {
                totalPrice: true,
                duration: true,
                scheduledAt: true,
                deliveredAt: true,
                updatedAt: true
            }
        });

        const calculatedStats = allCompletedBookings.reduce((acc: { totalEarnings: number; completedJobs: number; activeHours: number }, booking: any) => {
            // Calculate duration from scheduledAt and deliveredAt in hours
            // Only count hours if deliveredAt is after scheduledAt (avoid negative hours)
            let durationHours = 0;
            if (booking.scheduledAt && booking.deliveredAt) {
                const start = new Date(booking.scheduledAt);
                const end = new Date(booking.deliveredAt);
                const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                // Only add positive durations
                if (duration > 0) {
                    durationHours = duration;
                }
            }

            return {
                totalEarnings: acc.totalEarnings + booking.totalPrice,
                completedJobs: acc.completedJobs + 1,
                activeHours: acc.activeHours + durationHours
            };
        }, { totalEarnings: 0, completedJobs: 0, activeHours: 0 });

        // Calculate today's earnings and jobs
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayBookings = allCompletedBookings.filter((booking: any) => {
            const completedDate = booking.deliveredAt || booking.updatedAt;
            return completedDate && new Date(completedDate) >= todayStart;
        });

        const todayStats = todayBookings.reduce((acc: { earnings: number; jobs: number; hours: number }, booking: any) => {
            // Calculate duration from scheduledAt and deliveredAt in hours
            // Only count hours if deliveredAt is after scheduledAt (avoid negative hours)
            let durationHours = 0;
            if (booking.scheduledAt && booking.deliveredAt) {
                const start = new Date(booking.scheduledAt);
                const end = new Date(booking.deliveredAt);
                const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                // Only add positive durations
                if (duration > 0) {
                    durationHours = duration;
                }
            }

            return {
                earnings: acc.earnings + booking.totalPrice,
                jobs: acc.jobs + 1,
                hours: acc.hours + durationHours
            };
        }, { earnings: 0, jobs: 0, hours: 0 });

        // Filter for last 6 months for the chart
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const chartBookings = allCompletedBookings.filter((booking: any) => {
            const completedDate = booking.deliveredAt || booking.updatedAt;
            return completedDate && new Date(completedDate) >= sixMonthsAgo;
        });

        // Initialize last 6 months with 0
        const monthlyStatsMap = new Map<string, { earnings: number, jobs: number }>();
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthName = d.toLocaleString('default', { month: 'short' });
            monthlyStatsMap.set(monthName, { earnings: 0, jobs: 0 });
        }

        // Aggregate data for chart
        chartBookings.forEach((booking: any) => {
            const completedDate = booking.deliveredAt || booking.updatedAt;
            if (completedDate) {
                const date = new Date(completedDate);
                const monthName = date.toLocaleString('default', { month: 'short' });
                if (monthlyStatsMap.has(monthName)) {
                    const current = monthlyStatsMap.get(monthName)!;
                    monthlyStatsMap.set(monthName, {
                        earnings: current.earnings + booking.totalPrice,
                        jobs: current.jobs + 1
                    });
                }
            }
        });

        // Convert to array and reverse to show chronological order
        const monthlyStats = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthName = d.toLocaleString('default', { month: 'short' });
            const stats = monthlyStatsMap.get(monthName) || { earnings: 0, jobs: 0 };
            monthlyStats.push({
                name: monthName,
                earnings: stats.earnings,
                jobs: stats.jobs
            });
        }

        // Calculate this week's active hours
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
        weekStart.setHours(0, 0, 0, 0);

        const thisWeekBookings = allCompletedBookings.filter((booking: any) => {
            const completedDate = booking.deliveredAt || booking.updatedAt;
            return completedDate && new Date(completedDate) >= weekStart;
        });

        const thisWeekHours = thisWeekBookings.reduce((total: number, booking: any) => {
            let durationHours = 0;
            if (booking.scheduledAt && booking.deliveredAt) {
                const start = new Date(booking.scheduledAt);
                const end = new Date(booking.deliveredAt);
                const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                // Only add positive durations
                if (duration > 0) {
                    durationHours = duration;
                }
            }
            return total + durationHours;
        }, 0);

        return NextResponse.json({
            ...profile,
            totalEarnings: calculatedStats.totalEarnings,
            totalJobs: calculatedStats.completedJobs, // Frontend expects 'totalJobs'
            completedJobs: calculatedStats.completedJobs, // Keep for compatibility
            activeHours: Math.round(thisWeekHours), // This week's hours, rounded
            todayEarnings: todayStats.earnings,
            todayJobs: todayStats.jobs,
            monthlyStats
        });

    } catch (error) {
        console.error('Stats fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
