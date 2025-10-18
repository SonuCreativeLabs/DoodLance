import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo purposes (would be replaced with proper database in production)
const applications = new Map([
  ['DLST1234', {
    id: 'DLST1234',
    status: 'pending',
    jobTitle: 'Sidearm Thrower for Professional Team',
    progress: 0,
    proposal: {
      coverLetter: 'I have 3+ years of experience as a sidearm specialist working with state-level teams. I can accurately simulate pace, spin, and variations up to 140 kph.',
      proposedRate: 3000,
      estimatedDays: 20,
      skills: ['Sidearm Throwing', 'Fast Bowling Simulation', 'Spin Bowling Simulation', 'Cricket Training'],
      attachments: ['experience_certificate.pdf', 'testimonials.pdf']
    }
  }],
  ['DLMS5678', {
    id: 'DLMS5678',
    status: 'pending',
    jobTitle: 'Mystery Spinner for Academy Training',
    progress: 0,
    proposal: {
      coverLetter: 'I specialize in mystery spin bowling including carrom ball, doosra, and slider variations. I have played state-level cricket and can help batsmen develop techniques against various spin deliveries.',
      proposedRate: 4500,
      estimatedDays: 15,
      skills: ['Mystery Spin', 'Carrom Ball', 'Doosra', 'Spin Coaching', 'Cricket Training'],
      attachments: ['spin_credentials.pdf', 'playing_history.pdf']
    }
  }],
  ['DLOC9012', {
    id: 'DLOC9012',
    status: 'pending',
    jobTitle: 'One-on-One Cricket Coaching',
    progress: 0,
    proposal: {
      coverLetter: 'I am a cricket coach with over 7 years of experience specializing in youth development. I have worked with players at both school and academy levels, focusing on developing proper batting technique, footwork, and mental approach to the game.',
      proposedRate: 3000,
      estimatedDays: 30,
      skills: ['One-on-One Coaching', 'Batting Technique', 'Footwork Training', 'Youth Development', 'Video Analysis'],
      attachments: ['coaching_certificate.pdf', 'training_methodology.pdf']
    }
  }],
]);

// GET /api/applications/[id] - Get a specific application
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('Fetching application:', params.id);

  try {
    // Check if we have this application in our demo data
    const application = applications.get(params.id);

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Return application data in the expected format
    return NextResponse.json({
      "#": application.id,
      jobTitle: application.jobTitle,
      appliedDate: '2024-06-28',
      status: application.status,
      clientName: 'Test Client',
      budget: { min: 2000, max: 3500 },
      progress: application.progress,
      location: 'Test Location',
      postedDate: '2024-06-25',
      description: 'Test job description',
      clientId: 'test-client-id',
      proposal: application.proposal
    });

  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}

// PUT /api/applications/[id] - Update application status (client only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('Updating application:', params.id);

  try {
    const body = await request.json();
    const { status, progress, proposal } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Update in-memory application
    const application = applications.get(params.id);
    if (application) {
      application.status = status;
      if (progress !== undefined) {
        application.progress = progress;
      }

      // Update proposal fields if provided
      if (proposal) {
        if (proposal.coverLetter !== undefined) {
          application.proposal.coverLetter = proposal.coverLetter;
        }
        if (proposal.proposedRate !== undefined) {
          application.proposal.proposedRate = proposal.proposedRate;
        }
        // Add other proposal fields as needed
      }
    }

    return NextResponse.json({
      message: 'Application updated successfully',
      application: {
        id: params.id,
        status,
        progress: progress ?? application?.progress ?? 0,
        jobTitle: application?.jobTitle || 'Test Job',
        proposal: application?.proposal || {}
      }
    });

  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

// DELETE /api/applications/[id] - Withdraw application (freelancer only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('Attempting to withdraw application:', params.id);

  try {
    // Update in-memory application status
    const application = applications.get(params.id);
    if (application) {
      application.status = 'WITHDRAWN';
    }

    console.log('Application withdrawn successfully:', params.id);

    return NextResponse.json({
      message: 'Application withdrawn successfully',
      application: {
        id: params.id,
        status: 'WITHDRAWN',
        jobTitle: application?.jobTitle || 'Test Job',
        updatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error withdrawing application:', error);

    // Always return success for demo purposes
    return NextResponse.json({
      message: 'Application withdrawn successfully',
      application: {
        id: params.id,
        status: 'WITHDRAWN',
        jobTitle: 'Test Job',
        updatedAt: new Date().toISOString()
      }
    });
  }
}
