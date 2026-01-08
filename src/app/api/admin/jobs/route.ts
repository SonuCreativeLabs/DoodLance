import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/admin/jobs - List all jobs
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || 'all';
        const category = searchParams.get('category') || 'all';

        const skip = (page - 1) * limit;
        const where: any = {};

        // Search
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Status Filter
        if (status !== 'all') {
            where.status = status.toUpperCase();
        }

        // Category Filter
        if (category !== 'all') {
            where.category = category; // Schema uses 'category' string
        }

        const [jobs, total] = await Promise.all([
            prisma.job.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    client: {
                        select: {
                            name: true,
                            email: true
                        }
                    },
                    _count: {
                        select: {
                            applications: true
                        }
                    }
                }
            }),
            prisma.job.count({ where })
        ]);

        // Map to frontend format
        const mappedJobs = jobs.map((j: any) => ({
            id: j.id,
            title: j.title,
            client: j.client?.name || 'Unknown',
            clientId: j.clientId,
            category: j.category, // Schema string
            budget: j.budget || 0,
            status: j.status.toLowerCase(),
            applications: j._count.applications,
            postedDate: j.createdAt.toLocaleDateString(),
            deadline: j.scheduledAt ? j.scheduledAt.toLocaleDateString() : 'No Deadline', // Using scheduledAt as proxy
            location: j.location || 'Remote',
            experience: j.experience || 'Not specified', // Schema uses 'experience'
            skills: j.skills ? j.skills.split(',') : [], // Schema uses 'skills' string
            description: j.description,
            createdAt: j.createdAt.toISOString()
        }));

        // Calculate stats
        const [statsStatus, statsBudget, totalApplications] = await Promise.all([
            prisma.job.groupBy({
                by: ['status'],
                _count: { status: true }
            }),
            prisma.job.aggregate({
                _avg: { budget: true }
            }),
            prisma.application.count()
        ]);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const statusCounts = statsStatus.reduce((acc: any, curr: any) => {
            acc[curr.status] = curr._count.status;
            return acc;
        }, {} as Record<string, number>);

        const stats = {
            totalJobs: total,
            activeJobs: statusCounts['OPEN'] || 0, // 'OPEN' is likely the active status in DB
            totalApplications: totalApplications,
            avgBudget: statsBudget._avg.budget || 0
        };

        return NextResponse.json({
            jobs: mappedJobs,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            stats
        });

    } catch (error) {
        console.error('Fetch jobs error:', error);
        return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
    }
}
