import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

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
    const clientId = searchParams.get('clientId')

    const where: any = {
      isActive: true,
    }

    // Add filters
    if (clientId) where.clientId = clientId
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
        },
        applications: {
          select: {
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Parse string fields back to arrays for backwards compatibility
    const jobsWithParsedFields = jobs.map((job: any) => {
      let peopleNeeded = 1;
      try {
        if (job.notes) {
          const parsed = JSON.parse(job.notes);
          if (parsed.peopleNeeded) peopleNeeded = parsed.peopleNeeded;
        }
      } catch (e) { }

      return {
        ...job,
        coords: job.coords ? JSON.parse(job.coords) : [],
        skills: job.skills ? job.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        duration: job.duration || 'hourly',
        experience: job.experience || 'Intermediate',
        workMode: job.workMode || 'remote',
        type: job.type || 'freelance',
        scheduledAt: job.scheduledAt, // Preserve the stored scheduledAt date
        peopleNeeded,
      }
    })

    return NextResponse.json(jobsWithParsedFields)
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

    // Check if user is a client (use session role directly since it's already set correctly)
    if (user.currentRole !== 'client' && user.role !== 'client') {
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
      startDate,
      peopleNeeded,
    } = body

    // Ensure user exists in database to prevent foreign key errors
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        currentRole: user.currentRole,
        coords: '[]', // Default empty coords
      }
    });

    // Validated required fields
    if (!title || !description || !category || !budget || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update or create client profile
    // Temporarily disabled to isolate issue
    /*
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
    */

    // Generate custom job ID
    // Format: J-{city}{area}{number} (e.g., J-tnche001)
    const generateJobId = async (location: string): Promise<string> => {
      // Extract city/area codes from location
      // Simple approach: take first 2 chars of first word + first 3 chars of second word
      const locationParts = location.toLowerCase().replace(/[^a-z\s]/g, '').split(' ')
      const cityCode = (locationParts[0] || 'xx').substring(0, 2)
      const areaCode = (locationParts[1] || locationParts[0] || 'xxx').substring(0, 3)

      // Count existing jobs to get serial number
      const jobCount = await prisma.job.count()
      const serialNumber = String(jobCount + 1).padStart(3, '0')

      return `J-${cityCode}${areaCode}${serialNumber}`
    }

    const jobId = await generateJobId(location)

    // Create the job with custom ID
    const job = await prisma.job.create({
      data: {
        id: jobId,
        title,
        description,
        category,
        budget: parseFloat(budget),
        budgetMin: budgetMin ? parseFloat(budgetMin) : null,
        budgetMax: budgetMax ? parseFloat(budgetMax) : null,
        location,
        coords: coords ? JSON.stringify(coords) : JSON.stringify([]),
        skills: Array.isArray(skills) ? skills.join(',') : (skills || ''),
        workMode: workMode || 'remote',
        type: type || 'freelance',
        duration: duration || 'hourly',
        experience: experience || 'Intermediate',
        clientId: user.id,
        isActive: true,
        proposals: 0,
        scheduledAt: startDate ? new Date(startDate).toISOString() : null,
        notes: JSON.stringify({ peopleNeeded: peopleNeeded || 1 }),
      },
    })

    // Create notification for job posting
    // Temporarily disabled - may be causing 500 error
    /*
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
    */

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error('Error creating job:', error)
    // Log the detailed error for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json(
      {
        error: 'Failed to create job',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
