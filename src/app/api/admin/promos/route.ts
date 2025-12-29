import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createPromoSchema, validateRequest } from '@/lib/validations/admin';
import { logAdminAction } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

// GET /api/admin/promos - List all promo codes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';

    const skip = (page - 1) * limit;
    const where: any = {};

    // Search
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Status Filter
    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    const [promos, total] = await Promise.all([
      prisma.promoCode.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.promoCode.count({ where })
    ]);

    // Map stats (Mock stats for now as we don't have deep relational tracking for promo usage revenue yet)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedPromos = promos.map((p: any) => ({
      ...p,
      // Format dates
      validFrom: p.validFrom.toISOString().split('T')[0],
      validTo: p.validUntil.toISOString().split('T')[0], // Map validUntil -> validTo for frontend
      stats: {
        totalRevenue: p.usedCount * p.discountValue * 10, // Mock calculation
        averageOrderValue: 0, // Mock
        conversionRate: 0 // Mock
      }
    }));

    return NextResponse.json({
      promos: mappedPromos,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Fetch promos error:', error);
    return NextResponse.json({ error: 'Failed to fetch promo codes' }, { status: 500 });
  }
}

// POST /api/admin/promos - Create new promo code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const validation = validateRequest(createPromoSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const {
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      validUntil,
      usageLimit,
      isActive
    } = validation.data;

    // Need to handle missing validFrom in schema or assume now
    const validFrom = new Date();
    // Handle description which might be optional in schema but usually present
    const description = (body as any).description || '';

    const adminEmail = 'admin@doodlance.com';
    const adminId = 'admin-1';

    const newPromo = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue,
        minOrderValue: minOrderValue || null,
        maxDiscount: maxDiscount || null,
        validFrom,
        validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        maxUses: usageLimit || null,
        isActive: isActive !== undefined ? isActive : true,
      }
    });

    // Log action
    await logAdminAction({
      adminId,
      adminEmail,
      action: 'CREATE',
      resource: 'PROMO',
      resourceId: newPromo.id,
      details: { code },
      request
    });

    return NextResponse.json(newPromo, { status: 201 });

  } catch (error) {
    console.error('Create promo error:', error);
    // @ts-ignore
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Promo code already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create promo code' }, { status: 500 });
  }
}
