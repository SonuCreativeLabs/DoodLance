import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET /api/freelancers/[id] - Get freelancer profile and services
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const freelancer = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        freelancerProfile: {
          include: {
            experiences: true,
            portfolios: true,
            reviews: {
              take: 5,
              orderBy: { createdAt: 'desc' }
            }
          }
        },
        services: {
          where: { isActive: true },
          include: {
            category: true
          },
          take: 10
        }
      }
    })

    if (!freelancer) {
      return NextResponse.json(
        { error: 'Freelancer not found' },
        { status: 404 }
      )
    }

    // Calculate average rating from reviews
    const avgRating = freelancer.freelancerProfile?.reviews?.length
      ? freelancer.freelancerProfile.reviews.reduce((acc: number, review: { rating: number }) => acc + review.rating, 0) / freelancer.freelancerProfile.reviews.length
      : 0

    return NextResponse.json({
      ...freelancer,
      averageRating: avgRating
    })
  } catch (error) {
    console.error('Error fetching freelancer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch freelancer' },
      { status: 500 }
    )
  }
}
