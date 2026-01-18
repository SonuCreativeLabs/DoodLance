import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/bookings
 * Fetch bookings for the authenticated user.
 * Supports query params:
 * - role: 'client' | 'freelancer' (defaults to checking both or inferred)
 * - status: filter by status
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            // Fallback: Check for 'auth-token' (Legacy/JWT)
            const cookieStore = cookies();
            const token = cookieStore.get('auth-token')?.value;

            if (token) {
                try {
                    const { verifyAccessToken } = await import('@/lib/auth/jwt');
                    const decoded = verifyAccessToken(token);
                    if (decoded && decoded.userId) {
                        // Valid JWT, manually verify user exists in DB to be safe
                        const dbUser = await prisma.user.findUnique({
                            where: { id: decoded.userId }
                        });
                        if (dbUser) {
                            // Proceed as authenticated with this user
                            // Re-assign 'user' variable for downstream logic
                            // We need to return the same shape as supabase.auth.getUser()
                            // But we can just override the logic below.
                            // Let's restart the flow with valid user.
                            return handleGetBookings(request, { id: dbUser.id, role: dbUser.role || 'client' } as any);
                        }
                    }
                } catch (e) {
                    console.warn('JWT Fallback failed:', e);
                }
            }
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Resolving DB User (CUID)
        let dbUser = await prisma.user.findUnique({ where: { supabaseUid: user.id } });
        if (!dbUser) dbUser = await prisma.user.findUnique({ where: { id: user.id } });

        if (!dbUser) {
            // Fallback: try email
            if (user.email) dbUser = await prisma.user.findUnique({ where: { email: user.email } });
        }

        if (!dbUser) {
            // If still not found, we can't fetch bookings for non-existent user
            return NextResponse.json({ bookings: [] });
        }

        // Use the resolved DB user
        return handleGetBookings(request, { ...user, id: dbUser.id });

    } catch (error) {
        console.error('Failed to fetch bookings:', error);
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
}

// Extracted handler to support both auth methods
async function handleGetBookings(request: NextRequest, user: { id: string, role?: string }) {
    try {
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role'); // optional explicit role filter
        const status = searchParams.get('status');

        const whereClause: any = {};
        if (status) whereClause.status = status;

        // Filter by user role in the booking
        // If role specified as 'client', filter where clientId = user.id
        // If 'freelancer', filter where service.providerId = user.id
        // If not specified, maybe fetch both? Or just use clientId for clients.

        if (role === 'freelancer') {
            // Freelancer view: bookings for services provided by this user
            whereClause.service = {
                providerId: user.id
            };
        } else {
            // Client view (default): bookings made BY this user
            whereClause.clientId = user.id;
        }

        const bookings = await prisma.booking.findMany({
            where: whereClause,
            include: {
                service: {
                    select: {
                        provider: {
                            select: {
                                name: true,
                                avatar: true,
                                id: true,
                                phone: true,
                            }
                        },
                        title: true,
                        tags: true, // Fetch tags for skills
                        providerId: true,
                    }
                },
                client: {
                    select: {
                        name: true,
                        avatar: true,
                        phone: true, // Added phone
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Format for frontend
        const formattedBookings = bookings.map((b: any) => ({
            id: b.id,
            title: b.service.title,
            clientName: b.client.name,
            clientPhone: b.client.phone, // Added clientPhone
            freelancerName: b.service.provider.name,
            freelancerId: b.service.provider.id,
            freelancerAvatar: b.service.provider.avatar,
            freelancerPhone: b.service.provider.phone,
            clientAvatar: b.client.avatar, // Added client avatar
            status: b.status,
            date: b.scheduledAt ? b.scheduledAt.toISOString() : null,
            time: b.scheduledAt ? b.scheduledAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : null, // Added time
            price: b.totalPrice,
            serviceId: b.serviceId,
            clientId: b.clientId,
            otp: b.otp,
            completedAt: b.deliveredAt ? b.deliveredAt.toISOString() : null,
            location: b.location, // Added location
            duration: b.duration, // Added duration
            notes: b.notes, // Added notes
            requirements: b.requirements, // Added requirements
            skills: b.service.tags ? b.service.tags.split(',').map((s: string) => s.trim()) : [], // Added skills from service tags
            services: b.services || [], // Return services list
        }));

        return NextResponse.json({ bookings: formattedBookings });

    } catch (error) {
        console.error('Failed to fetch bookings:', error);
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
}

/**
 * POST /api/bookings
 * Create a new booking
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = createClient()
        let { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            // Fallback: Check for 'auth-token' (Legacy/JWT)
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
                            // Re-assign 'user' variable for downstream logic
                            user = { id: dbUser.id, role: dbUser.role || 'client' } as any;
                            // Clear authError to allow proceeding
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            // authError = null; 
                            // We handled it, so we flow through.
                        } else {
                            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                        }
                    } else {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                    }
                } catch (e) {
                    console.warn('JWT Fallback failed:', e);
                    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }
            } else {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Resolving DB User (CUID) for POST
        let dbUser = await prisma.user.findUnique({ where: { supabaseUid: user.id } });
        if (!dbUser) dbUser = await prisma.user.findUnique({ where: { id: user.id } });

        if (!dbUser && user.email) dbUser = await prisma.user.findUnique({ where: { email: user.email } });

        if (!dbUser) {
            return NextResponse.json({ error: 'User profile not found. Please complete your profile.' }, { status: 400 });
        }

        const userId = dbUser.id;

        const body = await request.json();
        console.log('Booking POST Body:', body);
        const {
            serviceId,
            scheduledAt,
            packageType,
            requirements,
            location, // Extract location
            notes,
            otp,
            services = [], // Default to empty array
            couponCode // Extract couponCode
        } = body;

        if (!serviceId) {
            return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
        }

        // Fetch service validation & price
        const service = await prisma.service.findUnique({
            where: { id: serviceId }
        });

        if (!service) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        if (!service.isActive) {
            return NextResponse.json({ error: 'Service is not active' }, { status: 400 });
        }

        if (service.providerId === userId) {
            return NextResponse.json({ error: 'Cannot book your own service' }, { status: 400 });
        }

        // Calculate price
        let finalPrice = 0;

        // Calculate base total first
        let baseTotal = 0;
        if (body.services && body.services.length > 0) {
            // Calculate total from services array
            baseTotal = body.services.reduce((total: number, s: any) => {
                const price = typeof s.price === 'string'
                    ? parseFloat(s.price.replace(/[^\d.]/g, ''))
                    : s.price;
                return total + (price * (s.quantity || 1));
            }, 0);
        } else {
            // Fallback to single service price
            baseTotal = service.price;
        }

        // Apply Coupon if present
        let discountAmount = 0;
        let appliedPromoCodeId: string | null = null;
        let appliedPromoCodeCode: string | null = null;

        if (couponCode) {
            console.log(`Checking coupon: ${couponCode}`);
            const promo = await prisma.promoCode.findUnique({
                where: { code: couponCode }
            });

            if (promo) {
                // Validation Logic
                const now = new Date();
                const isValid =
                    promo.status === 'active' &&
                    (!promo.startDate || promo.startDate <= now) &&
                    (!promo.endDate || promo.endDate >= now) &&
                    (!promo.usageLimit || promo.usedCount < promo.usageLimit);

                if (isValid) {
                    // Check user limit if needed
                    if (promo.perUserLimit) {
                        const userUsage = await prisma.promoUsage.count({
                            where: {
                                promoCodeId: promo.id,
                                userId: userId
                            }
                        });
                        if (userUsage >= promo.perUserLimit) {
                            console.warn(`Coupon ${couponCode} usage limit reached for user ${userId}`);
                            // Treat as invalid or just ignore discount?
                            // Let's ignore discount but proceed with booking
                        } else {
                            // Valid
                            appliedPromoCodeId = promo.id;
                            appliedPromoCodeCode = promo.code;
                        }
                    } else {
                        // Valid (no user limit)
                        appliedPromoCodeId = promo.id;
                        appliedPromoCodeCode = promo.code;
                    }
                } else {
                    console.warn(`Coupon ${couponCode} is invalid or expired.`);
                }
            } else {
                console.warn(`Coupon ${couponCode} not found.`);
            }
        }

        if (appliedPromoCodeId && appliedPromoCodeCode) {
            const promo = await prisma.promoCode.findUnique({ where: { id: appliedPromoCodeId } });
            if (promo) {
                if (promo.discountType === 'PERCENTAGE') {
                    let calculatedDiscount = baseTotal * (promo.discountValue / 100);
                    if (promo.maxDiscount && calculatedDiscount > promo.maxDiscount) {
                        calculatedDiscount = promo.maxDiscount;
                    }
                    discountAmount = Math.round(calculatedDiscount);
                } else if (promo.discountType === 'FIXED') {
                    discountAmount = promo.discountValue;
                }
            }
        }

        // Subtract discount from base total BEFORE platform fee? or AFTER?
        // Usually platform fee is on the subtotal.
        // Let's assume Discount reduces the subtotal.
        const discountedSubtotal = Math.max(0, baseTotal - discountAmount);

        // Fetch platform commission settings
        const commissionConfig = await prisma.systemConfig.findUnique({
            where: { key: 'clientCommission' }
        });
        const commissionRate = commissionConfig ? parseFloat(commissionConfig.value) / 100 : 0.05;

        // Add platform fee (calculated on the discounted total or original? Usually original to protect platform revenue, but verified earlier flows suggested fee is added last. Let's assume fee is on discounted amount for better UX, or standard is on base. 
        // Standard in this app seems to be fee added on top.
        // Let's calc fee on discountedSubtotal to be nice, or baseTotal? 
        // Using baseTotal for fee protects revenue. 
        // Let's stick to baseTotal for fee calculation to match industry standards often, OR discountedSubtotal if we want to be generous.
        // Let's use discountedSubtotal for now as it makes "Total" match what user sees if they expect fee to scale.
        // Actually, earlier checkout page calc: `const total = Math.max(0, subtotal + serviceFee - discountAmount);`
        // Setup: Subtotal + Fee - Discount.
        // So Fee is based on Subtotal. Discount is subtracted from (Subtotal + Fee).

        finalPrice = baseTotal;
        const platformFee = Math.round(finalPrice * commissionRate);
        finalPrice += platformFee;
        finalPrice -= discountAmount;
        finalPrice = Math.max(0, finalPrice);

        const bookingData = {
            clientId: userId,
            serviceId: service.id,
            scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
            duration: service.duration,
            totalPrice: finalPrice,
            packageType: packageType || 'Standard',
            status: 'confirmed',
            location: location || service.location || '',
            coords: '',
            notes: notes || '',
            requirements: requirements || '',
            deliverables: '',
            otp: (body.otp as string) || Math.floor(1000 + Math.random() * 9000).toString(),
            services: body.services || [], // Save services JSON
            transactionId: body.transactionId || null,
            paymentStatus: body.paymentStatus || 'PENDING',
        };

        console.log('Attempting to create booking with data:', JSON.stringify({
            ...bookingData,
            clientId: userId, // Ensure we see the ID
            scheduledAt: bookingData.scheduledAt?.toString(),
            discountAmount,
            appliedCoupon: appliedPromoCodeCode
        }, null, 2));

        try {
            // Check if user exists in DB to prevent FK error if Supabase user exists but DB user doesn't
            const userExists = await prisma.user.findUnique({ where: { id: userId } });
            if (!userExists) {
                console.error(`User ${userId} not found in database (FK violation risk)`);
                return NextResponse.json({ error: 'User profile not found. Please complete your profile.' }, { status: 400 });
            }

            // CRITICAL: Collision Detection
            // Prevent double booking for the same provider at the same time
            if (service.providerId && bookingData.scheduledAt) {
                const requestedStart = bookingData.scheduledAt;
                const requestedDuration = bookingData.duration || 60; // Minutes
                const requestedEnd = new Date(requestedStart.getTime() + requestedDuration * 60000);

                const conflict = await prisma.booking.findFirst({
                    where: {
                        service: {
                            providerId: service.providerId
                        },
                        status: {
                            in: ['confirmed', 'pending']
                        },
                        scheduledAt: {
                            lt: requestedEnd
                        },
                        AND: [
                            {
                                // End time of existing booking > Requested Start
                                // We can't rely on a stored 'end' column if it doesn't exist, so we calculate on fly or assume 'duration'
                                // But prisma filtering on computed fields is hard. 
                                // Alternatively, simply check if scheduledAt matches exactly (if slots are rigorous)
                                // or better: fetch potential collisions and filter in memory?
                                // OR: if we assume standard 1 hour slots, we can check 1 hour window.
                                // Let's use a simpler overlapping logic:
                                // Existing.Start < Requested.End AND Existing.End > Requested.Start
                                // Since we don't have 'end' column, we check if Existing.Start is within [Req.Start - Duration, Req.End]
                                // For now, let's assume strict equality on start time is a good first defense 
                                // if the UI enforces specific slots.
                                // But better:
                                scheduledAt: {
                                    gte: new Date(requestedStart.getTime() - (3 * 60 * 60 * 1000)), // Look back 3 hours
                                    lt: requestedEnd
                                }
                            }
                        ]
                    },
                    select: {
                        scheduledAt: true,
                        duration: true
                    }
                });

                if (conflict && conflict.scheduledAt) {
                    // Check exact overlap in memory to be precise
                    const conflictStart = conflict.scheduledAt;
                    const conflictDuration = conflict.duration || 60;
                    const conflictEnd = new Date(conflictStart.getTime() + conflictDuration * 60000);

                    if (requestedStart < conflictEnd && requestedEnd > conflictStart) {
                        return NextResponse.json({ error: 'This time slot is already booked.' }, { status: 409 });
                    }
                }
            }

            // Use transaction to create booking and promo usage together
            const result = await prisma.$transaction(async (tx: any) => {
                const booking = await tx.booking.create({
                    data: bookingData
                });

                if (appliedPromoCodeId) {
                    await tx.promoUsage.create({
                        data: {
                            promoCodeId: appliedPromoCodeId,
                            userId: userId,
                            orderId: booking.id,
                            orderAmount: baseTotal, // Original amount before discount
                            discountAmount: discountAmount
                        }
                    });

                    await tx.promoCode.update({
                        where: { id: appliedPromoCodeId },
                        data: { usedCount: { increment: 1 } }
                    });
                }

                // Create notifications for Booking
                // 1. Notify Client
                await tx.notification.create({
                    data: {
                        userId: userId,
                        title: 'Booking Confirmed',
                        message: `You have successfully booked ${service.title} with ${service.providerId === userId ? 'yourself' : 'a pro'}.`,
                        type: 'BOOKING_CREATED',
                        entityId: booking.id,
                        entityType: 'booking',
                        actionUrl: `/client/bookings/${booking.id}`,
                    }
                });

                // 2. Notify Freelancer
                await tx.notification.create({
                    data: {
                        userId: service.providerId,
                        title: 'New Booking Request',
                        message: `You have a new booking request for ${service.title}.`,
                        type: 'BOOKING_REQUEST',
                        entityId: booking.id,
                        entityType: 'booking',
                        actionUrl: `/freelancer/jobs/${booking.id}`,
                    }
                });

                return booking;
            });

            // Re-fetch booking with related data for return
            const fullBooking = await prisma.booking.findUnique({
                where: { id: result.id },
                include: {
                    service: {
                        include: {
                            provider: true
                        }
                    },
                    client: true
                }
            });

            // Update client notification message with actual provider name
            if (fullBooking && fullBooking.service.provider) {
                await prisma.notification.updateMany({
                    where: {
                        entityId: result.id,
                        userId: userId,
                        type: 'BOOKING_CREATED'
                    },
                    data: {
                        message: `You have booked a session with ${fullBooking.service.provider.name}.`
                    }
                });
            }

            // 3. Notify Admin (Email) - Rich HTML Format
            // Run asynchronously to not block response
            (async () => {
                if (!fullBooking) return; // Should not happen

                try {
                    const { sendAdminNotification } = await import('@/lib/email');

                    const price = (fullBooking.totalPrice || 0).toLocaleString('en-IN');
                    const date = fullBooking.scheduledAt ? new Date(fullBooking.scheduledAt).toLocaleString('en-IN', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    }) : 'Date TBD';

                    const clientName = fullBooking.client.name || fullBooking.client.email || 'Client';
                    const freelancerName = fullBooking.service.provider.name || 'Freelancer';
                    const serviceTitle = fullBooking.service.title;
                    const duration = fullBooking.duration || 60;

                    const htmlContent = `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                            <h2 style="color: #6B46C1; text-align: center;">New Booking Confirmed 🚀</h2>
                            <p style="color: #555; font-size: 16px;">A new service has been booked on BAILS.</p>
                            
                            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
                                <h3 style="margin-top: 0; color: #333;">${serviceTitle}</h3>
                                <p style="margin: 5px 0;"><strong>Price:</strong> ₹${price}</p>
                                <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
                                <p style="margin: 5px 0;"><strong>Duration:</strong> ${duration} mins</p>
                            </div>

                            <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                                <div style="flex: 1;">
                                    <h4 style="border-bottom: 2px solid #6B46C1; padding-bottom: 5px;">Client</h4>
                                    <p style="margin: 5px 0;"><strong>Name:</strong> ${clientName}</p>
                                    <p style="margin: 5px 0;"><strong>Email:</strong> ${fullBooking.client.email}</p>
                                    <p style="margin: 5px 0;"><strong>Phone:</strong> ${fullBooking.client.phone || 'N/A'}</p>
                                </div>
                                <div style="flex: 1;">
                                    <h4 style="border-bottom: 2px solid #6B46C1; padding-bottom: 5px;">Freelancer</h4>
                                    <p style="margin: 5px 0;"><strong>Name:</strong> ${freelancerName}</p>
                                    <p style="margin: 5px 0;"><strong>ID:</strong> ${fullBooking.service.providerId}</p>
                                </div>
                            </div>

                            <div style="text-align: center; margin-top: 30px;">
                                <a href="https://bails.in/admin/bookings/${fullBooking.id}" style="background-color: #6B46C1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Booking</a>
                            </div>
                            
                            <p style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
                                Booking ID: ${fullBooking.id}
                            </p>
                        </div>
                    `;

                    await sendAdminNotification(
                        `New Booking: ${serviceTitle} - ₹${price}`,
                        `New booking confirmed for ${serviceTitle} by ${clientName}. Price: ₹${price}`,
                        htmlContent
                    );
                } catch (emailErr) {
                    console.error('Failed to send admin booking notification:', emailErr);
                }
            })();

            console.log('Booking created successfully:', result.id);
            return NextResponse.json({ success: true, booking: result });
        } catch (dbError: any) {
            console.error('Prisma Create Error:', dbError);
            console.error('Error Code:', dbError.code);
            console.error('Error Meta:', dbError.meta);
            console.error('Error Message:', dbError.message);
            throw dbError; // Re-throw to be caught by outer catch
        }

    } catch (error) {
        console.error('Failed to create booking:', error);
        return NextResponse.json({ error: `Failed to create booking: ${(error as any).message}` }, { status: 500 });
    }
}

