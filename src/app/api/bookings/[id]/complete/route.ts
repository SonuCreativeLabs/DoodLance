import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';



export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient();
        let { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { rating, review, feedbackChips } = body;

        // Verify booking and ownership
        const booking = await prisma.booking.findUnique({
            where: { id: params.id },
            include: {
                service: {
                    include: {
                        provider: true // Need provider info for notifications
                    }
                },
                client: true
            }
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Allow Provider (Freelancer) OR Client to complete
        // Usually Freelancer triggers this endpoint
        const isFreelancer = booking.service.providerId === user.id;
        const isClient = booking.clientId === user.id;

        if (!isFreelancer && !isClient) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        let newStatus = '';
        const updateData: any = {};

        // Normalize status for comparison (database might have uppercase or lowercase)
        const currentStatus = (booking.status || '').toUpperCase();
        console.log('[Complete API] Current booking status:', booking.status, '→ normalized:', currentStatus);
        console.log('[Complete API] User role:', { isClient, isFreelancer });

        // --- LOGIC START ---
        if (isClient) {
            // Client is completing
            // Check if Freelancer has already marked it complete by checking the booking status
            const hasFreelancerCompleted = currentStatus === 'COMPLETED_BY_FREELANCER';
            console.log('[Complete API] Client completing. Freelancer already completed?', hasFreelancerCompleted);

            // Save Client's Rating (Rating FROM Client TO Freelancer)
            updateData.freelancerRating = {
                stars: rating,
                review: review,
                feedbackChips: feedbackChips,
                createdAt: new Date()
            };

            if (hasFreelancerCompleted) {
                // Both parties have now completed
                newStatus = 'COMPLETED';
                console.log('[Complete API] Both completed! Setting status to COMPLETED');
            } else {
                // Only client has completed, waiting for freelancer
                newStatus = 'COMPLETED_BY_CLIENT';
                console.log('[Complete API] Only client completed. Setting status to COMPLETED_BY_CLIENT');
            }

        } else if (isFreelancer) {
            // Freelancer is completing
            // Check if Client has already marked it complete by checking the booking status
            const hasClientCompleted = currentStatus === 'COMPLETED_BY_CLIENT';
            console.log('[Complete API] Freelancer completing. Client already completed?', hasClientCompleted);

            // Save Freelancer's Rating (Rating FROM Freelancer TO Client)
            updateData.clientRating = {
                stars: rating,
                review: review,
                feedbackChips: feedbackChips,
                createdAt: new Date()
            };

            if (hasClientCompleted) {
                // Both parties have now completed
                newStatus = 'COMPLETED';
                console.log('[Complete API] Both completed! Setting status to COMPLETED');
            } else {
                // Only freelancer has completed, waiting for client
                newStatus = 'COMPLETED_BY_FREELANCER';
                console.log('[Complete API] Only freelancer completed. Setting status to COMPLETED_BY_FREELANCER');
            }
        }

        // Ensure status is UPPERCASE (database convention)
        updateData.status = newStatus; // newStatus is already UPPERCASE from above logic
        console.log('[Complete API] Final status to save:', newStatus);

        if (newStatus === 'COMPLETED') {
            updateData.deliveredAt = new Date();
            // Ensure payment status is updated if needed?
        }

        // Update booking
        const updatedBooking = await prisma.booking.update({
            where: { id: params.id },
            data: updateData
        });


        // --- NOTIFICATIONS ---

        // 1. If FULLY COMPLETED
        if (newStatus === 'COMPLETED') {
            const { sendBookingNotification } = await import('@/lib/email');

            // Notify CLIENT
            await sendBookingNotification(
                booking.client.email,
                'client',
                `Booking Completed: ${booking.service.title}`,
                `<p>The booking <strong>${booking.service.title}</strong> is now fully completed. Both parties have submitted reviews.</p>`
            );

            // Notify FREELANCER
            await sendBookingNotification(
                booking.service.provider.email, // Need provider email
                'freelancer',
                `Booking Completed: ${booking.service.title}`,
                `<p>The booking <strong>${booking.service.title}</strong> is now fully completed.</p>`
            );

            // Handle Rewards / Wallet Logic here if needed (e.g., release funds, referral rewards)
            // (Reusing existing logic if available or relying on separate trigger)

        }
        // 2. If INTERMEDIATE STATUS (Partial Complete)
        else {
            const { sendBookingNotification } = await import('@/lib/email');

            if (newStatus === 'COMPLETED_BY_CLIENT') {
                // Notify Freelancer that Client is waiting
                await sendBookingNotification(
                    booking.service.provider.email,
                    'freelancer',
                    `Action Required: Client marked ${booking.service.title} as complete`,
                    `<p>The client has marked the job <strong>${booking.service.title}</strong> as complete.</p><p>Please log in and mark it as complete from your side to finalize the booking.</p>`
                );
            } else if (newStatus === 'COMPLETED_BY_FREELANCER') {
                // Notify Client that Freelancer is waiting
                await sendBookingNotification(
                    booking.client.email,
                    'client',
                    `Action Required: Coach marked ${booking.service.title} as complete`,
                    `<p>The coach has marked the job <strong>${booking.service.title}</strong> as complete.</p><p>Please log in and mark it as complete from your side to finalize the booking.</p>`
                );
            }
        }

        return NextResponse.json({
            success: true,
            booking: updatedBooking,
            status: updatedBooking.status // Include status at root for easy access
        });

    } catch (error) {
        console.error('Complete booking error:', error);
        return NextResponse.json({ error: 'Failed to complete booking' }, { status: 500 });
    }
}

