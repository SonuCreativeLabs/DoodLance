import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { validateSession } from '@/lib/auth/jwt';

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
        const session = await validateSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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
            // Need to join via Service to find bookings provided by this user
            whereClause.service = {
                providerId: session.userId
            };
        } else {
            // Default to client view or check both?
            // Simplest is to check if user appears in EITHER clientId OR service.providerId
            if (!role) {
                whereClause.OR = [
                    { clientId: session.userId },
                    { service: { providerId: session.userId } }
                ];
            } else {
                whereClause.clientId = session.userId;
            }
        }

        const bookings = await prisma.booking.findMany({
            where: whereClause,
            include: {
                service: {
                    include: {
                        provider: {
                            select: {
                                name: true,
                                avatar: true,
                            }
                        }
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
            freelancerAvatar: b.service.provider.avatar,
            status: b.status, // PENDING, CONFIRMED etc
            date: b.scheduledAt ? b.scheduledAt.toISOString() : null,
            price: b.totalPrice,
            serviceId: b.serviceId,
            clientId: b.clientId
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
        const session = await validateSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            serviceId,
            scheduledAt,
            packageType,
            requirements,
            location,
            notes
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

        if (service.providerId === session.userId) {
            return NextResponse.json({ error: 'Cannot book your own service' }, { status: 400 });
        }

        // Calculate price (simplified, could depend on packageType)
        // For now use base service price
        let finalPrice = service.price;
        // logic to adjust price based on package...

        const booking = await prisma.booking.create({
            data: {
                clientId: session.userId,
                serviceId: service.id,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                duration: service.duration,
                totalPrice: finalPrice,
                packageType: packageType || 'Standard',
                status: 'PENDING',
                location: location || service.location || '',
                coords: '', // Optional or derive
                notes: notes || '',
                requirements: requirements || '',
                deliverables: '', // Empty initially
            }
        });

        return NextResponse.json({ success: true, booking });

    } catch (error) {
        console.error('Failed to create booking:', error);
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}
