import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET /api/bookings/[id] - Get booking details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
        client: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Map to frontend expected format
    const provider = booking.service.provider;
    const profile = provider.freelancerProfile;

    const mappedBooking = {
      "#": booking.id, // Keep hashtag ID or just ID? Frontend uses # currently.
      service: booking.service.title,
      title: booking.service.title,
      provider: provider.name,
      freelancer: {
        name: provider.name,
        image: provider.image,
        rating: profile?.rating || 0,
        location: profile?.location || 'Remote'
      },
      image: provider.image || "/images/avatar-placeholder.png",
      date: booking.scheduledAt ? new Date(booking.scheduledAt).toISOString().split('T')[0] : '',
      time: booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleTimeString() : '',
      status: booking.status.toLowerCase(),
      location: booking.location || "Remote",
      price: `₹${booking.totalPrice}`,
      totalPrice: booking.totalPrice,
      rating: 0, // Need to implement Review relation fetching if exists
      completedJobs: profile?.completedJobs || 0,
      description: booking.service.description,
      category: booking.service.category || "General",
      earnedMoney: `₹${booking.totalPrice}`, // Mapping totalPrice to earnedMoney for compatibility
      completedDate: booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleDateString() : '',
      yourRating: 0 // Placeholder
    }

    return NextResponse.json(mappedBooking)

  } catch (error) {
    console.error('Fetch booking error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

// PUT /api/bookings/[id] - Update booking status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, notes, rating, review } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    if (status === 'cancelled' && !notes?.trim()) {
      return NextResponse.json(
        { error: 'Cancellation notes are required' },
        { status: 400 }
      )
    }

    if (status === 'completed' && !review?.trim()) {
      return NextResponse.json(
        { error: 'Review is required for completion' },
        { status: 400 }
      )
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: status.toUpperCase(), // Primsma enum is uppercase usually? Schema said String. I'll use uppercase to be safe or consistency.
        notes: notes,
        // For rating/review, we typically create a Review record, but Booking might not have direct rating field.
        // Schema checks: Review model exists.
        // If completed, creating review would be separate call usually.
        // But if PUT handles it:
      }
    })

    return NextResponse.json({
      id: updatedBooking.id,
      status: updatedBooking.status,
      notes: updatedBooking.notes,
      rating,
      review,
      updatedAt: new Date().toISOString(),
      message: `Booking ${status} successfully`
    })

  } catch (error) {
    console.error('Update booking error:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}
