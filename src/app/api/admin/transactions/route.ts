import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/admin/transactions - List all transactions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || 'all';
    const status = searchParams.get('status') || 'all';

    const skip = (page - 1) * limit;
    const where: any = {};

    // Search
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Type Filter
    if (type !== 'all') {
      where.type = type;
    }

    // Status Filter
    if (status !== 'all') {
      where.status = status;
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          wallet: {
            include: {
              user: {
                select: {
                  name: true,
                  role: true
                }
              }
            }
          }
        }
      }),
      prisma.transaction.count({ where })
    ]);

    // Map to frontend format
    const mappedTransactions = transactions.map(t => ({
      id: t.id,
      walletId: t.walletId,
      userName: t.wallet.user.name,
      userRole: t.wallet.user.role,
      amount: t.amount,
      type: t.type,
      description: t.description || 'No description',
      reference: t.referenceId || '',
      paymentMethod: t.paymentMethod || 'platform_wallet',
      paymentId: t.paymentId || '',
      status: t.status,
      createdAt: t.createdAt.toLocaleString(),
    }));

    return NextResponse.json({
      transactions: mappedTransactions,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Fetch transactions error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
