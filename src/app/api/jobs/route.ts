import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET /api/jobs - Get all active jobs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const skills = searchParams.get('skills')
    const budgetMin = searchParams.get('budgetMin')
    const budgetMax = searchParams.get('budgetMax')
    const experience = searchParams.get('experience')

    const where: any = {
      isActive: true,
    }

    // Add filters
    if (category) where.category = category
    if (experience) where.experience = experience
    if (budgetMin || budgetMax) {
      where.budget = {}
      if (budgetMin) where.budget.gte = parseFloat(budgetMin)
      if (budgetMax) where.budget.lte = parseFloat(budgetMax)
    }

    // Location-based filtering (simplified - could be enhanced with geospatial queries)
    if (location) where.location = { contains: location }

    // Skills filtering
    if (skills) {
      const skillsArray = skills.split(',')
      where.skills = { hasSome: skillsArray }
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            avatar: true,
            location: true,
            isVerified: true,
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

// POST /api/jobs - Create a new job (clients only)
export async function POST(request: NextRequest) {
  try {
    // Get user from session using our auth system
    const sessionResponse = await fetch(`${request.nextUrl.origin}/api/auth/session`)
    if (!sessionResponse.ok) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const user = await sessionResponse.json()

    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is a client
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true, currentRole: true }
    })

    if (dbUser?.currentRole !== 'client' && dbUser?.role !== 'client') {
      return NextResponse.json(
        { error: 'Only clients can create job posts' },
        { status: 403 }
      )
    }

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
    } = body

    // Validate required fields
    if (!title || !description || !category || !budget || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update or create client profile
    await prisma.clientProfile.upsert({
      where: { userId: user.id },
      update: {
        projectsPosted: { increment: 1 }
      },
      create: {
        userId: user.id,
        projectsPosted: 1,
      }
    })

    // Create the job
    const job = await prisma.job.create({
      data: {
        title,
        description,
        category,
        budget: parseFloat(budget),
        budgetMin: budgetMin ? parseFloat(budgetMin) : null,
        budgetMax: budgetMax ? parseFloat(budgetMax) : null,
        location,
        coords: coords || [],
        skills: skills || [],
        workMode: workMode || 'remote',
        type: type || 'freelance',
        duration,
        experience: experience || 'Intermediate',
        clientId: user.id,
        isActive: true,
        proposals: 0,
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

    // Create notification for job posting
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Job Posted Successfully',
        message: `Your job "${title}" has been posted and is now visible to freelancers`,
        type: 'SYSTEM_UPDATE',
        entityId: job.id,
        entityType: 'job',
        actionUrl: `/client/jobs/${job.id}`,
      }
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    )
  }
}
