import { NextRequest, NextResponse } from 'next/server';
import { mockBookings } from '@/lib/mock/admin-data';

// Use mock bookings data
let bookings = [...mockBookings];

// GET /api/admin/bookings - Get all bookings with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const category = searchParams.get('category') || 'all';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // Filter bookings
    let filteredBookings = [...bookings];
    
    if (search) {
      filteredBookings = filteredBookings.filter(booking => 
        booking.id.toLowerCase().includes(search.toLowerCase()) ||
        booking.serviceTitle.toLowerCase().includes(search.toLowerCase()) ||
        booking.clientName.toLowerCase().includes(search.toLowerCase()) ||
        booking.freelancerName.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (status !== 'all') {
      filteredBookings = filteredBookings.filter(booking => booking.status === status);
    }
    
    if (category !== 'all') {
      filteredBookings = filteredBookings.filter(booking => booking.serviceCategory === category);
    }
    
    if (dateFrom) {
      filteredBookings = filteredBookings.filter(booking => 
        new Date(booking.createdAt) >= new Date(dateFrom)
      );
    }
    
    if (dateTo) {
      filteredBookings = filteredBookings.filter(booking => 
        new Date(booking.createdAt) <= new Date(dateTo)
      );
    }

    // Sort by created date (newest first)
    filteredBookings.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

    // Calculate stats
    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'PENDING').length,
      confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
      inProgress: bookings.filter(b => b.status === 'IN_PROGRESS').length,
      completed: bookings.filter(b => b.status === 'COMPLETED').length,
      cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
      disputed: bookings.filter(b => b.status === 'DISPUTED').length,
      totalRevenue: bookings.reduce((sum, b) => sum + b.totalPrice, 0),
      platformEarnings: bookings.reduce((sum, b) => sum + b.platformFee, 0),
    };

    return NextResponse.json({
      bookings: paginatedBookings,
      total: filteredBookings.length,
      page,
      totalPages: Math.ceil(filteredBookings.length / limit),
      stats
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/bookings/:id - Update booking
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, updates } = body;

    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Update booking
    bookings[bookingIndex] = { 
      ...bookings[bookingIndex], 
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // If status is being updated to completed, set progress to 100
    if (updates.status === 'COMPLETED') {
      bookings[bookingIndex].progress = 100;
      bookings[bookingIndex].completedAt = new Date().toISOString();
    }

    // Log audit action
    console.log(`Booking ${bookingId} updated:`, updates);

    return NextResponse.json({
      success: true,
      booking: bookings[bookingIndex]
    });
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/bookings/action - Perform booking actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, action, data } = body;

    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'updateStatus':
        bookings[bookingIndex].status = data.status;
        bookings[bookingIndex].updatedAt = new Date().toISOString();
        break;
        
      case 'updateProgress':
        bookings[bookingIndex].progress = data.progress;
        bookings[bookingIndex].updatedAt = new Date().toISOString();
        break;
        
      case 'resolveDispute':
        bookings[bookingIndex].status = 'RESOLVED';
        bookings[bookingIndex].disputeResolution = data.resolution;
        bookings[bookingIndex].resolvedAt = new Date().toISOString();
        break;
        
      case 'cancel':
        bookings[bookingIndex].status = 'CANCELLED';
        bookings[bookingIndex].cancelledAt = new Date().toISOString();
        bookings[bookingIndex].cancellationReason = data.reason;
        break;
        
      case 'refund':
        bookings[bookingIndex].status = 'REFUNDED';
        bookings[bookingIndex].refundedAt = new Date().toISOString();
        bookings[bookingIndex].refundAmount = data.amount;
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Log audit action
    console.log(`Booking action performed: ${action} on ${bookingId}`, data);

    return NextResponse.json({
      success: true,
      booking: bookings[bookingIndex],
      message: `Booking ${action} successful`
    });
  } catch (error) {
    console.error('Booking action error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/bookings/:id - Delete booking
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('id');

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID required' },
        { status: 400 }
      );
    }

    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Remove booking
    const deletedBooking = bookings[bookingIndex];
    bookings = bookings.filter(b => b.id !== bookingId);

    // Log audit action
    console.log(`Booking deleted: ${bookingId}`);

    return NextResponse.json({
      success: true,
      message: 'Booking deleted',
      booking: deletedBooking
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
