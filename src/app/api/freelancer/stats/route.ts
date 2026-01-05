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

        // Fetch ALL completed jobs to calculate total stats dynamically
        const allCompletedJobs = await prisma.job.findMany({
            where: {
                freelancerId: user.id,
                status: 'COMPLETED'
            },
            select: {
                budget: true,
                completedAt: true
            }
        });

        const calculatedStats = allCompletedJobs.reduce((acc: { totalEarnings: number; completedJobs: number }, job: { budget: number }) => ({
            totalEarnings: acc.totalEarnings + job.budget,
            completedJobs: acc.completedJobs + 1
        }), { totalEarnings: 0, completedJobs: 0 });

        // Filter for last 6 months for the chart
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const chartJobs = allCompletedJobs.filter((job: { completedAt: Date | null }) =>
            job.completedAt && new Date(job.completedAt) >= sixMonthsAgo
        );

        // Initialize last 6 months with 0
        const monthlyStatsMap = new Map<string, { earnings: number, jobs: number }>();
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthName = d.toLocaleString('default', { month: 'short' });
            monthlyStatsMap.set(monthName, { earnings: 0, jobs: 0 });
        }

        // Aggregate data for chart
        chartJobs.forEach((job: { budget: number; completedAt: Date | null }) => {
            if (job.completedAt) {
                const monthName = job.completedAt.toLocaleString('default', { month: 'short' });
                if (monthlyStatsMap.has(monthName)) {
                    const current = monthlyStatsMap.get(monthName)!;
                    monthlyStatsMap.set(monthName, {
                        earnings: current.earnings + job.budget,
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

        return NextResponse.json({
            ...profile,
            totalEarnings: calculatedStats.totalEarnings,
            completedJobs: calculatedStats.completedJobs,
            monthlyStats
        });

    } catch (error) {
        console.error('Stats fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
