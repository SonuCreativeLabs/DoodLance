import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createPromoSchema, validateRequest } from '@/lib/validations/admin';
import { logAdminAction } from '@/lib/audit-log';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// GET /api/admin/promos - List all promo codes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all'; // 'all', 'active', 'inactive'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status !== 'all') {
      whereClause.status = status;
    }

    // Run queries in parallel
    const [promos, total, activeCount, totalUsage, totalRevenueStr, totalPromosCount] = await Promise.all([
      prisma.promoCode.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.promoCode.count({ where: whereClause }),
      prisma.promoCode.count({ where: { status: 'active' } }),
      prisma.promoUsage.count(),
      prisma.promoUsage.aggregate({ _sum: { orderAmount: true, discountAmount: true } }),
      prisma.promoCode.count()
    ]);

    const formattedPromos = promos.map(p => ({
      ...p,
      isActive: p.status === 'active', // Map for frontend convenience if it expects boolean
      validFrom: p.startDate.toISOString().split('T')[0],
      validTo: p.endDate ? p.endDate.toISOString().split('T')[0] : 'Forever',
      maxUses: p.usageLimit, // Map to what frontend might expect
      stats: {
        totalRevenue: 0 // We can implement per-promo stats later if needed
      }
    }));

    return NextResponse.json({
      promos: formattedPromos,
      totalPages: Math.ceil(total / limit),
      stats: {
        totalPromos: totalPromosCount,
        activePromos: activeCount,
        totalUsage,
        totalRevenue: totalRevenueStr._sum.orderAmount || 0,
        totalSaved: totalRevenueStr._sum.discountAmount || 0
      }
    });

  } catch (error) {
    console.error('Failed to fetch promos:', error);
    return NextResponse.json({ error: 'Failed to fetch promos' }, { status: 500 });
  }
}

// POST /api/admin/promos - Create new promo code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check auth
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Since we are fixing the schema mismatch, let's look at the body directly
    // Frontend likely sends: { code, description, discountType, discountValue, validFrom, validTo, usageLimit, minOrderAmount }

    const {
      code,
      description,
      discountType,
      discountValue,
      validFrom,
      validTo,
      usageLimit,
      minOrderAmount,
      perUserLimit
    } = body;

    const existing = await prisma.promoCode.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json({ error: 'Promo code already exists' }, { status: 400 });
    }

    const newPromo = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        description: description || '',
        discountType: discountType,
        discountValue: parseFloat(discountValue),
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
        startDate: new Date(validFrom),
        endDate: validTo ? new Date(validTo) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        status: 'active',
        // Default values
        perUserLimit: perUserLimit ? parseInt(perUserLimit) : 1,
        maxDiscount: null
      }
    });

    // Audit log (optional, keeping it simple for now or usage existing helper)
    // await logAdminAction(...)

    return NextResponse.json(newPromo, { status: 201 });

  } catch (error: any) {
    console.error('Failed to create promo:', error);
    return NextResponse.json({ error: 'Failed to create promo' }, { status: 500 });
  }
}
