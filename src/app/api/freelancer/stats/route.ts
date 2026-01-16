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
                status: { in: ['completed', 'delivered', 'COMPLETED', 'DELIVERED'] } // Include both cases
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

        // Filter for chart - Start from Jan 1, 2026
        const chartStartDate = new Date('2026-01-01T00:00:00');

        const chartBookings = allCompletedBookings.filter((booking: any) => {
            const completedDate = booking.deliveredAt || booking.updatedAt;
            return completedDate && new Date(completedDate) >= chartStartDate;
        });

        // Initialize monthly stats map
        const monthlyStatsMap = new Map<string, { earnings: number, jobs: number }>();
        // No need to pre-fill specific months here as we will generate array later based on date range

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

        // Calculate months from Jan 2026 to now
        const startDate = new Date('2026-01-01T00:00:00');
        const now = new Date();

        const monthlyStats = [];
        let currentDate = new Date(startDate);

        while (currentDate <= now) {
            const monthName = currentDate.toLocaleString('default', { month: 'short' });
            const stats = monthlyStatsMap.get(monthName) || { earnings: 0, jobs: 0 };
            monthlyStats.push({
                name: monthName,
                earnings: stats.earnings,
                jobs: stats.jobs
            });
            currentDate.setMonth(currentDate.getMonth() + 1);
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

        // Count upcoming jobs (confirmed or pending)
        const upcomingJobsCount = await prisma.booking.count({
            where: {
                serviceId: { in: serviceIds },
                status: { in: ['confirmed', 'pending', 'CONFIRMED', 'PENDING'] }
            }
        });

        return NextResponse.json({
            ...profile,
            totalEarnings: calculatedStats.totalEarnings,
            totalJobs: calculatedStats.completedJobs, // Frontend expects 'totalJobs'
            completedJobs: calculatedStats.completedJobs, // Keep for compatibility
            upcomingJobs: upcomingJobsCount,
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
