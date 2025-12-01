import { NextRequest, NextResponse } from 'next/server';
import { mockTickets } from '@/lib/mock/support-data';

// Use mock tickets data
let tickets = [...mockTickets];

// GET /api/admin/support/tickets - Get all tickets with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const priority = searchParams.get('priority') || 'all';
    const category = searchParams.get('category') || 'all';

    // Filter tickets
    let filteredTickets = [...tickets];
    
    if (search) {
      filteredTickets = filteredTickets.filter(ticket => 
        ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(search.toLowerCase()) ||
        ticket.userName.toLowerCase().includes(search.toLowerCase()) ||
        ticket.id.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (status !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
    }
    
    if (priority !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.priority === priority);
    }
    
    if (category !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.category === category);
    }

    // Sort by priority and created date
    filteredTickets.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - 
                           priorityOrder[b.priority as keyof typeof priorityOrder];
      if (priorityDiff !== 0) return priorityDiff;
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

    // Calculate stats
    const stats = {
      totalTickets: tickets.length,
      openTickets: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in_progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      closed: tickets.filter(t => t.status === 'closed').length,
      urgentTickets: tickets.filter(t => t.priority === 'urgent').length,
      avgResponseTime: '2.5 hours'
    };

    return NextResponse.json({
      tickets: paginatedTickets,
      total: filteredTickets.length,
      page,
      totalPages: Math.ceil(filteredTickets.length / limit),
      stats
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/support/tickets/:id - Update ticket
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticketId, updates } = body;

    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    if (ticketIndex === -1) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Update ticket
    tickets[ticketIndex] = { 
      ...tickets[ticketIndex], 
      ...updates,
      updatedAt: new Date().toLocaleString()
    };

    // If status is resolved, set resolved timestamp
    if (updates.status === 'resolved') {
      tickets[ticketIndex].resolvedAt = new Date().toLocaleString();
    }

    // Log audit action
    console.log(`Ticket ${ticketId} updated:`, updates);

    return NextResponse.json({
      success: true,
      ticket: tickets[ticketIndex]
    });
  } catch (error) {
    console.error('Update ticket error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/support/tickets/message - Send message in ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticketId, message, senderId = 'Admin', senderType = 'admin' } = body;

    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    if (ticketIndex === -1) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Add new message
    const newMessage = {
      id: `MSG${Date.now()}`,
      sender: senderId,
      senderType,
      message,
      timestamp: new Date().toLocaleString()
    };

    if (!tickets[ticketIndex].messages) {
      tickets[ticketIndex].messages = [];
    }
    
    tickets[ticketIndex].messages.push(newMessage);
    tickets[ticketIndex].updatedAt = newMessage.timestamp;

    // Auto update status if it's open
    if (tickets[ticketIndex].status === 'open' && senderType === 'admin') {
      tickets[ticketIndex].status = 'in_progress';
    }

    // Log audit action
    console.log(`Message sent to ticket ${ticketId}:`, message);

    return NextResponse.json({
      success: true,
      ticket: tickets[ticketIndex],
      message: newMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/support/tickets/:id - Delete ticket
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('id');

    if (!ticketId) {
      return NextResponse.json(
        { error: 'Ticket ID required' },
        { status: 400 }
      );
    }

    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    if (ticketIndex === -1) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Remove ticket
    const deletedTicket = tickets[ticketIndex];
    tickets = tickets.filter(t => t.id !== ticketId);

    // Log audit action
    console.log(`Ticket deleted: ${ticketId}`);

    return NextResponse.json({
      success: true,
      message: 'Ticket deleted',
      ticket: deletedTicket
    });
  } catch (error) {
    console.error('Delete ticket error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
