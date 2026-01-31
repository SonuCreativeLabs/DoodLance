import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/bookings/[id]
 * Get booking details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    let { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      // Fallback: Check for 'auth-token' (Legacy/JWT)
      const { cookies } = await import('next/headers');
      const cookieStore = cookies();
      const token = cookieStore.get('auth-token')?.value;

      if (token) {
        try {
          const { verifyAccessToken } = await import('@/lib/auth/jwt');
          const decoded = verifyAccessToken(token);
          if (decoded && decoded.userId) {
            const dbUser = await prisma.user.findUnique({
              where: { id: decoded.userId }
            });
            if (dbUser) {
              // Proceed as authenticated with this user
              user = { id: dbUser.id, role: dbUser.role || 'client', email: dbUser.email || '' } as any;
              // Fallback successful
            }
          }
        } catch (e) {
          console.warn('JWT Fallback failed in booking/[id]:', e);
        }
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        service: {
          include: {
            provider: {
              include: {
                freelancerProfile: true
              }
            },
            category: true
          }
        },
        client: true,
      }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Verify ownership
    const isClient = booking.clientId === user.id;
    const isFreelancer = booking.service.providerId === user.id;

    if (!isClient && !isFreelancer) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Map to frontend expected format
    const provider = booking.service?.provider;
    const profile = provider?.freelancerProfile;

    const mappedBooking = {
      "#": booking.id,
      serviceId: booking.serviceId, // Added serviceId for Book Again functionalit
      service: booking.service?.title || 'Unknown Service',
      title: booking.service?.title || 'Unknown Service',
      provider: provider?.name || 'Unknown Provider',
      freelancer: {
        id: provider?.id || '',
        name: provider?.name || 'Unknown',
        image: provider?.avatar || "/images/avatar-placeholder.png",
        rating: profile?.rating || 0,
        location: provider?.location || 'Remote',
        phone: provider?.phone || ''
      },
      image: provider?.avatar || "/images/avatar-placeholder.png",
      date: booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) : '',
      time: booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }) : '',
      status: booking.status.toLowerCase(),
      location: booking.location || "Remote",
      price: `₹${booking.totalPrice}`,
      totalPrice: booking.totalPrice,
      rating: 0, // Schema has complex Json rating, using placeholder
      review: (booking as any).review || '',
      completedJobs: profile?.completedJobs || 0,
      description: booking.service?.description || '',
      category: (() => {
        const cat = booking.service?.category?.name;
        console.log('Debugging Category for Booking:', booking.id, 'Service:', booking.service?.title, 'CategoryObj:', booking.service?.category, 'Resolved:', cat);
        return cat || "Freelancer";
      })(),
      duration: (booking.duration || 60) + " mins",
      earnedMoney: `₹${booking.totalPrice}`,
      completedDate: (booking as any).deliveredAt
        ? new Date((booking as any).deliveredAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' })
        : (booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }) : ''),
      cancellationNotes: booking.notes || '',
      clientRating: booking.clientRating || null,
      yourRating: booking.freelancerRating || null
    };
    return NextResponse.json(mappedBooking);

  } catch (error) {
    console.error('Fetch booking error ID:', params.id, error);
    return NextResponse.json({ error: 'Failed to fetch booking', details: String(error) }, { status: 500 });
  }
}

/**
 * PUT /api/bookings/[id]
 * Update booking status
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    let { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      // Fallback: Check for 'auth-token' (Legacy/JWT)
      const { cookies } = await import('next/headers');
      const cookieStore = cookies();
      const token = cookieStore.get('auth-token')?.value;

      if (token) {
        try {
          const { verifyAccessToken } = await import('@/lib/auth/jwt');
          const decoded = verifyAccessToken(token);
          if (decoded && decoded.userId) {
            const dbUser = await prisma.user.findUnique({
              where: { id: decoded.userId }
            });
            if (dbUser) {
              user = { id: dbUser.id, role: dbUser.role || 'client', email: dbUser.email || '' } as any;
            }
          }
        } catch (e) {
          console.warn('JWT Fallback failed in booking/[id] PUT:', e);
        }
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, notes, rating, review, scheduledAt } = body;

    // Validation
    if (!status && !scheduledAt && !notes && !rating && !review) {
      // Allow update if at least one field is present
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    /* 
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }
    */

    if (status === 'cancelled' && !notes?.trim()) {
      return NextResponse.json({ error: 'Cancellation notes are required' }, { status: 400 });
    }

    if (status === 'completed' && !review?.trim()) {
      return NextResponse.json({ error: 'Review is required for completion' }, { status: 400 });
    }

    // Verify existing booking and ownership
    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { service: true }
    });

    if (!existingBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const isClient = existingBooking.clientId === user.id;
    const isFreelancer = existingBooking.service.providerId === user.id;

    if (!isClient && !isFreelancer) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updateData: any = {};
    if (status) updateData.status = status.toUpperCase();
    if (notes) updateData.notes = notes;
    if (scheduledAt) updateData.scheduledAt = new Date(scheduledAt);
    if (rating) { /* handle rating logic if implemented in DB */ }
    // Review logic might be separate or here

    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: updateData
    });

    // REFERRAL REWARD LOGIC
    if (status && status.toUpperCase() === 'COMPLETED') {
      try {
        const bookingClient = await prisma.user.findUnique({
          where: { id: existingBooking.clientId }
        });

        if (bookingClient?.referredBy) {
          // Check if this is the FIRST completed booking for this client
          // We count bookings that are COMPLETED. Since we just updated the current one, the count should be 1 if it's the first.
          const completedCount = await prisma.booking.count({
            where: {
              clientId: bookingClient.id,
              status: 'COMPLETED'
            }
          });

          // If count is 1, it means this is the first one!
          if (completedCount === 1) {
            const referrer = await prisma.user.findUnique({
              where: { referralCode: bookingClient.referredBy }
            });

            if (referrer) {
              // Credit Referrer Wallet
              // Ensure wallet exists
              let wallet = await prisma.wallet.findUnique({ where: { userId: referrer.id } });
              if (!wallet) {
                wallet = await prisma.wallet.create({
                  data: { userId: referrer.id }
                });
              }

              // Update Wallet Coins
              await prisma.wallet.update({
                where: { id: wallet.id },
                data: {
                  coins: { increment: 500 }
                }
              });

              // Create Transaction Record
              await prisma.transaction.create({
                data: {
                  walletId: wallet.id,
                  amount: 500,
                  type: 'REFERRAL_REWARD',
                  description: `Referral reward for ${bookingClient.name || 'User'}'s first booking`,
                  status: 'COMPLETED',
                  paymentMethod: 'SYSTEM_COINS'
                }
              });

              console.log(`Referral reward credited to ${referrer.email} for client ${bookingClient.email}`);
            }
          }
        }
      } catch (refError) {
        console.error('Error processing referral reward:', refError);
        // Don't fail the request, just log error
      }
    }

    // Send Notification to Client + Admin (Copy)
    if (status && (status.toUpperCase() === 'IN_PROGRESS' || status.toUpperCase() === 'COMPLETED')) {
      (async () => {
        try {
          const { sendBookingNotification } = await import('@/lib/email');

          // Fetch full details
          const fullBooking = await prisma.booking.findUnique({
            where: { id: params.id },
            include: {
              service: { include: { provider: true } },
              client: true
            }
          });

          if (!fullBooking) return;

          const clientEmail = fullBooking.client.email;
          const freelancerName = fullBooking.service.provider.name || 'Freelancer';
          const serviceTitle = fullBooking.service.title;
          const newStatus = status.toUpperCase();

          let subject = '';
          let headline = '';
          let bodyText = '';
          let ctaText = 'View Booking';
          let ctaLink = `https://bails.in/client/bookings/${fullBooking.id}`;

          if (newStatus === 'IN_PROGRESS') {
            subject = `Job Started: ${serviceTitle}`;
            headline = 'Freelancer Started Work 🏁';
            bodyText = `<strong>${freelancerName}</strong> has arrived and started the job "<strong>${serviceTitle}</strong>".`;
          } else if (newStatus === 'COMPLETED') {
            subject = `Job Completed: ${serviceTitle}`;
            headline = 'Job Completed! 🎉';
            bodyText = `<strong>${freelancerName}</strong> has marked the job "<strong>${serviceTitle}</strong>" as completed.<br><br>Please verify and leave a review.`;
            ctaText = 'Leave a Review';
          }

          const price = (fullBooking.totalPrice || 0).toLocaleString('en-IN');
          const date = fullBooking.scheduledAt ? new Date(fullBooking.scheduledAt).toLocaleString('en-IN', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata'
          }) : 'Date TBD';
          const location = fullBooking.location || 'Remote';
          const duration = fullBooking.duration || 60;

          const htmlContent = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <div style="background-color: ${newStatus === 'COMPLETED' ? '#10B981' : '#3B82F6'}; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                    <h2 style="color: white; margin: 0;">${headline}</h2>
                </div>
                
                <div style="border: 1px solid #eee; border-top: none; borderRadius: 0 0 8px 8px; padding: 25px;">
                    <p style="font-size: 16px; margin-bottom: 20px;">
                        Hi <strong>${fullBooking.client.name}</strong>,
                    </p>
                    <p style="font-size: 16px; line-height: 1.5; color: #444;">
                        ${bodyText}
                    </p>

                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
                        <h3 style="margin-top: 0; color: #333; margin-bottom: 15px;">${serviceTitle}</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 5px 0; color: #666; width: 40%;">💰 Price:</td>
                                <td style="padding: 5px 0; font-weight: bold;">₹${price}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #666;">📅 Date:</td>
                                <td style="padding: 5px 0; font-weight: bold;">${date}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #666;">⏱ Duration:</td>
                                <td style="padding: 5px 0; font-weight: bold;">${duration} mins</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #666;">📍 Location:</td>
                                <td style="padding: 5px 0; font-weight: bold;">${location}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #666;">🆔 Booking ID:</td>
                                <td style="padding: 5px 0; font-family: monospace; color: #888;">${fullBooking.id}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${ctaLink}" 
                           style="background-color: ${newStatus === 'COMPLETED' ? '#10B981' : '#3B82F6'}; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                            ${ctaText}
                        </a>
                    </div>
                    
                    <p style="font-size: 13px; color: #999; text-align: center; margin-top: 30px;">
                        Need help? Contact <a href="mailto:sathishraj@doodlance.com" style="color: #666;">Support</a>
                    </p>
                </div>
            </div>
          `;

          await sendBookingNotification(clientEmail, 'client', subject, htmlContent);

        } catch (emailErr) {
          console.error('Failed to send status notification:', emailErr);
        }
      })();
    }

    return NextResponse.json({
      id: updatedBooking.id,
      status: updatedBooking.status,
      notes: updatedBooking.notes,
      rating,
      review,
      updatedAt: new Date().toISOString(),
      message: `Booking ${status} successfully`
    });

  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
