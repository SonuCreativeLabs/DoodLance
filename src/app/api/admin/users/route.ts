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
    const status = searchParams.get('status') || 'all'; // status in User might not strictly exist as enum, using simple logic
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

    // Role filter
    if (role !== 'all') {
      where.role = role;
    }

    // Status filter - Assuming 'suspended' status logic or field triggers it
    // Schema doesn't have 'status' field in User, only 'isActive' in Wallet or AdminUser.
    // For now we might skip status filter if field doesn't exist, or use internal logic.
    // Assuming no status field on User based on schema reading, ignoring status filter or mapped from something else.

    // Verification filter
    if (verification === 'verified') {
      where.isVerified = true;
    } else if (verification === 'unverified') {
      where.isVerified = false;
    }

    // Fetch users
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          freelancerProfile: true,
          clientProfile: true,
          _count: {
            select: {
              clientJobs: true, // Projects posted
              freelancerJobs: true, // Jobs taken (accepted)
            }
          }
          // We can't easily deep count completed bookings in one go without complex queries or relations
          // We'll rely on profile stats or basic counts
        }
      }),
      prisma.user.count({ where })
    ]);

    // Map to response format
    const mappedUsers = users.map(user => {
      // Determine effective status (active if no suspension logic found)
      const status = 'active';

      // Stats
      let completedJobs = 0;
      let totalEarnings = 0;
      let totalSpent = 0;
      let rating = 0;

      if (user.role === 'freelancer' && user.freelancerProfile) {
        completedJobs = user.freelancerProfile.completedJobs;
        totalEarnings = user.freelancerProfile.totalEarnings;
        rating = user.freelancerProfile.rating;
        // If profile stats are 0, maybe use relation counts as fallback if needed
        if (completedJobs === 0) completedJobs = user._count.freelancerJobs;
      } else if (user.role === 'client' && user.clientProfile) {
        totalSpent = user.clientProfile.totalSpent;
        // projectsPosted can come from profile or relation count
        // user.clientProfile.projectsPosted might be more accurate if updated
      }

      return {
        id: user.id,
        name: user.name || 'Unknown',
        email: user.email,
        phone: user.phone || 'N/A',
        role: user.role,
        currentRole: user.currentRole,
        location: user.location || 'Unknown',
        isVerified: user.isVerified,
        rating: rating,
        completedJobs: completedJobs,
        totalEarnings: totalEarnings,
        totalSpent: totalSpent,
        projectsPosted: user._count.clientJobs,
        joinedAt: user.createdAt.toISOString().split('T')[0],
        lastActive: 'Recently', // We don't track last active strictly in this schema yet (AdminUser has lastLogin)
        status: status,
        avatar: user.avatar,
        services: user.freelancerProfile?.specializations ? user.freelancerProfile.specializations.split(',') : [],
      };
    });

    return NextResponse.json({
      users: mappedUsers,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
