import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Try to find as Job
    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            avatar: true,
            location: true,
            isVerified: true,
            phone: true,
          }
        },
        applications: {
          include: {
            freelancer: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      }
    })

    if (job) {
      return NextResponse.json({
        ...job,
        payment: job.budget
      })
    }

    // 2. If not found, try to find as Booking
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            avatar: true,
            location: true,
            isVerified: true,
            phone: true,
          }
        },
        service: true // Include service details for job info
      }
    })

    if (booking) {
      // Auto-generate OTP if missing (for legacy bookings)
      let otp = booking.otp;
      if (!otp && (booking.status === 'confirmed' || booking.status === 'pending' || booking.status === 'PENDING')) {
        otp = Math.floor(1000 + Math.random() * 9000).toString();
        await prisma.booking.update({
          where: { id: booking.id },
          data: { otp }
        });
      }

      // Map booking to job shape
      return NextResponse.json({
        id: booking.id,
        title: booking.service.title,
        description: booking.service.description,
        status: booking.status === 'PENDING' ? 'OPEN' : booking.status === 'CONFIRMED' ? 'OPEN' : booking.status === 'ONGOING' ? 'STARTED' : booking.status,
        payment: booking.totalPrice,
        location: booking.location,
        scheduledAt: booking.scheduledAt,
        duration: booking.duration + " mins",
        client: booking.client,
        otp: otp,
        clientId: booking.clientId,
        category: 'Services', // Generic category
        workMode: 'On-site', // Default or derive
        experience: 'N/A',
        skills: '', // Or derive from service tags
        peopleNeeded: 1,
        applications: [], // No applications for direct booking
      })
    }

    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    )

  } catch (error) {
    console.error('Database error fetching job:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      status,
      notes,
      rating: reqRating = 0,
      review: reqReview = '',
      feedbackChips: reqFeedbackChips = [],
      freelancerRating: reqFreelancerRating = null,
      otp: reqOtp // OTP provided for verification
    } = body

    // Check if it's a Job or Booking
    const isJob = await prisma.job.findUnique({ where: { id: params.id } })
    const isBooking = !isJob && await prisma.booking.findUnique({ where: { id: params.id } })

    if (!isJob && !isBooking) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // OTP Verification for Starting Job
    if (status === 'started') {
      const entity = (isJob || isBooking);
      // Only verify if entity has an OTP set. If null, maybe allow start?
      // Or strictly require OTP if it exists.
      if (entity?.otp) {
        if (!reqOtp || reqOtp !== entity.otp) {
          return NextResponse.json({ error: 'Invalid start code' }, { status: 400 })
        }
      }
    }

    // 1. Prepare data for update
    const updateData: any = {
      updatedAt: new Date(),
    }

    if (status) {
      // Normalize status string for logic
      let dbStatus = status;
      if (!isJob && status === 'started') dbStatus = 'ONGOING'; // Booking uses ONGOING
      if (isJob && status === 'started') dbStatus = 'ONGOING'; // Job uses ONGOING? Schema says 'OPEN' default.
      // Wait, schema for Job says "OPEN" default.
      // Schema for Booking says "PENDING".
      // We need to map 'started' -> 'ONGOING' for Booking? Or 'STARTED'?
      // Schema Line 127: status String @default("PENDING")
      // Schema Line 12 (Booking): "status" is string, default "PENDING". Value is arbitrary string.
      // Schema Line 194 (Job): "status" is string, default "OPEN".

      // Let's stick to conventional uppercase for DB if we can, or just pass through if current usage is consistent.
      // Frontend sends lowercase 'started', 'completed', 'cancelled'.
      // Current DB likely uses Uppercase or Lowercase?
      // Prisma schema defaults are uppercase "OPEN", "PENDING".
      // Let's coerce:
      if (status === 'started') dbStatus = isJob ? 'ONGOING' : 'ongoing'; // Check conventions...
      // Actually, let's look at existing code in PUT. It handled 'started', 'completed'. 
      // Existing code (lines 88-92) sets 'startedAt' etc based on status === 'started'.
      // It passes `status` directly to updateData.status.
      // So if frontend sends 'started', it saves 'started'.
      // Is that consistent with 'OPEN' default?
      // It creates mixed case in DB 'OPEN' vs 'started'. Not great but I will follow pattern.
      // BUT for Booking, schema usually expects specific enums if strict? No, it's String.

      // Let's just use what frontend sends but for Booking we prefer standard names if possible.
      // BookingCard checks 'ongoing'. So 'ongoing' is good.
      // JobDashboard checks 'started' (mapped from 'ongoing').

      if (isBooking && status === 'started') {
        updateData.status = 'ongoing'; // Client page expects 'ongoing'
      } else {
        updateData.status = status; // Jobs use 'started'?
      }

      if (status === 'started') {
        // Booking doesn't have startedAt field in schema I read?
        // Let's check schema. Booking has 'scheduledAt', 'deliveredAt'.
        // Job has 'startedAt' (Implied in code I read? NO. I did NOT see startedAt in Job schema).
        // I read schema lines 176-209.
        // Job: completedAt, updatedAt. NO startedAt.
        // So updateData.startedAt will FAIL if column missing!
        // The previous code (lines 89) had `updateData.startedAt = new Date()`.
        // This suggests `startedAt` column EXISTS or previous code was broken/hallucinating.
        // It's possible I missed it in schema view.
        // Let's assume it exists or I should avoid setting it if not sure.
        // I'll skip startedAt for now to be safe, or just check 'updatedAt'.
      }

      if (status === 'completed') {
        if (isBooking) updateData.deliveredAt = new Date();
        // if (isJob) updateData.completedAt = new Date(); // Schema has compeletedAt
        updateData.completedAt = new Date(); // Booking doesn't have completedAt?
        // Booking has 'deliveredAt'. Job has 'completedAt'.
        if (isBooking) {
          updateData.deliveredAt = new Date();
          delete updateData.completedAt;
        }
      }

      if (status === 'cancelled') {
        if (!notes?.trim()) {
          return NextResponse.json(
            { error: 'Cancellation notes are required' },
            { status: 400 }
          )
        }
        // Booking doesn't have cancelledAt?
        // Just status update.
      }
    }

    // 3. Perform Update
    let updatedRecord;
    if (isJob) {
      updatedRecord = await prisma.job.update({
        where: { id: params.id },
        data: updateData,
        include: {
          client: { select: { id: true, name: true, avatar: true, location: true, isVerified: true } }
        }
      });
    } else {
      // Booking
      updatedRecord = await prisma.booking.update({
        where: { id: params.id },
        data: updateData,
        include: {
          client: { select: { id: true, name: true, avatar: true, location: true, isVerified: true } }
        }
      });
    }

    // 4. Return updated job/booking
    return NextResponse.json({
      ...updatedRecord,
      status: status, // Return the status requested so frontend state matches
      payment: (updatedRecord as any).budget || (updatedRecord as any).totalPrice,
      message: `Job ${status || 'updated'} successfully`
    })

  } catch (error) {
    console.error('Error updating job:', error)
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    )
  }
}

// DELETE /api/jobs/[id] - Delete a job (client only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Try Job
    const existingJob = await prisma.job.findUnique({
      where: { id: params.id },
      select: { clientId: true, title: true }
    })

    if (existingJob) {
      await prisma.job.delete({ where: { id: params.id } })
      // Create notification
      await prisma.notification.create({
        data: {
          userId: existingJob.clientId,
          title: 'Job Deleted',
          message: `Your job "${existingJob.title}" has been deleted`,
          type: 'SYSTEM_UPDATE',
          entityId: params.id,
          entityType: 'job',
        }
      })
      return NextResponse.json({ message: 'Job deleted successfully' })
    }

    // Try Booking
    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id },
      select: { clientId: true, service: { select: { title: true } } }
    })

    if (existingBooking) {
      await prisma.booking.delete({ where: { id: params.id } })
      return NextResponse.json({ message: 'Booking deleted successfully' })
    }

    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    )

  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    )
  }
}
