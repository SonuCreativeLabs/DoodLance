
import { PrismaClient, Prisma } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Use DIRECT_URL for the script to avoid pgbouncer issues with prepared statements or transaction modes
// if they are causing the connection errors.
const datasourceUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    datasources: {
        db: {
            url: datasourceUrl,
        },
    },
});

async function main() {
    try {
        console.log('[Backfill] Starting review backfill process...');

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
            }
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

        console.log('--------------------------------------------------');
        console.log('Backfill Summary:');
        console.log(`Total Scanned: ${bookings.length}`);
        console.log(`Reviews Created: ${createdCount}`);
        console.log(`Errors: ${errors.length}`);
        if (errors.length > 0) {
            console.log('Errors:', JSON.stringify(errors, null, 2));
        }
        console.log('--------------------------------------------------');

    } catch (error: any) {
        console.error('[Backfill] Critical error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
