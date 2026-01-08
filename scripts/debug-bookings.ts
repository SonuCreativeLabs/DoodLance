const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkBookings() {
    try {
        // Get recent users
        const users = await prisma.user.findMany({
            take: 3,
            select: { id: true, email: true, name: true },
            orderBy: { createdAt: 'desc' }
        });
        console.log('Recent Users:', JSON.stringify(users, null, 2));

        // Check all bookings
        const bookings = await prisma.booking.findMany({
            take: 10,
            select: {
                id: true,
                status: true,
                totalPrice: true,
                duration: true,
                scheduledAt: true,
                deliveredAt: true,
                updatedAt: true,
                serviceId: true,
                service: {
                    select: {
                        id: true,
                        title: true,
                        providerId: true,
                        provider: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        console.log('\nTotal Bookings Found:', bookings.length);
        console.log('\nRecent Bookings:', JSON.stringify(bookings, null, 2));

        // Check services
        const services = await prisma.service.findMany({
            take: 5,
            select: {
                id: true,
                title: true,
                providerId: true,
                provider: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        console.log('\nServices:', JSON.stringify(services, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkBookings();
