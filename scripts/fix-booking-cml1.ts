require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function patchBooking() {
    const bookingId = 'cml1v22re0002t1sw0ez29rj1';

    try {
        const updated = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                totalPrice: 1200, // Fix price to 1200
                // location: 'Detailed Venue Info...' // I don't have this yet
            }
        });

        console.log('Successfully updated booking:', updated.id);
        console.log('New Price:', updated.totalPrice);

    } catch (error) {
        console.error('Error updating booking:', error);
    } finally {
        await prisma.$disconnect();
    }
}

patchBooking().catch(console.error);
