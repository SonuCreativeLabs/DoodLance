import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'


export const dynamic = 'force-dynamic'

// GET /api/applications - Get applications (for freelancers or clients)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const jobId = searchParams.get('jobId')
    const status = searchParams.get('status')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const where: any = {}

    // If requesting user's applications
    if (searchParams.get('myApplications') === 'true') {
      where.freelancerId = userId
    }
    // If requesting applications for user's job posts
    else if (searchParams.get('myJobs') === 'true') {
      // Get all jobs by this user first
      const userJobs = await prisma.job.findMany({
        where: { clientId: userId },
        select: { id: true }
      })
      where.jobId = { in: userJobs.map((job: { id: string }) => job.id) }
    }

    if (jobId) where.jobId = jobId
    if (status) where.status = status

    const applications = await prisma.application.findMany({
      where,
      include: {
        job: {
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
        },
        freelancer: {
          select: {
            id: true,
            name: true,
            avatar: true,
            location: true,
            phone: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Parse string fields and structure for frontend
    const parsedApplications = applications.map((app: any) => ({
      ...app,
      "#": app.id, // Map ID to '#' for frontend table component compatibility
      jobTitle: app.job?.title || 'Unknown Job',
      category: app.job?.category || 'Other',
      location: app.job?.location || app.freelancer?.location || '',
      clientName: app.job?.client?.name || 'Unknown Client',
      clientImage: app.job?.client?.avatar || '',
      clientId: app.job?.clientId,
      description: app.job?.description || '',
      postedDate: app.job?.createdAt,
      appliedDate: app.createdAt,
      status: app.status.toLowerCase(), // Normalize status to lowercase
      budget: {
        min: app.job?.budgetMin || 0,
        max: app.job?.budgetMax || 0
      },
      skills: typeof app.skills === 'string' ? JSON.parse(app.skills) : (app.skills || []),
      attachments: typeof app.attachments === 'string' ? JSON.parse(app.attachments) : (app.attachments || []),

      // Add 'proposal' object alias providing backward compatibility
      proposal: {
        proposedRate: app.proposedRate,
        estimatedDays: app.estimatedDays,
        coverLetter: app.coverLetter,
        skills: typeof app.skills === 'string' ? JSON.parse(app.skills) : (app.skills || []),
        attachments: typeof app.attachments === 'string' ? JSON.parse(app.attachments) : (app.attachments || [])
      }
    }))

    return NextResponse.json(parsedApplications)
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

// POST /api/applications - Submit a job application (freelancers only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      jobId,
      coverLetter,
      proposedRate,
      estimatedDays,
      skills,
      attachments,
      freelancerId, // This should come from session in real app
    } = body

    // Validate required fields
    if (!jobId || !coverLetter || !proposedRate || !estimatedDays) {
      console.error('❌ Missing required fields:', {
        jobId: !!jobId,
        coverLetter: !!coverLetter,
        proposedRate: !!proposedRate,
        estimatedDays: !!estimatedDays,
        freelancerId: !!freelancerId
      })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Log incoming request for debugging
    console.log('📥 Application submission request:', {
      jobId,
      freelancerId,
      coverLetterLength: coverLetter?.length,
      proposedRate,
      estimatedDays,
      skillsCount: Array.isArray(skills) ? skills.length : 0,
      attachmentsCount: Array.isArray(attachments) ? attachments.length : 0
    })

    // Validate freelancerId exists
    if (!freelancerId) {
      console.error('❌ FreelancerId is missing from the request');
      return NextResponse.json(
        { error: 'Freelancer ID is required' },
        { status: 400 }
      );
    }

    // Check if job exists and is active
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, isActive: true, clientId: true }
    })

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found or no longer active' },
        { status: 404 }
      )
    }

    // Check if freelancer already applied
    let existingApplication;
    try {
      existingApplication = await prisma.application.findFirst({
        where: {
          jobId: jobId,
          freelancerId: freelancerId
        }
      });

      if (existingApplication) {
        return NextResponse.json(
          { error: 'You have already applied to this job' },
          { status: 400 }
        );
      }
    } catch (checkError) {
      console.warn('Failed to check existing application (non-fatal):', checkError);
    }

    // Generate hierarchical application ID using new format
    // Format: A{Category}{City}{Area}{JobSeq}{AppSeq} (e.g., APLCHVE001012)
    const { generateApplicationId } = await import('@/lib/id-utils');

    const applicationId = await generateApplicationId({ jobId });

    // Create the application with custom ID
    console.log('📝 Creating application with data:', {
      applicationId,
      jobId,
      freelancerId,
      coverLetter: coverLetter?.substring(0, 50),
      proposedRate,
      estimatedDays,
      skills,
      attachments
    });

    let application;
    try {
      application = await prisma.application.create({
        data: {
          id: applicationId,
          jobId,
          freelancerId,
          coverLetter,
          proposedRate: parseFloat(proposedRate),
          estimatedDays: parseInt(estimatedDays),
          skills: JSON.stringify(skills || []),
          attachments: JSON.stringify(attachments || []),
          status: 'PENDING',
        },
      });
      console.log('✅ Application created successfully:', application.id);
    } catch (createError) {
      console.error('❌ FATAL: Failed to create application in database:', createError);
      return NextResponse.json(
        {
          error: 'Failed to create application',
          details: createError instanceof Error ? createError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    // Get job and freelancer details for notifications
    const jobDetails = await prisma.job.findUnique({
      where: { id: jobId },
      select: { title: true, clientId: true }
    })

    const freelancerDetails = await prisma.user.findUnique({
      where: { id: freelancerId },
      select: { name: true }
    })

    // Use fallback values if job/freelancer not found in DB
    const freelancerName = freelancerDetails?.name || 'Freelancer';
    const jobTitle = jobDetails?.title || 'Job';
    const jobClientId = jobDetails?.clientId || 'unknown';

    // Update job proposal count (optional - don't fail if update fails)
    try {
      await prisma.job.update({
        where: { id: jobId },
        data: {
          proposals: { increment: 1 }
        }
      })
    } catch (updateError) {
      console.warn('Failed to update job proposal count (non-fatal):', updateError)
    }

    // Create notifications (optional - don't fail if notifications table doesn't exist)
    try {
      await prisma.notification.create({
        data: {
          userId: freelancerId,
          title: 'Application Submitted',
          message: `Your application for "${jobTitle}" has been submitted successfully`,
          type: 'JOB_APPLICATION',
          entityId: application.id,
          entityType: 'application',
          actionUrl: `/freelancer/applications/${application.id}`,
        }
      })

      await prisma.notification.create({
        data: {
          userId: jobClientId,
          title: 'New Job Application',
          message: `${freelancerName} has applied to your job "${jobTitle}"`,
          type: 'JOB_APPLICATION',
          entityId: application.id,
          entityType: 'application',
          actionUrl: `/client/applications/${application.id}`,
        }
      })
    } catch (notifError) {
      console.warn('Failed to create notifications (non-fatal):', notifError)
    }

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    console.error('[API ERROR] Failed to create application:', error);
    if (error instanceof Error) {
      console.error('[API ERROR] Message:', error.message);
      console.error('[API ERROR] Stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}
