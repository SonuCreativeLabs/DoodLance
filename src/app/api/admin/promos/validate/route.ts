import { NextRequest, NextResponse } from 'next/server';
import { mockPromoCodes } from '@/lib/mock/promo-data';

// Use mock promo codes data
const promoCodes = [...mockPromoCodes];

// POST /api/admin/promos/validate - Validate promo code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, userId, amount, serviceId } = body;

    const promo = promoCodes.find(p => p.code === code);
    
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
    const validTo = new Date(promo.validTo);
    
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
    if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
      return NextResponse.json({
        valid: false,
        error: 'Promo code usage limit reached'
      });
    }

    // Check minimum amount
    if (amount < promo.minAmount) {
      return NextResponse.json({
        valid: false,
        error: `Minimum amount required: ₹${promo.minAmount}`
      });
    }

    // Calculate discount
    let discount = 0;
    if (promo.type === 'percentage') {
      discount = Math.min((amount * promo.value) / 100, promo.maxDiscount);
    } else {
      discount = Math.min(promo.value, amount);
    }

    return NextResponse.json({
      valid: true,
      discount,
      finalAmount: amount - discount,
      promoCode: promo
    });
  } catch (error) {
    console.error('Validate promo code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
