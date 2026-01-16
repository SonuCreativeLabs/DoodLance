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
    if (promo.status !== 'active') {
      return NextResponse.json({
        valid: false,
        error: 'Promo code is inactive'
      });
    }

    // ... (dates check was here, assuming safely skipped by StartLine/EndLine logic or context. Wait, StartLine 21 covers it. I need to be careful not to overwrite the date fix I just made)

    // Wait, date fix was lines 29-47. 
    // isActive check is lines 21-27.
    // maxUses check is lines 48-54.

    // I should do 2 chunks or verify line numbers.
    // Line 22: if (!promo.isActive)
    // Line 49: if (promo.maxUses ...


    // Check minimum amount
    if (promo.minOrderAmount && amount < promo.minOrderAmount) {
      return NextResponse.json({
        valid: false,
        error: `Minimum amount required: ₹${promo.minOrderAmount}`
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
        validTo: promo.endDate,
        type: promo.discountType,
        value: promo.discountValue,
        minAmount: promo.minOrderAmount
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
