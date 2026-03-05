import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

const safeParse = (data: any, fallback: any = []) => {
  if (!data) return fallback;
  if (typeof data === 'object') return data;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.warn('[API] JSON Parse failure:', data);
    return fallback;
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log('[API] Fetching freelancer detail for ID:', id);

    // Try finding by Profile ID first
    let profile = await prisma.freelancerProfile.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            services: {
              where: { isActive: true },
              include: {
                category: {
                  select: { name: true }
                }
              },
              orderBy: { createdAt: 'desc' }
            }
          }
        },
        reviews: {
          orderBy: { createdAt: 'desc' }
        },
        achievements: {
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
              services: {
                where: { isActive: true },
                include: {
                  category: {
                    select: { name: true }
                  }
                },
                orderBy: { createdAt: 'desc' }
              }
            }
          },
          reviews: {
            orderBy: { createdAt: 'desc' }
          },
          achievements: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    }

    // If still not found, try finding by Username
    if (!profile) {
      profile = await prisma.freelancerProfile.findFirst({
        where: {
          user: {
            username: {
              equals: id,
              mode: 'insensitive'
            }
          }
        },
        include: {
          user: {
            include: {
              services: {
                where: { isActive: true },
                include: {
                  category: {
                    select: { name: true }
                  }
                },
                orderBy: { createdAt: 'desc' }
              }
            }
          },
          reviews: {
            orderBy: { createdAt: 'desc' }
          },
          achievements: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    }

    if (!profile || !profile.user) {
      console.log('[API] Profile or User not found for ID:', id);
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    console.log('[API] Profile found:', profile.user.name, 'ID:', profile.id);

    // Transform to match expected format
    const formattedProfile = {
      id: profile.id,
      userId: profile.userId,
      name: profile.user.name,
      title: profile.title,
      about: profile.about,
      location: profile.user.location,
      area: (profile.user as any).area,
      city: profile.user.city,
      distance: 0,
      bio: profile.user.bio,
      avatar: profile.user.avatar,
      coverImage: profile.coverImage,
      dateOfBirth: (profile.user as any).dateOfBirth,
      phone: profile.user.phone,
      email: profile.user.email,
      hourlyRate: profile.hourlyRate,
      rating: profile.rating,
      reviewCount: profile.reviewCount,
      completedJobs: profile.completedJobs,
      responseTime: profile.responseTime,
      deliveryTime: profile.deliveryTime,
      skills: safeParse(profile.skills),
      cricketRole: profile.cricketRole,
      battingStyle: profile.battingStyle,
      bowlingStyle: profile.bowlingStyle,
      mainSport: profile.mainSport,
      otherSports: profile.otherSports,
      sportsDetails: profile.sportsDetails,
      languages: [], // profile.languages removed as it doesn't exist in schema
      isOnline: profile.isOnline,
      isVerified: profile.isVerified || profile.user.isVerified,
      username: profile.user.username,
      reviews: profile.reviews,
      achievements: profile.achievements,
      services: profile.user.services?.map((s: any) => ({
        ...s,
        features: safeParse(s.packages),
        videoUrls: s.videoUrl || []
      })) || [],
      availability: (() => {
        try {
          const parsed = profile.availability ? JSON.parse(profile.availability) : [];
          const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

          if (Array.isArray(parsed)) {
            return parsed.map((day: any, index: number) => ({
              ...day,
              // Setup day name if missing. If day is an object, use day.day, else use index
              day: day.day || weekDays[index] || '?',
              // Ensure available is boolean
              available: typeof day.available === 'boolean' ? day.available : !!day
            }));
          }
          return [];
        } catch (e) {
          console.error("Failed to parse availability JSON:", e);
          return [];
        }
      })()
    };

    return NextResponse.json({ profile: formattedProfile });

  } catch (error: any) {
    console.error('Freelancer detail fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch freelancer details: ' + error.message },
      { status: 500 }
    );
  }
}
