import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// POST /api/user/set-referral - Set user's referredBy field
export async function POST(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { referralCode } = await request.json();

        if (!referralCode) {
            return NextResponse.json({ error: 'Referral code required' }, { status: 400 });
        }

        console.log(`🔗 Setting referral code for user ${user.id}: ${referralCode}`);

        // Check if user already has referredBy set
        const existing = await prisma.user.findUnique({
            where: { id: user.id },
            select: { referredBy: true }
        });

        if (existing?.referredBy) {
            console.log(`⚠️ User ${user.id} already has referredBy: ${existing.referredBy}`);
            return NextResponse.json({
                error: 'Referral code already set',
                existing: existing.referredBy
            }, { status: 400 });
        }

        // Verify referral code exists (case-insensitive)
        const referrer = await prisma.user.findFirst({
            where: {
                referralCode: {
                    equals: referralCode,
                    mode: 'insensitive'
                }
            }
        });

        if (!referrer) {
            console.log(`❌ Invalid referral code: ${referralCode}`);
            return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 });
        }

        // Update user with referredBy
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { referredBy: referralCode }
        });

        console.log(`✅ Successfully set referredBy for user ${user.id}`);

        return NextResponse.json({
            success: true,
            referredBy: updatedUser.referredBy
        });

    } catch (error) {
        console.error('Set referral error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
