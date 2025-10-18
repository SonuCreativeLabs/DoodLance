import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/jobs/[id] - Get a specific job
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

    return NextResponse.json(job)
  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    )
  }
}

// PUT /api/jobs/[id] - Update a job (client only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      category,
      budget,
      budgetMin,
      budgetMax,
      location,
      coords,
      skills,
      workMode,
      type,
      duration,
      experience,
      isActive,
    } = body

    // First check if job exists and get client info
    const existingJob = await prisma.job.findUnique({
      where: { id: params.id },
      select: { clientId: true }
    })

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Update the job
    const updatedJob = await prisma.job.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(category && { category }),
        ...(budget && { budget: parseFloat(budget) }),
        ...(budgetMin && { budgetMin: parseFloat(budgetMin) }),
        ...(budgetMax && { budgetMax: parseFloat(budgetMax) }),
        ...(location && { location }),
        ...(coords && { coords }),
        ...(skills && { skills }),
        ...(workMode && { workMode }),
        ...(type && { type }),
        ...(duration && { duration }),
        ...(experience && { experience }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            avatar: true,
            location: true,
            isVerified: true,
          }
        }
      }
    })

    return NextResponse.json(updatedJob)
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
