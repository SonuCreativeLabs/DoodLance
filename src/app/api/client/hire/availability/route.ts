import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const freelancerId = searchParams.get('freelancerId');

        if (!freelancerId) {
            return NextResponse.json({ error: 'Freelancer ID is required' }, { status: 400 });
        }

        console.log(`[Avail API] Fetching for ${freelancerId}`);

        // 1. Fetch Freelancer Availability Settings (Working Hours)
        // Try finding by ID (CUID) first, then by userId (UUID)
        let profile = await prisma.freelancerProfile.findUnique({
            where: { id: freelancerId },
            select: { id: true, userId: true, availability: true, listings: true }
        });

        if (!profile) {
            console.log(`[Avail API] Not found by ID, trying userId`);
            profile = await prisma.freelancerProfile.findUnique({
                where: { userId: freelancerId },
                select: { id: true, userId: true, availability: true, listings: true }
            });
        }

        if (!profile) {
            console.log(`[Avail API] Profile not found`);
            return NextResponse.json({ error: 'Freelancer profile not found' }, { status: 404 });
        }

        console.log(`[Avail API] Found profile: ${profile.id}, UserID: ${profile.userId}`);

        // 2. Fetch Confirmed/Pending Bookings for this freelancer
        // We want to fetch bookings from "today" onwards
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const bookings = await prisma.booking.findMany({
            where: {
                // Bookings are linked to services, which are linked to the Provider's USER ID
                service: {
                    providerId: profile.userId
                },
                scheduledAt: {
                    gte: today
                },
                status: {
                    in: ['confirmed', 'pending'] // Block both
                }
            },
            select: {
                scheduledAt: true,
                duration: true
            }
        });

        // Format dates as ISO strings
        const bookedSlots = bookings
            .filter(b => b.scheduledAt) // Ensure scheduledAt is not null
            .map(b => ({
                start: b.scheduledAt,
                duration: b.duration || 60, // default 60 mins
                end: new Date(new Date(b.scheduledAt!).getTime() + (b.duration || 60) * 60000)
            }));

        let availabilityData = profile.availability || [];
        if (typeof availabilityData === 'string') {
            try {
                availabilityData = JSON.parse(availabilityData);
            } catch (e) {
                console.error('Failed to parse availability JSON', e);
                availabilityData = [];
            }
        }

        // Parse paused dates from listings field
        let pausedDates: string[] = [];
        try {
            const listings = profile.listings ? JSON.parse(profile.listings) : {};
            pausedDates = listings.pausedDates || [];
        } catch (error) {
            console.error('Error parsing paused dates:', error);
            pausedDates = [];
        }

        return NextResponse.json({
            availability: availabilityData,
            bookedSlots: bookedSlots,
            pausedDates: pausedDates
        });

    } catch (error: any) {
        console.error('Failed to fetch availability:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
