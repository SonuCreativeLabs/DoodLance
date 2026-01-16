import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { createClient } from '@/lib/supabase/server'

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

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let dbUserId = user?.id; // Default to Auth ID (fallback)

    // Resolve internal DB ID if user is logged in
    if (user) {
      const dbUser = await prisma.user.findUnique({ where: { supabaseUid: user.id } });
      if (dbUser) {
        dbUserId = dbUser.id;
      } else {
        // Fallback: Check if user exists by ID directly (legacy/mixed mode)
        const byId = await prisma.user.findUnique({ where: { id: user.id } });
        if (byId) dbUserId = byId.id;
      }
    }

    const where: any = {
      isActive: true,
    }

    // Exclude own jobs
    if (dbUserId) {
      where.clientId = { not: dbUserId }
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

    // Skills filtering - skills is a String field, not array
    if (skills) {
      // Use OR conditions to match any skill in the comma-separated list
      const skillsArray = skills.split(',').map(s => s.trim())
      where.OR = skillsArray.map(skill => ({
        skills: { contains: skill, mode: 'insensitive' }
      }))
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
            phone: true,
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
      return {
        ...job,
        coords: (() => {
          try {
            return job.coords ? JSON.parse(job.coords) : []
          } catch (e) {
            console.error(`Invalid coords for job ${job.id}:`, job.coords);
            return [];
          }
        })(),
        skills: job.skills ? job.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        duration: job.duration || 'hourly',
        experience: job.experience || 'Intermediate',
        workMode: job.workMode || 'remote',
        type: job.type || 'freelance',
        scheduledAt: job.scheduledAt, // Preserve the stored scheduledAt date
        peopleNeeded: job.peopleNeeded || 1,
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
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is a client (use session role directly since it's already set correctly)
    // Check if user is a client (use session role directly since it's already set correctly)
    // Only allow authenticated clients to create jobs
    // if (user.currentRole !== 'client' && user.role !== 'client') {
    //   return NextResponse.json(
    //     { error: 'Only clients can create job posts' },
    //     { status: 403 }
    //   )
    // }

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
    let dbUser = await prisma.user.findUnique({ where: { supabaseUid: user.id } });

    if (!dbUser) {
      // Fallback check by ID
      dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    }

    if (!dbUser) {
      // User doesn't exist? This is critical. We shouldn't auto-create here without profile data.
      // But for now, to replicate previous behavior safely:
      // Check if email exists to avoid unique constraint error
      const emailUser = user.email ? await prisma.user.findUnique({ where: { email: user.email } }) : null;

      if (emailUser) {
        dbUser = emailUser; // Link to existing email user
        // Optionally update supabaseUid here?
        if (!emailUser.supabaseUid) {
          await prisma.user.update({ where: { id: emailUser.id }, data: { supabaseUid: user.id } });
        }
      } else {
        // Create new user ONLY if absolutely unknown
        const { generateUserDisplayId } = await import('@/lib/user-id-utils');
        dbUser = await prisma.user.create({
          data: {
            // We rely on standard CUID generation for ID, but store Supabase UID
            supabaseUid: user.id,
            displayId: await generateUserDisplayId('client'),
            email: user.email || '',
            coords: '[]',
            role: 'client',
            currentRole: 'client'
          }
        });
      }
    }

    const userId = dbUser.id; // Correct CUID

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

    // Generate custom job ID using new format
    // Format: J{Category}{City}{Area}{Sequence} (e.g., JPLCHVE001)
    const { generateJobId } = await import('@/lib/id-utils');

    const jobId = await generateJobId({
      category,
      location
    });

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
        clientId: userId,
        status: 'OPEN', // Explicitly set status
        isActive: true,
        proposals: 0,
        scheduledAt: startDate ? new Date(startDate).toISOString() : null,
        peopleNeeded: peopleNeeded || 1,
        notes: null,
      },
    })

    // Create notification for job posting
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Job Posted Successfully',
        message: `Your job "${title}" is now live and visible to freelancers.`,
        type: 'SYSTEM_UPDATE',
        entityId: job.id,
        entityType: 'job',
        actionUrl: `/client/jobs/${job.id}`,
      }
    })

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
