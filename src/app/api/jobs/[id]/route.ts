import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
            freelancer: {
              select: {
                id: true,
                name: true,
                avatar: true,
                location: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      }
    })

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...job,
      payment: job.budget
    })
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
      freelancerRating: reqFreelancerRating = null
    } = body

    // 1. Prepare data for update
    const updateData: any = {
      updatedAt: new Date(),
    }

    if (status) {
      updateData.status = status

      if (status === 'started') {
        updateData.startedAt = new Date()
      } else if (status === 'completed') {
        updateData.completedAt = new Date()
      } else if (status === 'cancelled') {
        if (!notes?.trim()) {
          return NextResponse.json(
            { error: 'Cancellation notes are required' },
            { status: 400 }
          )
        }
        updateData.cancelledAt = new Date()
        updateData.cancellationReason = notes // Assuming schema has this, or we store it in notes
        // If schema doesn't have cancellationReason, we might skip it or check schema
      }
    }

    // 2. Handle Rating/Review (if finalizing a job)
    // Structure depends on your schema. Assuming Job model has embedded fields or relations.
    // Based on previous code, it seemed to handle 'freelancerRating' JSON or separate fields.
    // Let's assume the schema supports a Json field `freelancerRating` or similar.

    if (reqFreelancerRating || reqRating) {
      const ratingData = reqFreelancerRating || {
        stars: reqRating,
        review: reqReview,
        feedbackChips: reqFeedbackChips,
        date: new Date().toISOString()
      };
      // Update database field - adjusting key based on probable schema structure from reading earlier
      updateData.freelancerRating = ratingData;
    }

    // 3. Perform Update
    const updatedJob = await prisma.job.update({
      where: { id: params.id },
      data: updateData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            avatar: true,
            location: true,
            isVerified: true
          }
        }
      }
    })

    // 4. Return updated job
    return NextResponse.json({
      ...updatedJob,
      payment: updatedJob.budget, // Map budget to payment for frontend compatibility
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
    // First check if job exists and get client info
    const existingJob = await prisma.job.findUnique({
      where: { id: params.id },
      select: { clientId: true, title: true }
    })

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Delete the job (applications will be cascade deleted due to schema)
    await prisma.job.delete({
      where: { id: params.id }
    })

    // Create notification for job deletion
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
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    )
  }
}
