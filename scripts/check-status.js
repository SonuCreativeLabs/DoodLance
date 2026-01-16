
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkStatuses() {
    try {
        const bookings = await prisma.booking.groupBy({
            by: ['status'],
            _count: {
                status: true
            }
        });
        console.log('Booking Statuses:', bookings);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkStatuses();
