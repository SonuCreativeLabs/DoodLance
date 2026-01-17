import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || 'all';
    const status = searchParams.get('status') || 'all';
    const verification = searchParams.get('verification') || 'all';

    const skip = (page - 1) * limit;

    const where: any = {};

    // Search
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Role filter - complex because role logic is now derived
    if (role === 'freelancer') {
      where.freelancerProfile = { isNot: null };
    } else if (role === 'client') {
      where.OR = [
        { clientProfile: { isNot: null } },
        { role: 'client' } // Fallback for basic users
      ];
    }

    // Status filter
    if (status !== 'all') {
      where.status = status;
    }

    // Verification filter
    if (verification === 'verified') {
      where.isVerified = true;
    } else if (verification === 'unverified') {
      where.isVerified = false;
    }

    // Fetch users with profiles
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' }, // Order by recently active/updated
        include: {
          freelancerProfile: true,
          clientProfile: true,
          _count: {
            select: {
              clientJobs: true,
              freelancerJobs: true,
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    // Optimize: Fetch financial data separately to avoid "Can't reach DB" due to query complexity
    const userIds = users.map((u: any) => u.id);

    // 1. Calculate Total Spent (as Client) AND Count Orders
    // bookings where clientId IN userIds AND status = COMPLETED
    let clientSpentMap = new Map();
    let clientCountMap = new Map();
    if (userIds.length > 0) {
      const clientBookings = await prisma.booking.groupBy({
        by: ['clientId'],
        where: {
          clientId: { in: userIds },
          status: 'COMPLETED'
        },
        _sum: {
          totalPrice: true
        },
        _count: {
          _all: true
        }
      });
      clientBookings.forEach((b: any) => {
        clientSpentMap.set(b.clientId, b._sum.totalPrice || 0);
        clientCountMap.set(b.clientId, b._count._all || 0);
      });
    }

    // 2. Calculate Total Earnings (as Freelancer) AND Count Jobs
    // Fetch bookings for services provided by these users
    let freelancerEarningsMap = new Map();
    let freelancerJobCountMap = new Map();
    if (userIds.length > 0) {
      const freelancerBookings = await prisma.booking.findMany({
        where: {
          service: {
            providerId: { in: userIds }
          },
          status: 'COMPLETED'
        },
        select: {
          totalPrice: true,
          service: {
            select: { providerId: true }
          }
        }
      });
      freelancerBookings.forEach((b: any) => {
        const providerId = b.service.providerId;

        const currentEarnings = freelancerEarningsMap.get(providerId) || 0;
        freelancerEarningsMap.set(providerId, currentEarnings + (b.totalPrice || 0));

        const currentJobs = freelancerJobCountMap.get(providerId) || 0;
        freelancerJobCountMap.set(providerId, currentJobs + 1);
      });
    }

    // Map to response format
    const mappedUsers = users.map((user: any) => {
      // Determine Role
      const hasFreelancerProfile = !!user.freelancerProfile;
      const hasClientProfile = !!user.clientProfile;

      let derivedRole = user.role;
      if (hasFreelancerProfile && hasClientProfile) {
        derivedRole = 'both';
      } else if (hasFreelancerProfile) {
        derivedRole = 'freelancer';
      } else if (hasClientProfile) {
        derivedRole = 'client';
      }

      // Stats aggregation (Prefer aggregated values, fallback to profile)
      // Client Spent
      let totalSpent = 0;
      if (clientSpentMap.has(user.id)) {
        totalSpent = clientSpentMap.get(user.id);
      } else if (user.clientProfile?.totalSpent) {
        totalSpent = user.clientProfile.totalSpent;
      }

      // Freelancer Earnings
      let totalEarnings = 0;
      if (freelancerEarningsMap.has(user.id)) {
        totalEarnings = freelancerEarningsMap.get(user.id);
      } else if (user.freelancerProfile?.totalEarnings) {
        totalEarnings = user.freelancerProfile.totalEarnings;
      }

      let completedJobs = 0;
      let rating = 0;

      if (user.freelancerProfile) {
        // Use aggregated booking count if available, otherwise fallback
        if (freelancerJobCountMap.has(user.id)) {
          completedJobs = freelancerJobCountMap.get(user.id);
        } else {
          completedJobs = user.freelancerProfile.completedJobs || user._count.freelancerJobs;
        }
        rating = user.freelancerProfile.rating;
      }

      // Last Active: Use updatedAt or a specific field if you track logins
      const lastActiveDate = new Date(user.updatedAt);
      const formattedLastActive = lastActiveDate.toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Client Projects/Orders
      let projectsPosted = user._count.clientJobs || 0;
      if (clientCountMap.has(user.id)) {
        projectsPosted += clientCountMap.get(user.id);
      }

      return {
        id: user.id,
        name: user.name || 'Unknown',
        email: user.email,
        phone: user.phone || 'N/A',
        role: derivedRole, // 'client', 'freelancer', 'both'
        originalRole: user.role, // Keep track of DB role column if needed
        location: user.location || 'Unknown',
        isVerified: user.isVerified,
        rating: rating,
        completedJobs: completedJobs,
        totalEarnings: totalEarnings,
        totalSpent: totalSpent,
        projectsPosted: projectsPosted,
        joinedAt: user.createdAt.toISOString().split('T')[0],
        lastActive: formattedLastActive,
        status: user.status || 'active',
        avatar: user.avatar,
        referralCode: user.referralCode || 'N/A',
        referredBy: user.referredBy || 'N/A',
        services: user.freelancerProfile?.specializations ? user.freelancerProfile.specializations.split(',') : [],
      };
    });

    // Calculate Real Stats
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [statsTotalUsers, statsActiveUsers, statsVerifiedUsers, statsFreelancers] = await Promise.all([
      prisma.user.count(), // Total
      prisma.user.count({
        where: { updatedAt: { gte: thirtyDaysAgo } }
      }), // Active in last 30 days
      prisma.user.count({ where: { isVerified: true } }), // Verified
      prisma.freelancerProfile.count() // Freelancers (users with profile)
    ]);

    const stats = {
      totalUsers: statsTotalUsers,
      activeUsers: statsActiveUsers,
      verifiedUsers: statsVerifiedUsers,
      freelancers: statsFreelancers
    };

    return NextResponse.json({
      users: mappedUsers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats
    });

  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

import { createAdminClient } from '@/lib/supabase/admin';

// Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Create in Supabase Auth
    const supabase = createAdminClient();
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role }
    });

    if (authError) {
      console.error('Supabase Auth error:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user in Auth' },
        { status: 500 }
      );
    }

    // 2. Create in Prisma DB
    try {
      const newUser = await prisma.user.create({
        data: {
          id: authData.user.id,
          email: authData.user.email!,
          name,
          role,
          status: 'active',
          isVerified: true,
          coords: '0,0', // Default
        }
      });

      // 3. Create Profile based on role
      if (role === 'freelancer') {
        await prisma.freelancerProfile.create({
          data: {
            userId: newUser.id,
            title: 'New Freelancer',
            about: 'No bio yet',
            // experience: '0 years', // Removed as it is not in schema
            availability: 'Available',
            hourlyRate: 0,
            skills: '',
            specializations: '',
            coords: '0,0'
          }
        });
      } else if (role === 'client') {
        await prisma.clientProfile.create({
          data: {
            userId: newUser.id,
            company: 'N/A',
            industry: 'N/A',
            preferredSkills: ''
          }
        });
      }

      return NextResponse.json({
        success: true,
        user: newUser,
        message: 'User created successfully'
      });

    } catch (dbError) {
      // Rollback Auth if DB fails? 
      // Ideally yes, but for now just report error. Manual cleanup might be needed.
      console.error('Database creation error:', dbError);
      // Try to delete auth user to keep sync
      await supabase.auth.admin.deleteUser(authData.user.id);

      return NextResponse.json(
        { error: 'Failed to create user record in database' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
