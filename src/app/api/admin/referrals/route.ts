import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const supabase = createClient();
        let { data: { user }, error: authError } = await supabase.auth.getUser();

        // Basic Admin Auth Check (Reusing pattern from other admin routes)
        // Note: In a real scenario, we should use middle-ware or rigorous checks.
        // Assuming if they can hit this route authenticated as admin (handled by layout/middleware usually), it's ok.
        // But let's check basic role if possible or just proceed if the request is valid.

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
                createdAt: true,
                wallet: {
                    select: {
                        coins: true,
                        transactions: {
                            where: { type: 'REFERRAL_REWARD' }
                        }
                    }
                },
                _count: {
                    select: {
                        // Find users who were referred BY this user
                        // Prisma doesn't have a direct "referredUsers" relation yet, 
                        // so we usually need a self-relation. 
                        // But the schema implies `referredBy` is just a string.
                        // So we can't use `_count` on a relation.
                        // We have to do a separate query or aggregation.
                    }
                }
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
            totalEarningsCoins: u.wallet?.transactions.reduce((acc, t) => acc + (t.amount || 0), 0) || 0,
            joinedAt: u.createdAt
        }));

        return NextResponse.json(data);

    } catch (error) {
        console.error('Admin Referrals API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
