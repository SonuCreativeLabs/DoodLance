
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const bookingId = 'cmkybhwe';
    console.log(`Patching booking: ${bookingId}`);

    // Find the full ID first
    const booking = await prisma.booking.findFirst({
        where: {
            OR: [
                { id: bookingId },
                { id: { contains: bookingId } },
            ]
        }
    });

    if (!booking) {
        console.error('Booking not found!');
        return;
    }

    // Set date to tomorrow 10 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const updated = await prisma.booking.update({
        where: { id: booking.id },
        data: {
            scheduledAt: tomorrow,
            paymentStatus: 'VERIFIED',
            status: 'confirmed'
        }
    });

    console.log('Booking patched successfully:');
    console.log('New Date:', updated.scheduledAt);
    console.log('Payment Status:', updated.paymentStatus);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
