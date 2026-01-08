import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
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
    if (category !== 'all') where.category = category.toUpperCase(); // Schema uses 'category'

    // Fetch tickets with relations
    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              role: true
            }
          },
          messages: {
            orderBy: { createdAt: 'asc' }
          }
        }
      }),
      prisma.supportTicket.count({ where })
    ]);

    const mappedTickets = tickets.map((t: any) => ({
      id: t.id,
      ticketNumber: t.ticketNumber,
      subject: t.subject,
      description: t.description,
      category: t.category.toLowerCase(), // Schema uses 'category'
      priority: t.priority,
      status: t.status,
      assignedToId: t.assignedTo,
      userName: t.user?.name || 'Unknown',
      userEmail: t.user?.email || 'N/A',
      userRole: t.user?.role || 'user',
      messages: t.messages.map((m: any) => ({
        id: m.id,
        sender: m.isAdminReply ? 'Admin' : 'User', // Simplified logic, ideally check senderId
        senderType: m.isAdminReply ? 'admin' : 'user',
        message: m.message,
        timestamp: m.createdAt.toLocaleString()
      })),
      createdAt: t.createdAt.toLocaleString(),
      updatedAt: t.updatedAt.toLocaleString()
    }));

    // Calculate Stats
    const [statsStatus, statsPriority] = await Promise.all([
      prisma.supportTicket.groupBy({
        by: ['status'],
        _count: { status: true }
      }),
      prisma.supportTicket.groupBy({
        by: ['priority'],
        _count: { priority: true }
      })
    ]);

    const statusCounts = statsStatus.reduce((acc: any, curr: any) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);

    const priorityCounts = statsPriority.reduce((acc: any, curr: any) => {
      acc[curr.priority] = curr._count.priority;
      return acc;
    }, {} as Record<string, number>);

    const stats = {
      totalTickets: total,
      openTickets: statusCounts['OPEN'] || 0,
      inProgress: statusCounts['IN_PROGRESS'] || 0,
      resolved: statusCounts['RESOLVED'] || 0,
      urgentTickets: priorityCounts['URGENT'] || 0,
      avgResponseTime: '2.5 hours' // Placeholder
    };

    return NextResponse.json({
      tickets: mappedTickets,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats
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
    // Find user by email (as Admin UI sends email)
    const user = await prisma.user.findUnique({
      where: { email: body.userEmail } // UI sends userEmail
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found with this email' }, { status: 404 });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: user.id,
        subject: body.subject,
        description: body.description,
        category: body.category.toUpperCase(),
        priority: body.priority.toUpperCase(),
        status: 'OPEN',
        ticketNumber: `TKT-${Date.now().toString().slice(-6)}`
      }
    });

    // Log Action
    await logAdminAction({
      adminId: 'admin-1', // Simplified
      adminEmail: 'admin@doodlance.com',
      action: 'CREATE',
      resource: 'SUPPORT_TICKET',
      resourceId: ticket.id,
      details: body,
      request
    });

    return NextResponse.json(ticket);

  } catch (error) {
    console.error('Create ticket error:', error);
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}
