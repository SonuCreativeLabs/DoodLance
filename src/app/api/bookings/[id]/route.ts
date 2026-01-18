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
      service: booking.service?.title || 'Unknown Service',
      title: booking.service?.title || 'Unknown Service',
      provider: provider?.name || 'Unknown Provider',
      freelancer: {
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
      category: booking.service?.category?.name || "General",
      duration: (booking.duration || 60) + " mins",
      earnedMoney: `₹${booking.totalPrice}`,
      completedDate: (booking as any).deliveredAt
        ? new Date((booking as any).deliveredAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' })
        : (booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }) : ''),
      cancellationNotes: booking.notes || '',
      clientRating: booking.clientRating || null,
      yourRating: 0 // Schema has complex Json rating
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

    // Send Admin Notification for Status Changes
    if (status && (status.toUpperCase() === 'IN_PROGRESS' || status.toUpperCase() === 'COMPLETED')) {
      (async () => {
        try {
          // Fetch full details for email
          const fullBooking = await prisma.booking.findUnique({
            where: { id: params.id },
            include: {
              service: {
                include: { provider: true }
              },
              client: true
            }
          });

          if (!fullBooking) return;

          const { sendAdminNotification } = await import('@/lib/email');
          const clientName = fullBooking.client.name || fullBooking.client.email || 'Client';
          const freelancerName = fullBooking.service.provider.name || 'Freelancer';
          const serviceTitle = fullBooking.service.title;
          const price = (fullBooking.totalPrice || 0).toLocaleString('en-IN');

          let subject = '';
          let title = '';
          let message = '';

          if (status.toUpperCase() === 'IN_PROGRESS') {
            subject = `Booking Started: ${serviceTitle}`;
            title = 'Booking Started 🚀';
            message = `${clientName} has started the booking for ${serviceTitle}.`;
          } else {
            subject = `Booking Completed: ${serviceTitle}`;
            title = 'Booking Completed ✅';
            message = `${clientName} has completed the booking for ${serviceTitle}.`;
          }

          const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <h2 style="color: #6B46C1; text-align: center;">${title}</h2>
                <p style="color: #555; font-size: 16px;">${message}</p>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #333;">${serviceTitle}</h3>
                    <p style="margin: 5px 0;"><strong>Price:</strong> ₹${price}</p>
                    <p style="margin: 5px 0;"><strong>Status:</strong> ${status.toUpperCase()}</p>
                </div>

                <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                    <div style="flex: 1;">
                        <h4 style="border-bottom: 2px solid #6B46C1; padding-bottom: 5px;">Client</h4>
                        <p style="margin: 5px 0;"><strong>Name:</strong> ${clientName}</p>
                        <p style="margin: 5px 0;"><strong>Email:</strong> ${fullBooking.client.email}</p>
                    </div>
                    <div style="flex: 1;">
                        <h4 style="border-bottom: 2px solid #6B46C1; padding-bottom: 5px;">Freelancer</h4>
                        <p style="margin: 5px 0;"><strong>Name:</strong> ${freelancerName}</p>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                    <a href="https://bails.in/admin/bookings/${fullBooking.id}" style="background-color: #6B46C1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Booking</a>
                </div>
            </div>
          `;

          await sendAdminNotification(subject, message, htmlContent);
        } catch (emailErr) {
          console.error('Failed to send admin status notification:', emailErr);
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
