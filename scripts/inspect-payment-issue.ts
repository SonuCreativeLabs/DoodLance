require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function inspectBooking() {
    const bookingId = 'cml1v22re0002t1sw0ez29rj1';
    console.log(`Inspecting booking: ${bookingId}`);

    try {
        const booking = await prisma.booking.findFirst({
            where: {
                id: bookingId
            },
            include: {
                service: {
                    include: {
                        provider: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                },
                client: {
                    select: {
                        name: true,
                        email: true,
                        location: true,
                        area: true,
                        city: true,
                        address: true
                    }
                }
            }
        });

        if (!booking) {
            console.log('Booking not found');
            return;
        }

        console.log('Booking Details:');
        console.log(JSON.stringify(booking, null, 2));

        if (booking.transactionId) {
            console.log('Searching for Transaction ID:', booking.transactionId);
            // Try finding by internal ID first
            let transaction = await prisma.transaction.findFirst({
                where: { id: booking.transactionId }
            });
            if (!transaction) {
                // Try finding by gateway transaction ID if field exists?
                // For now just print what we tried
                console.log('Transaction not found by ID. Checking if it maps to any other field...');
            } else {
                console.log('Transaction Details:', transaction);
            }
        }

    } catch (error) {
        console.error('Error identifying booking:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// inspectBooking(); // Already called at end of file, but I will make sure only one call exists.
inspectBooking().catch(console.error);
