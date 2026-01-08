import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { code, orderAmount, userId } = body;

        if (!code) {
            return NextResponse.json({ error: 'Promo code is required' }, { status: 400 });
        }

        const promo = await prisma.promoCode.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!promo) {
            return NextResponse.json({ valid: false, error: 'Invalid promo code' }, { status: 404 });
        }

        // 1. Check Status
        if (promo.status !== 'active') {
            return NextResponse.json({ valid: false, error: 'Promo code is inactive' }, { status: 400 });
        }

        // 2. Check Date
        const now = new Date();
        if (promo.startDate > now) {
            return NextResponse.json({ valid: false, error: 'Promo code not yet active' }, { status: 400 });
        }
        if (promo.endDate && promo.endDate < now) {
            return NextResponse.json({ valid: false, error: 'Promo code expired' }, { status: 400 });
        }

        // 3. Check Usage Limits (Global)
        if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
            return NextResponse.json({ valid: false, error: 'Promo code usage limit reached' }, { status: 400 });
        }

        // 4. Check Minimum Order
        if (promo.minOrderAmount && orderAmount && orderAmount < promo.minOrderAmount) {
            return NextResponse.json({
                valid: false,
                error: `Minimum order of ₹${promo.minOrderAmount} required`
            }, { status: 400 });
        }

        // 5. Check Per User Limit (if userId provided)
        if (userId && promo.perUserLimit) {
            const userUsage = await prisma.promoUsage.count({
                where: {
                    promoCodeId: promo.id,
                    userId: userId
                }
            });
            if (userUsage >= promo.perUserLimit) {
                return NextResponse.json({ valid: false, error: 'You have already used this promo code' }, { status: 400 });
            }
        }

        // Calculate Discount
        let discount = 0;
        if (orderAmount) {
            if (promo.discountType === 'PERCENTAGE' || promo.discountType === 'percentage') {
                discount = (orderAmount * promo.discountValue) / 100;
                if (promo.maxDiscount && discount > promo.maxDiscount) {
                    discount = promo.maxDiscount;
                }
            } else {
                discount = promo.discountValue;
            }
        }

        return NextResponse.json({
            valid: true,
            promo: {
                code: promo.code,
                discountType: promo.discountType,
                discountValue: promo.discountValue,
                description: promo.description,
                calculatedDiscount: discount
            }
        });

    } catch (error) {
        console.error('Validate promo error:', error);
        return NextResponse.json({ error: 'Failed to validate promo' }, { status: 500 });
    }
}
