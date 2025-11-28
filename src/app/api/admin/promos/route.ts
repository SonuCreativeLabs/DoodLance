import { NextRequest, NextResponse } from 'next/server';
import { mockPromoCodes } from '@/lib/mock/promo-data';

// Use mock promo codes data
let promoCodes = [...mockPromoCodes];

// GET /api/admin/promos - Get all promo codes with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const type = searchParams.get('type') || 'all';

    // Filter promo codes
    let filteredPromos = [...promoCodes];
    
    if (search) {
      filteredPromos = filteredPromos.filter(promo => 
        promo.code.toLowerCase().includes(search.toLowerCase()) ||
        promo.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (status !== 'all') {
      filteredPromos = filteredPromos.filter(promo => 
        status === 'active' ? promo.isActive : !promo.isActive
      );
    }
    
    if (type !== 'all') {
      filteredPromos = filteredPromos.filter(promo => promo.type === type);
    }

    // Check validity dates
    const now = new Date();
    filteredPromos = filteredPromos.map(promo => {
      const validFrom = new Date(promo.validFrom);
      const validTo = new Date(promo.validTo);
      const isExpired = validTo < now;
      const isUpcoming = validFrom > now;
      
      return {
        ...promo,
        isExpired,
        isUpcoming,
        isCurrentlyValid: !isExpired && !isUpcoming
      };
    });

    // Sort by created date (newest first)
    filteredPromos.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPromos = filteredPromos.slice(startIndex, endIndex);

    // Calculate stats
    const stats = {
      totalPromos: promoCodes.length,
      activePromos: promoCodes.filter(p => p.isActive).length,
      totalUsage: promoCodes.reduce((sum, p) => sum + p.usageCount, 0),
      totalRevenue: promoCodes.reduce((sum, p) => sum + p.stats.totalRevenue, 0),
      avgConversion: Math.round(
        promoCodes.reduce((sum, p) => sum + p.stats.conversionRate, 0) / promoCodes.length
      ),
      totalSaved: promoCodes.reduce((sum, p) => sum + (p.value * p.usageCount), 0)
    };

    return NextResponse.json({
      promoCodes: paginatedPromos,
      total: filteredPromos.length,
      page,
      totalPages: Math.ceil(filteredPromos.length / limit),
      stats
    });
  } catch (error) {
    console.error('Get promo codes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/promos - Create new promo code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate promo code doesn't already exist
    const exists = promoCodes.some(p => p.code === body.code);
    if (exists) {
      return NextResponse.json(
        { error: 'Promo code already exists' },
        { status: 400 }
      );
    }

    // Create new promo code
    const newPromo = {
      id: `PROMO${Date.now()}`,
      ...body,
      usageCount: 0,
      createdBy: body.createdBy || 'Admin',
      createdAt: new Date().toISOString().split('T')[0],
      stats: {
        totalRevenue: 0,
        averageOrderValue: 0,
        conversionRate: 0
      }
    };

    promoCodes.push(newPromo);

    // Log audit action
    console.log(`Promo code created: ${newPromo.code}`);

    return NextResponse.json({
      success: true,
      promoCode: newPromo,
      message: 'Promo code created successfully'
    });
  } catch (error) {
    console.error('Create promo code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/promos/:id - Update promo code
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { promoId, updates } = body;

    const promoIndex = promoCodes.findIndex(p => p.id === promoId);
    if (promoIndex === -1) {
      return NextResponse.json(
        { error: 'Promo code not found' },
        { status: 404 }
      );
    }

    // Update promo code
    promoCodes[promoIndex] = { 
      ...promoCodes[promoIndex], 
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Log audit action
    console.log(`Promo code ${promoId} updated:`, updates);

    return NextResponse.json({
      success: true,
      promoCode: promoCodes[promoIndex]
    });
  } catch (error) {
    console.error('Update promo code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/promos/:id - Delete promo code
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const promoId = searchParams.get('id');

    if (!promoId) {
      return NextResponse.json(
        { error: 'Promo ID required' },
        { status: 400 }
      );
    }

    const promoIndex = promoCodes.findIndex(p => p.id === promoId);
    if (promoIndex === -1) {
      return NextResponse.json(
        { error: 'Promo code not found' },
        { status: 404 }
      );
    }

    // Remove promo code
    const deletedPromo = promoCodes[promoIndex];
    promoCodes = promoCodes.filter(p => p.id !== promoId);

    // Log audit action
    console.log(`Promo code deleted: ${promoId}`);

    return NextResponse.json({
      success: true,
      message: 'Promo code deleted',
      promoCode: deletedPromo
    });
  } catch (error) {
    console.error('Delete promo code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
