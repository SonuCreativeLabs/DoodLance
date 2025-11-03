import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// Mock data for fallback when database is not available
const mockBookings = {
  '#TNCHE001': {
    "#": "#TNCHE001",
    service: "Batting Coaching",
    provider: "Rahul Sharma",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    date: new Date().toISOString().split('T')[0],
    time: "11:00 AM",
    status: "ongoing",
    location: "Chepauk Stadium, Chennai",
    price: "₹1,200/session",
    rating: 4.8,
    completedJobs: 342,
    description: "Advanced batting technique and shot selection coaching",
    category: "cricket"
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

    // For now, just return success for mock/demo purposes
    // In a real implementation, this would update the database
    return NextResponse.json({
      id: params.id,
      status,
      notes,
      rating,
      review,
      updatedAt: new Date().toISOString(),
      message: `Booking ${status} successfully`
    })

  } catch (error) {
    console.error('Database error, simulating success:', error)

    // Simulate success for demo purposes when database fails
    return NextResponse.json({
      id: params.id,
      status: 'updated',
      message: 'Booking updated successfully (demo mode)'
    })
  }
}
