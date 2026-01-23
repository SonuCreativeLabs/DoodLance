import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        console.log('📊 [Admin Referrals] Starting API call');

        // Skip auth check for now - admin routes handled by middleware
        // const supabase = createClient();
        // let { data: { user }, error: authError } = await supabase.auth.getUser();

        // Fetch all users who have a referral code or have referred others
        const referrers = await prisma.user.findMany({
            where: {
                OR: [
                    { referralCode: { not: null } },
                    { referredBy: { not: null } }
                ]
            },
            select: {
                id: true,
                name: true,
                email: true,
                referralCode: true,
                referredBy: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        // To get "Total Referrals" for each user, we need to aggregate
        // Group users by `referredBy`
        const referralCounts = await prisma.user.groupBy({
            by: ['referredBy'],
            _count: {
                referredBy: true
            },
            where: {
                referredBy: { not: null }
            }
        });

        // Map counts to a lookup object
        const countMap: Record<string, number> = {};
        referralCounts.forEach(item => {
            if (item.referredBy) countMap[item.referredBy] = item._count.referredBy;
        });

        // Transform data for UI
        const data = referrers.map(u => ({
            id: u.id,
            name: u.name || 'Unknown',
            email: u.email,
            referralCode: u.referralCode || 'N/A',
            referredBy: u.referredBy || '-',
            referralCount: u.referralCode ? (countMap[u.referralCode] || 0) : 0,
            totalEarningsCoins: (u.referralCode ? (countMap[u.referralCode] || 0) : 0) * 100, // 100 coins per referral
            joinedAt: u.createdAt
        }));

        console.log(`📊 [Admin Referrals] Returning ${data.length} users`);
        return NextResponse.json(data);

    } catch (error) {
        console.error('Admin Referrals API Error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
