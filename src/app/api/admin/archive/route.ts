import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const type = searchParams.get('type') || 'all';

        const skip = (page - 1) * limit;
        const where: any = {};

        if (type !== 'all') {
            where.resourceType = type;
        }

        const [items, total] = await Promise.all([
            prisma.archivedItem.findMany({
                where,
                skip,
                take: limit,
                orderBy: { deletedAt: 'desc' },
            }),
            prisma.archivedItem.count({ where })
        ]);

        return NextResponse.json({
            items,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });

    } catch (error) {
        console.error('Fetch archive error:', error);
        return NextResponse.json({ error: 'Failed to fetch archive' }, { status: 500 });
    }
}
