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
            services // Extract services
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

        if (body.services && body.services.length > 0) {
            // Calculate total from services array
            finalPrice = body.services.reduce((total: number, s: any) => {
                const price = typeof s.price === 'string'
                    ? parseFloat(s.price.replace(/[^\d.]/g, ''))
                    : s.price;
                return total + (price * (s.quantity || 1));
            }, 0);
        } else {
            // Fallback to single service price
            finalPrice = service.price;
        }

        // Add 5% platform fee
        const platformFee = Math.round(finalPrice * 0.05);
        finalPrice += platformFee;

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
        };

        console.log('Attempting to create booking with data:', JSON.stringify({
            ...bookingData,
            clientId: userId, // Ensure we see the ID
            scheduledAt: bookingData.scheduledAt?.toString()
        }, null, 2));

        try {
            // Check if user exists in DB to prevent FK error if Supabase user exists but DB user doesn't
            const userExists = await prisma.user.findUnique({ where: { id: userId } });
            if (!userExists) {
                console.error(`User ${userId} not found in database (FK violation risk)`);
                return NextResponse.json({ error: 'User profile not found. Please complete your profile.' }, { status: 400 });
            }

            const booking = await prisma.booking.create({
                data: bookingData
            });
            console.log('Booking created successfully:', booking.id);
            return NextResponse.json({ success: true, booking });
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

