import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// POST /api/promo/validate - Validate a promo code
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { code, userId, orderAmount } = body;

        if (!code) {
            return NextResponse.json({ error: 'Promo code is required' }, { status: 400 });
        }

        // Find the promo code (case-insensitive)
        const promo = await prisma.promoCode.findFirst({
            where: {
                code: {
                    equals: code,
                    mode: 'insensitive'
                }
            }
        });

        if (!promo) {
            return NextResponse.json({
                valid: false,
                error: 'Invalid promo code'
            }, { status: 200 });
        }

        // Check if promo is active
        if (promo.status !== 'active') {
            return NextResponse.json({
                valid: false,
                error: 'This promo code is no longer active'
            }, { status: 200 });
        }

        // Check expiration
        if (promo.endDate && new Date() > promo.endDate) {
            return NextResponse.json({
                valid: false,
                error: 'This promo code has expired'
            }, { status: 200 });
        }

        // Check if not yet started
        if (promo.startDate && new Date() < promo.startDate) {
            return NextResponse.json({
                valid: false,
                error: 'This promo code is not yet active'
            }, { status: 200 });
        }

        // Check usage limit
        if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
            return NextResponse.json({
                valid: false,
                error: 'This promo code has reached its usage limit'
            }, { status: 200 });
        }

        // Check if user has already used this code (if userId provided)
        if (userId && promo.perUserLimit) {
            const userUsage = await prisma.promoUsage.count({
                where: {
                    promoCodeId: promo.id,
                    userId
                }
            });

            if (userUsage >= promo.perUserLimit) {
                return NextResponse.json({
                    valid: false,
                    error: 'You have already used this promo code'
                }, { status: 200 });
            }
        }

        // Check minimum order amount
        if (promo.minOrderAmount && orderAmount && orderAmount < promo.minOrderAmount) {
            return NextResponse.json({
                valid: false,
                error: `Minimum order amount of ₹${promo.minOrderAmount} required`
            }, { status: 200 });
        }

        // Calculate discount
        let discountAmount = 0;
        if (promo.discountType === 'percentage') {
            discountAmount = (orderAmount * promo.discountValue) / 100;
            if (promo.maxDiscount && discountAmount > promo.maxDiscount) {
                discountAmount = promo.maxDiscount;
            }
        } else if (promo.discountType === 'fixed') {
            discountAmount = promo.discountValue;
        }

        return NextResponse.json({
            valid: true,
            promoId: promo.id,
            code: promo.code,
            description: promo.description,
            discountType: promo.discountType,
            discountValue: promo.discountValue,
            discountAmount,
            maxDiscount: promo.maxDiscount
        });

    } catch (error) {
        console.error('Promo validation error:', error);
        return NextResponse.json({ error: 'Failed to validate promo code' }, { status: 500 });
    }
}
