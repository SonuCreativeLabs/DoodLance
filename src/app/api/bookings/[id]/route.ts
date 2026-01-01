import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/bookings/[id]
 * Get booking details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        service: {
          include: {
            provider: {
              include: {
                freelancerProfile: true
              }
            }
          }
        },
        client: true,
      }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Verify ownership
    const isClient = booking.clientId === user.id;
    const isFreelancer = booking.service.providerId === user.id;

    if (!isClient && !isFreelancer) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Map to frontend expected format
    const provider = booking.service.provider;
    const profile = provider.freelancerProfile;

    const mappedBooking = {
      "#": booking.id,
      service: booking.service.title,
      title: booking.service.title,
      provider: provider.name,
      freelancer: {
        name: provider.name,
        image: provider.avatar || "/images/avatar-placeholder.png",
        rating: profile?.rating || 0,
        location: profile?.location || 'Remote',
        phone: provider.phone
      },
      image: provider.avatar || "/images/avatar-placeholder.png",
      date: booking.scheduledAt ? new Date(booking.scheduledAt).toISOString().split('T')[0] : '',
      time: booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleTimeString() : '',
      status: booking.status.toLowerCase(),
      location: booking.location || "Remote",
      price: `₹${booking.totalPrice}`,
      totalPrice: booking.totalPrice,
      rating: 0,
      completedJobs: profile?.completedJobs || 0,
      description: booking.service.description,
      category: booking.service.category || "General",
      earnedMoney: `₹${booking.totalPrice}`,
      completedDate: booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleDateString() : '',
      yourRating: 0
    };

    return NextResponse.json(mappedBooking);

  } catch (error) {
    console.error('Fetch booking error:', error);
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}

/**
 * PUT /api/bookings/[id]
 * Update booking status
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, notes, rating, review } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    if (status === 'cancelled' && !notes?.trim()) {
      return NextResponse.json({ error: 'Cancellation notes are required' }, { status: 400 });
    }

    if (status === 'completed' && !review?.trim()) {
      return NextResponse.json({ error: 'Review is required for completion' }, { status: 400 });
    }

    // Verify existing booking and ownership
    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { service: true }
    });

    if (!existingBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const isClient = existingBooking.clientId === user.id;
    const isFreelancer = existingBooking.service.providerId === user.id;

    if (!isClient && !isFreelancer) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: status.toUpperCase(),
        notes: notes,
      }
    });

    return NextResponse.json({
      id: updatedBooking.id,
      status: updatedBooking.status,
      notes: updatedBooking.notes,
      rating,
      review,
      updatedAt: new Date().toISOString(),
      message: `Booking ${status} successfully`
    });

  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
