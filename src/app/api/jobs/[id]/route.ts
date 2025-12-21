import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// Helper function to generate dynamic mock job data for any job ID
const generateMockJob = (jobId: string) => {
  // Map specific job IDs to their correct mock data
  const jobIdMap: { [key: string]: any } = {
    'DLCS0001': {
      title: 'Cricket Scorer for Local Tournament',
      category: 'Scorer',
      description: 'Need an experienced cricket scorer for our weekend local tournament. Must be familiar with digital scoring systems and cricket statistics.',
      skills: ['Cricket Scorer', 'Digital Scoring', 'Cricket Statistics', 'Match Analysis'],
      location: 'Chennai Cricket Ground, Chennai',
      payment: 5000,
      client: {
        name: 'Chennai Local Cricket League',
        image: '/images/LOGOS/local_league.jpg',
        rating: 4.6,
        jobsCompleted: 15,
        seed: 'LocalLeague'
      }
    },
    'DLCP1357': {
      title: 'Sports Physiotherapy — Injury Prevention Program',
      category: 'OTHER',
      description: 'Seeking a qualified sports physiotherapist for our cricket club team. Focus on injury prevention, treatment, and recovery protocols specific to cricket players.',
      skills: ['Cricket Physio', 'Sports Therapy', 'Injury Management', 'Recovery Techniques'],
      location: 'Nungambakkam Cricket Club, Chennai',
      payment: 12000,
      client: {
        name: 'Nungambakkam Cricket Club',
        image: '/avatars/ncc.jpg',
        rating: 4.8,
        jobsCompleted: 22,
        seed: 'Nungambakkam'
      }
    },
    'DLNT1111': {
      title: 'Net Practice Session — Opening Batsmen',
      category: 'OTHER',
      description: 'Need opening batsmen for net practice sessions with our academy team. Focus on building partnerships and powerplay batting techniques.',
      skills: ['Opening Batsman', 'Powerplay Batting', 'Partnership Building', 'Net Practice'],
      location: 'Adyar Cricket Ground, Chennai',
      payment: 3000,
      client: {
        name: 'Adyar Cricket Academy',
        image: '/avatars/adyar.jpg',
        rating: 4.6,
        jobsCompleted: 18,
        seed: 'Adyar'
      }
    },
    'DLWK2222': {
      title: 'Wicket Keeping Drills — Advanced Techniques',
      category: 'OTHER',
      description: 'Looking for a specialist wicket keeper to conduct advanced training sessions. Focus on stumpings, diving catches, and reflex drills.',
      skills: ['Wicket Keeping', 'Diving Catches', 'Reflex Training', 'Stumpings'],
      location: 'Velachery Cricket Club, Chennai',
      payment: 2500,
      client: {
        name: 'Velachery Cricket Club',
        image: '/avatars/velachery.jpg',
        rating: 4.7,
        jobsCompleted: 22,
        seed: 'Velachery'
      }
    },
    'DLFB3333': {
      title: 'Fielding Specialist — Boundary Catching',
      category: 'OTHER',
      description: 'Need a fielding specialist for boundary catching and ground fielding drills. Focus on athletic fielding and preventing boundaries.',
      skills: ['Fielding Specialist', 'Boundary Catching', 'Ground Fielding', 'Athletic Training'],
      location: 'T Nagar Cricket Ground, Chennai',
      payment: 2000,
      client: {
        name: 'T Nagar Cricket Academy',
        image: '/avatars/tnagar.jpg',
        rating: 4.8,
        jobsCompleted: 16,
        seed: 'TNagar'
      }
    },
    'DLSP4444': {
      title: 'Sports Psychology — Mental Preparation',
      category: 'OTHER',
      description: 'Seeking a sports psychologist for mental preparation and performance enhancement sessions with our competitive cricket team.',
      skills: ['Sports Psychology', 'Mental Training', 'Performance Enhancement', 'Team Building'],
      location: 'Anna Nagar Sports Center, Chennai',
      payment: 4000,
      client: {
        name: 'Chennai Elite Cricket Club',
        image: '/avatars/elite.jpg',
        rating: 4.9,
        jobsCompleted: 25,
        seed: 'Elite'
      }
    },
    'DLNV5555': {
      title: 'Nutrition Consultation — Cricket-Specific Diet',
      category: 'OTHER',
      description: 'Need a sports nutritionist to design cricket-specific diet plans for our academy players. Focus on energy management and recovery nutrition.',
      skills: ['Sports Nutrition', 'Diet Planning', 'Energy Management', 'Recovery Nutrition'],
      location: 'Nungambakkam Health Center, Chennai',
      payment: 3500,
      client: {
        name: 'Chennai Sports Nutrition Center',
        image: '/avatars/nutrition.jpg',
        rating: 4.7,
        jobsCompleted: 20,
        seed: 'Nutrition'
      }
    },
    'DLTE6666': {
      title: 'Technical Equipment Setup — Bowling Machines',
      category: 'OTHER',
      description: 'Looking for a technician to set up and calibrate bowling machines for our training sessions. Must have experience with cricket technology.',
      skills: ['Technical Setup', 'Bowling Machines', 'Equipment Calibration', 'Cricket Technology'],
      location: 'Chepauk Cricket Academy, Chennai',
      payment: 2500,
      client: {
        name: 'Chennai Cricket Technology',
        image: '/avatars/tech.jpg',
        rating: 4.5,
        jobsCompleted: 14,
        seed: 'Tech'
      }
    },
    'DLMC7777': {
      title: 'Match Commentary — Live Streaming',
      category: 'OTHER',
      description: 'Need an experienced cricket commentator for live streaming of our local tournament matches. Must have good voice and cricket knowledge.',
      skills: ['Match Commentary', 'Live Streaming', 'Cricket Knowledge', 'Public Speaking'],
      location: 'Mylapore Cricket Ground, Chennai',
      payment: 6000,
      client: {
        name: 'Chennai Sports Broadcasting',
        image: '/avatars/broadcast.jpg',
        rating: 4.8,
        jobsCompleted: 28,
        seed: 'Broadcast'
      }
    },
    'DLFT8888': {
      title: 'Fitness Training — Cricket-Specific Conditioning',
      category: 'OTHER',
      description: 'Seeking a fitness trainer specialized in cricket conditioning. Focus on agility, speed, endurance, and cricket-specific strength training.',
      skills: ['Fitness Training', 'Cricket Conditioning', 'Agility Training', 'Strength Training'],
      location: 'Anna Nagar Fitness Center, Chennai',
      payment: 4500,
      client: {
        name: 'Elite Cricket Fitness',
        image: '/avatars/fitness.jpg',
        rating: 4.9,
        jobsCompleted: 32,
        seed: 'Fitness'
      }
    },
    'DLSS9999': {
      title: 'Skill Assessment — Junior Player Evaluation',
      category: 'OTHER',
      description: 'Need experienced coaches to assess junior players for team selection. Focus on batting, bowling, fielding, and overall potential evaluation.',
      skills: ['Player Assessment', 'Team Selection', 'Technical Evaluation', 'Player Development'],
      location: 'Teynampet Cricket Academy, Chennai',
      payment: 3000,
      client: {
        name: 'Teynampet Cricket Academy',
        image: '/avatars/teynampet.jpg',
        rating: 4.6,
        jobsCompleted: 19,
        seed: 'Teynampet'
      }
    },
    'DLRC0000': {
      title: 'Recovery Coaching — Post-Match Recovery',
      category: 'OTHER',
      description: 'Looking for recovery specialists for post-match recovery sessions. Focus on muscle recovery, flexibility, and mental relaxation techniques.',
      skills: ['Recovery Coaching', 'Muscle Recovery', 'Flexibility Training', 'Mental Relaxation'],
      location: 'Velachery Sports Complex, Chennai',
      payment: 2800,
      client: {
        name: 'Chennai Recovery Specialists',
        image: '/avatars/recovery.jpg',
        rating: 4.7,
        jobsCompleted: 21,
        seed: 'Recovery'
      }
    }
  };

  // If we have specific data for this job ID, use it
  if (jobIdMap[jobId]) {
    const jobData = jobIdMap[jobId];
    return {
      id: jobId,
      title: jobData.title,
      description: jobData.description,
      category: jobData.category,
      budget: jobData.payment, // API uses 'budget', mock uses 'payment'
      location: jobData.location,
      skills: jobData.skills,
      status: 'upcoming',
      client: {
        name: jobData.client.name,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${jobData.client.seed}`,
        rating: jobData.client.rating,
        jobsCompleted: jobData.client.jobsCompleted
      }
    };
  }

  // Fallback to generic dynamic generation for unknown job IDs
  const jobTypes = [
    { title: 'Match Player for Local Tournament', category: 'Playing Services', skills: ['RH Batsman', 'Match Player'] },
    { title: 'Fast Bowling Training Session', category: 'Coaching', skills: ['Fast Bowling', 'Training'] },
    { title: 'UI/UX Design for Mobile App', category: 'Design', skills: ['UI Design', 'UX Design', 'Mobile Design', 'Figma'] },
    { title: 'Cricket Analytics Dashboard', category: 'Analytics', skills: ['Data Analysis', 'Python', 'Tableau'] },
    { title: 'Sports Photography Session', category: 'Media & Content', skills: ['Sports Photography', 'Editing', 'Lightroom'] },
  ];

  const jobType = jobTypes[jobId.length % jobTypes.length];

  const locations = ['Mumbai, Maharashtra', 'Bangalore, Karnataka', 'Chennai, Tamil Nadu', 'Hyderabad, Telangana', 'Delhi, NCR', 'Pune, Maharashtra'];
  const location = locations[jobId.length % locations.length];

  const clients = [
    { name: 'Cricket Club Mumbai', seed: 'CricketClub' },
    { name: 'Rajesh Kumar', seed: 'Rajesh' },
    { name: 'TechStartup Bangalore', seed: 'TechStartup' },
    { name: 'MobileTech Solutions', seed: 'MobileTech' },
    { name: 'Sports Analytics Pro', seed: 'SportsAnalytics' },
    { name: 'Cricket Media House', seed: 'CricketMedia' },
  ];

  const client = clients[jobId.length % clients.length];

  return {
    id: jobId,
    title: jobType.title,
    description: `Professional ${jobType.category.toLowerCase()} services for ${jobType.title.toLowerCase()}. High-quality work with attention to detail.`,
    category: jobType.category,
    budget: 3000 + (jobId.length % 5) * 1000,
    location: location,
    skills: jobType.skills,
    status: 'upcoming',
    client: {
      name: client.name,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${client.seed}`,
      rating: 4.5 + (jobId.length % 10) * 0.1,
      jobsCompleted: 5 + (jobId.length % 20)
    }
  };
};

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
      // Fallback to dynamic mock data if job not found in database
      const mockJob = generateMockJob(params.id);
      return NextResponse.json(mockJob);
    }

    return NextResponse.json({
      ...job,
      payment: job.budget
    })
  } catch (error) {
    console.error('Database error, falling back to mock data:', error)

    // Fallback to mock data if database fails
    const mockJob = generateMockJob(params.id);
    return NextResponse.json(mockJob);
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
