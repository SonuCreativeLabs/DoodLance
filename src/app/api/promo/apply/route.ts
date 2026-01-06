import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// POST /api/promo/apply - Apply a promo code and record usage
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { promoId, userId, orderId, orderAmount, discountAmount } = body;

        if (!promoId || !userId || !orderId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Increment promo used count
        await prisma.promoCode.update({
            where: { id: promoId },
            data: {
                usedCount: { increment: 1 }
            }
        });

        // Record usage
        await prisma.promoUsage.create({
            data: {
                promoCodeId: promoId,
                userId,
                orderId,
                orderAmount,
                discountAmount
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Promo code applied successfully'
        });

    } catch (error) {
        console.error('Promo apply error:', error);
        return NextResponse.json({ error: 'Failed to apply promo code' }, { status: 500 });
    }
}
