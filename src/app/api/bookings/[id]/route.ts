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
    let { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      // Fallback: Check for 'auth-token' (Legacy/JWT)
      const { cookies } = await import('next/headers');
      const cookieStore = cookies();
      const token = cookieStore.get('auth-token')?.value;

      if (token) {
        try {
          const { verifyAccessToken } = await import('@/lib/auth/jwt');
          const decoded = verifyAccessToken(token);
          if (decoded && decoded.userId) {
            const dbUser = await prisma.user.findUnique({
              where: { id: decoded.userId }
            });
            if (dbUser) {
              // Proceed as authenticated with this user
              user = { id: dbUser.id, role: dbUser.role || 'client', email: dbUser.email || '' } as any;
              // Fallback successful
            }
          }
        } catch (e) {
          console.warn('JWT Fallback failed in booking/[id]:', e);
        }
      }
    }

    if (!user) {
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
            },
            category: true
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
    const provider = booking.service?.provider;
    const profile = provider?.freelancerProfile;

    const mappedBooking = {
      "#": booking.id,
      service: booking.service?.title || 'Unknown Service',
      title: booking.service?.title || 'Unknown Service',
      provider: provider?.name || 'Unknown Provider',
      freelancer: {
        name: provider?.name || 'Unknown',
        image: provider?.avatar || "/images/avatar-placeholder.png",
        rating: profile?.rating || 0,
        location: provider?.location || 'Remote',
        phone: provider?.phone || ''
      },
      image: provider?.avatar || "/images/avatar-placeholder.png",
      date: booking.scheduledAt ? new Date(booking.scheduledAt).toISOString().split('T')[0] : '',
      time: booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleTimeString() : '',
      status: booking.status.toLowerCase(),
      location: booking.location || "Remote",
      price: `₹${booking.totalPrice}`,
      totalPrice: booking.totalPrice,
      rating: 0, // Schema has complex Json rating, using placeholder
      review: (booking as any).review || '',
      completedJobs: profile?.completedJobs || 0,
      description: booking.service?.description || '',
      category: booking.service?.category?.name || "General",
      earnedMoney: `₹${booking.totalPrice}`,
      completedDate: (booking as any).deliveredAt
        ? new Date((booking as any).deliveredAt).toLocaleDateString()
        : (booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleDateString() : ''),
      cancellationNotes: booking.notes || '',
      clientRating: booking.clientRating || null,
      yourRating: 0 // Schema has complex Json rating
    };
    return NextResponse.json(mappedBooking);

  } catch (error) {
    console.error('Fetch booking error ID:', params.id, error);
    return NextResponse.json({ error: 'Failed to fetch booking', details: String(error) }, { status: 500 });
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
    let { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      // Fallback: Check for 'auth-token' (Legacy/JWT)
      const { cookies } = await import('next/headers');
      const cookieStore = cookies();
      const token = cookieStore.get('auth-token')?.value;

      if (token) {
        try {
          const { verifyAccessToken } = await import('@/lib/auth/jwt');
          const decoded = verifyAccessToken(token);
          if (decoded && decoded.userId) {
            const dbUser = await prisma.user.findUnique({
              where: { id: decoded.userId }
            });
            if (dbUser) {
              user = { id: dbUser.id, role: dbUser.role || 'client', email: dbUser.email || '' } as any;
            }
          }
        } catch (e) {
          console.warn('JWT Fallback failed in booking/[id] PUT:', e);
        }
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, notes, rating, review, scheduledAt } = body;

    // Validation
    if (!status && !scheduledAt && !notes && !rating && !review) {
      // Allow update if at least one field is present
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    /* 
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }
    */

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

    const updateData: any = {};
    if (status) updateData.status = status.toUpperCase();
    if (notes) updateData.notes = notes;
    if (scheduledAt) updateData.scheduledAt = new Date(scheduledAt);
    if (rating) { /* handle rating logic if implemented in DB */ }
    // Review logic might be separate or here

    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: updateData
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
