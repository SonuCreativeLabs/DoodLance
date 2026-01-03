import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Try finding by Profile ID first
    let profile = await prisma.freelancerProfile.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            services: true
          }
        },
        reviews: {
          // Relation name might be wrong in schema check.
          // Schema has `reviews Review[]`
          orderBy: { createdAt: 'desc' }
        },
        experiences: {
          orderBy: { startDate: 'desc' }
        },
        portfolios: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    // If not found, try finding by User ID (UserId)
    if (!profile) {
      profile = await prisma.freelancerProfile.findUnique({
        where: { userId: id },
        include: {
          user: {
            include: {
              services: true
            }
          },
          reviews: {
            orderBy: { createdAt: 'desc' }
          },
          experiences: {
            orderBy: { startDate: 'desc' }
          },
          portfolios: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    }

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Transform to match expected format
    const formattedProfile = {
      id: profile.id,
      userId: profile.userId,
      name: profile.user.name,
      title: profile.title,
      about: profile.about,
      location: profile.user.location,
      bio: profile.user.bio,
      avatar: profile.user.avatar,
      phone: profile.user.phone,
      email: profile.user.email,
      hourlyRate: profile.hourlyRate,
      rating: profile.rating,
      reviewCount: profile.reviewCount,
      completedJobs: profile.completedJobs,
      responseTime: profile.responseTime,
      deliveryTime: profile.deliveryTime,
      skills: typeof profile.skills === 'string' ? JSON.parse(profile.skills || '[]') : profile.skills,
      cricketRole: profile.cricketRole,
      battingStyle: profile.battingStyle,
      bowlingStyle: profile.bowlingStyle,
      languages: profile.languages,
      isOnline: profile.isOnline,
      isVerified: profile.isVerified,
      reviews: profile.reviews,
      experiences: profile.experiences,
      portfolios: profile.portfolios,
      services: profile.user.services,
      availability: (() => {
        try {
          return profile.availability ? JSON.parse(profile.availability) : [];
        } catch (e) {
          console.error("Failed to parse availability JSON:", e);
          return [];
        }
      })()
    };

    return NextResponse.json({ profile: formattedProfile });

  } catch (error) {
    console.error('Freelancer detail fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch freelancer details' },
      { status: 500 }
    );
  }
}
