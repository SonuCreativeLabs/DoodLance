import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const profile = await prisma.freelancerProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            location: true,
            bio: true,
            phone: true,
            email: true,
          }
        },
        reviews: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        }
      }
    });

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
      reviews: profile.reviews
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
