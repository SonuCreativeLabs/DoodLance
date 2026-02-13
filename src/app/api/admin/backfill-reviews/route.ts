import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';
// import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    // const prisma = new PrismaClient(); // Reverting to global singleton
    try {
        console.log('[Backfill] Starting review backfill process...');

        // Debug: Test connection
        try {
            const userCount = await prisma.user.count();
            console.log('[Backfill] DB Connection Successful. User count:', userCount);
        } catch (connError: any) {
            console.error('[Backfill] DB Connection FAILED:', connError.message);
            throw new Error(`DB Connection Check Failed: ${connError.message}`);
        }

        // For security, only allow this in development or if user is admin
        // const supabase = createClient();
        // const { data: { user } } = await supabase.auth.getUser();

        // Allow if running locally (no auth check strictly enforced for this temp script) or if user is admin
        // For this specific debugging session, we'll proceed but log the user
        console.log('[Backfill] Triggered by user: ADMIN_OVERRIDE');

        // 1. Find all bookings that are completed and have a freelancer rating (Client -> Freelancer)
        const bookings = await prisma.booking.findMany({
            where: {
                // status: 'COMPLETED', // Or potentially COMPLETED_BY_CLIENT if we want to catch those too
                freelancerRating: {
                    not: Prisma.DbNull
                }
            },
            include: {
                client: true,
                service: {
                    include: {
                        provider: {
                            include: {
                                freelancerProfile: true
                            }
                        }
                    }
                }
            },
            take: 5 // Limit to 5 for debugging/testing to avoid timeouts
        });

        console.log(`[Backfill] Found ${bookings.length} bookings with ratings.`);

        let createdCount = 0;
        const errors = [];

        for (const booking of bookings) {
            // Check if profile exists
            if (!booking.service.provider.freelancerProfile) {
                console.warn(`[Backfill] Skipping booking ${booking.id}: No freelancer profile found.`);
                continue;
            }

            // Check if review already exists
            const existingReview = await prisma.review.findFirst({
                where: {
                    bookingId: booking.id
                }
            });

            if (existingReview) {
                // console.log(`[Backfill] Review already exists for booking ${booking.id}. Skipping.`);
                continue;
            }

            try {
                const ratingData = booking.freelancerRating as any;

                if (!ratingData || !ratingData.stars) {
                    console.warn(`[Backfill] Skipping booking ${booking.id}: Invalid rating data.`);
                    continue;
                }

                await prisma.review.create({
                    data: {
                        profileId: booking.service.provider.freelancerProfile.id,
                        clientId: booking.clientId,
                        clientName: booking.client.name || 'Client',
                        clientAvatar: booking.client.avatar,
                        rating: ratingData.stars,
                        comment: ratingData.review || '',
                        isVerified: true,
                        bookingId: booking.id,
                        createdAt: ratingData.createdAt ? new Date(ratingData.createdAt) : booking.updatedAt
                    }
                });
                createdCount++;
                console.log(`[Backfill] Created review for booking ${booking.id}`);

            } catch (err: any) {
                console.error(`[Backfill] Error processing booking ${booking.id}:`, err);
                errors.push({ id: booking.id, error: err.message });
            }
        }

        return NextResponse.json({
            success: true,
            totalBookingsScanned: bookings.length,
            reviewsCreated: createdCount,
            errors
        });

    } catch (error: any) {
        console.error('[Backfill] Critical error:', error);
        return NextResponse.json({ error: 'Backfill failed', details: error.message }, { status: 500 });
    }
}
