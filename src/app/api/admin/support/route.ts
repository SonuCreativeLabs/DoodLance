import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';
import { createTicketSchema, validateRequest } from '@/lib/validations/admin';
import { logAdminAction } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

// GET /api/admin/support - List all tickets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const priority = searchParams.get('priority') || 'all';
    const category = searchParams.get('category') || 'all';

    const skip = (page - 1) * limit;
    const where: any = {};

    // Search
    if (search) {
      where.OR = [
        { subject: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { ticketNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filters
    if (status !== 'all') where.status = status.toUpperCase();
    if (priority !== 'all') where.priority = priority.toUpperCase();
    if (category !== 'all') where.type = category.toUpperCase();

    // Fetch tickets
    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.supportTicket.count({ where })
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedTickets = await Promise.all(tickets.map(async (t: any) => {
      let userName = 'Unknown User';
      let userEmail = 'N/A';
      let userRole = 'user';

      if (t.userId) {
        const user = await prisma.user.findUnique({
          where: { id: t.userId },
          select: { name: true, email: true, role: true }
        });
        if (user) {
          userName = user.name;
          userEmail = user.email;
          userRole = user.role;
        }
      }

      return {
        ...t,
        category: t.type.toLowerCase(), // Map type to category (frontend expects category)
        userName,
        userEmail,
        userRole,
        messages: t.messages ? JSON.parse(t.messages) : [],
        createdAt: t.createdAt.toLocaleString(),
        updatedAt: t.updatedAt.toLocaleString()
      };
    }));

    return NextResponse.json({
      tickets: mappedTickets,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Fetch tickets error:', error);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

// POST /api/admin/support - Create NEW ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const validation = validateRequest(createTicketSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const {
      subject,
      description,
      category,
      priority,
      userId
    } = validation.data;

    // Verify user exists if provided/required
    // userEmail check logic from original code might be useful if userId is not certain,
    // but schema says userId is required. Assuming userId is passed.

    const adminEmail = 'admin@doodlance.com';
    const adminId = 'admin-1';

    const newTicket = await prisma.supportTicket.create({
      data: {
        userId,
        subject,
        description,
        type: category ? category.toUpperCase() : 'GENERAL',
        priority: priority ? priority.toUpperCase() : 'MEDIUM',
        status: 'OPEN',
        messages: JSON.stringify([]), // Initialize empty conversation
      }
    });

    // Log action
    await logAdminAction({
      adminId,
      adminEmail,
      action: 'CREATE',
      resource: 'SUPPORT_TICKET',
      resourceId: newTicket.id,
      details: { subject },
      request
    });

    return NextResponse.json(newTicket, { status: 201 });

  } catch (error) {
    console.error('Create ticket error:', error);
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}
