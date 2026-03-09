import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const providerId = searchParams.get('providerId');

        if (!providerId) {
            return NextResponse.json({ error: 'Provider ID is required' }, { status: 400 });
        }

        const services = await prisma.service.findMany({
            where: {
                providerId: providerId,
                isActive: true,
            },
            select: {
                id: true,
                title: true,
                price: true,
                duration: true,
                serviceType: true,
                sport: true,
            },
        });

        return NextResponse.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json(
            { error: 'Failed to fetch services' },
            { status: 500 }
        );
    }
}
