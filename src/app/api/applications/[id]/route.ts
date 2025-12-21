import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'


// GET /api/applications/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            client: true
          }
        },
        freelancer: true
      }
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error('Error fetching application:', error)
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    )
  }
}

// PATCH /api/applications/[id] - Update application
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    const { status, proposedRate, coverLetter, estimatedDays } = body

    const data: any = {}
    if (status) data.status = status // Ensure case matches (ACCEPTED vs accepted)
    if (proposedRate) data.proposedRate = parseFloat(proposedRate)
    if (coverLetter) data.coverLetter = coverLetter
    if (estimatedDays) data.estimatedDays = parseInt(estimatedDays)

    const application = await prisma.application.update({
      where: { id },
      data
    })

    return NextResponse.json(application)
  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}

// Backwards compatibility for PUT
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return PATCH(request, { params })
}
