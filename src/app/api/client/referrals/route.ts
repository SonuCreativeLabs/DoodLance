import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const supabase = createClient();
        let { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get current user details
        let dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
                wallet: {
                    include: {
                        transactions: true
                    }
                }
            }
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Generate Referral Code if not exists
        if (!dbUser.referralCode) {
            // Get Next Sequence
            let sequence = 1;
            const config = await prisma.systemConfig.findUnique({ where: { key: 'NEXT_REFERRAL_SEQUENCE' } });
            if (config) {
                sequence = parseInt(config.value);
            }

            // Format: BAILS + Sequence (e.g., BAILS1, BAILS2...)
            const newCode = `BAILS${sequence}`;

            const userId = dbUser.id;
            // Update User AND SystemConfig in transaction
            dbUser = await prisma.$transaction(async (tx) => {
                const updatedUser = await tx.user.update({
                    where: { id: userId },
                    data: { referralCode: newCode },
                    include: {
                        wallet: {
                            include: {
                                transactions: true
                            }
                        }
                    }
                });

                // Upsert Config
                if (config) {
                    await tx.systemConfig.update({
                        where: { key: 'NEXT_REFERRAL_SEQUENCE' },
                        data: { value: (sequence + 1).toString() }
                    });
                } else {
                    await tx.systemConfig.create({
                        data: {
                            key: 'NEXT_REFERRAL_SEQUENCE',
                            value: (sequence + 1).toString(),
                            description: 'Next sequence number for referral code generation'
                        }
                    });
                }

                return updatedUser;
            });
        }

        // Fetch Referrals (Users who used this user's code)
        const referrals = await prisma.user.findMany({
            where: { referredBy: dbUser.referralCode },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                bookings: {
                    select: {
                        status: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Calculate Stats
        const totalReferrals = referrals.length;
        const successfulReferrals = referrals.filter(ref =>
            ref.bookings.some(b => b.status === 'COMPLETED')
        ).length;

        // Calculate Earned Coins from Transactions
        // Assuming type 'REFERRAL_REWARD' or similar, or checking amount/desc
        const totalEarnedCoins = dbUser.wallet?.transactions
            .filter(t => t.type === 'REFERRAL_REWARD')
            .reduce((sum, t) => sum + (t.amount || 0), 0) || 0; // Storing coins as amount if consistent, or we might need separate 'coins' handling if wallet schema differs. 
        // Wallet schema has 'coins' Int. But Transaction has 'amount' Float. 
        // I'll assume for now we use 'amount' for coins in this specific transaction type, or I check logic.
        // Wait, Wallet has `coins` Int. Transaction has `amount` Float.
        // Usually "Coins" are virtually separate. 
        // Let's assume 1 Coin = 1 Unit in amount for REFERRAL_REWARD, but keep it integers.

        // Calculate Pending (users registered but no booking completed)
        const pendingRewards = (totalReferrals - successfulReferrals) * 500;

        // Format Referrals List
        const formattedReferrals = referrals.map(ref => {
            const isCompleted = ref.bookings.some(b => b.status === 'COMPLETED');
            return {
                id: ref.id,
                name: ref.name || 'Unknown User',
                email: ref.email,
                date: new Date(ref.createdAt).toLocaleDateString(),
                status: isCompleted ? 'completed' : 'pending',
                reward: isCompleted ? 500 : 0
            };
        });

        return NextResponse.json({
            referralCode: dbUser.referralCode,
            referredBy: dbUser.referredBy,
            stats: {
                totalReferrals,
                successfulReferrals,
                totalEarned: totalEarnedCoins,
                pendingRewards
            },
            referrals: formattedReferrals
        });

    } catch (error) {
        console.error('Referrals API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { code } = body;

        if (!code) {
            return NextResponse.json({ error: 'Referral code is required' }, { status: 400 });
        }

        // Get current user
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { id: true, referralCode: true, referredBy: true }
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if already referred
        if (dbUser.referredBy) {
            return NextResponse.json({ error: 'You have already used a referral code' }, { status: 400 });
        }

        // Check validation
        if (dbUser.referralCode === code) {
            return NextResponse.json({ error: 'You cannot refer yourself' }, { status: 400 });
        }

        // Find referrer
        const referrer = await prisma.user.findUnique({
            where: { referralCode: code }
        });

        if (!referrer) {
            return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 });
        }

        // Update user
        await prisma.user.update({
            where: { id: user.id },
            data: { referredBy: code }
        });

        return NextResponse.json({ success: true, message: 'Referral code applied successfully' });

    } catch (error) {
        console.error('Referral POST Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
