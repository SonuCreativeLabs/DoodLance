import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const today = new Date();

        // Fetch active promos valid for today
        // We arbitrarily pick 'featured' ones.
        // Ideally we'd have a 'isFeatured' flag.
        // For now, we take the 3 most recent active promos.
        // Or we could check description for keywords like 'Welcome', 'Weekend'.

        // Let's just return active ones.
        const activePromos = await prisma.promoCode.findMany({
            where: {
                status: 'active',
                startDate: { lte: today },
                OR: [
                    { endDate: null },
                    { endDate: { gte: today } }
                ]
            },
            take: 4,
            orderBy: { createdAt: 'desc' }
        });

        // Map to frontend friendly format if needed, primarily matching what ClientHome expects
        // The current ClientHome expects: title (description?), discount, code.
        // We will return generic promo objects.

        return NextResponse.json({ promos: activePromos });
    } catch (error) {
        console.error('Fetch featured promos error:', error);
        return NextResponse.json({ error: 'Failed to fetch promos' }, { status: 500 });
    }
}
