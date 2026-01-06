import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// POST /api/admin/promos/validate - Validate promo code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, userId, amount, serviceId } = body;

    const promo = await prisma.promoCode.findUnique({
      where: { code: code }
    });

    if (!promo) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid promo code'
      });
    }

    // Check if active
    if (!promo.isActive) {
      return NextResponse.json({
        valid: false,
        error: 'Promo code is inactive'
      });
    }

    // Check validity dates
    const now = new Date();
    const validFrom = new Date(promo.validFrom);
    const validTo = new Date(promo.validUntil);

    if (now < validFrom) {
      return NextResponse.json({
        valid: false,
        error: 'Promo code not yet valid'
      });
    }

    if (now > validTo) {
      return NextResponse.json({
        valid: false,
        error: 'Promo code has expired'
      });
    }

    // Check usage limits
    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return NextResponse.json({
        valid: false,
        error: 'Promo code usage limit reached'
      });
    }

    // Check minimum amount
    if (promo.minOrderValue && amount < promo.minOrderValue) {
      return NextResponse.json({
        valid: false,
        error: `Minimum amount required: ₹${promo.minOrderValue}`
      });
    }

    // Calculate discount
    let discount = 0;
    // Assuming discountType is 'PERCENTAGE' or 'FIXED' - check consistency with creation logic (usually 'percentage')
    const type = promo.discountType.toLowerCase();

    if (type === 'percentage') {
      discount = (amount * promo.discountValue) / 100;
      if (promo.maxDiscount) {
        discount = Math.min(discount, promo.maxDiscount);
      }
    } else {
      discount = Math.min(promo.discountValue, amount);
    }

    return NextResponse.json({
      valid: true,
      discount,
      finalAmount: amount - discount,
      promoCode: {
        ...promo,
        // Map back keys if frontend expects specific structure
        validTo: promo.validUntil,
        type: promo.discountType,
        value: promo.discountValue,
        minAmount: promo.minOrderValue
      }
    });
  } catch (error) {
    console.error('Validate promo code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
