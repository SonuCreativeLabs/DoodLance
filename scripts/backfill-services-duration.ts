
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Starting backfill of Booking services and duration...');

    const bookings = await prisma.booking.findMany({
        include: {
            service: true
        }
    });

    console.log(`Found ${bookings.length} bookings to process.`);

    for (const booking of bookings) {
        let updates = {};
        let shouldUpdate = false;

        // 1. Backfill 'services' array if missing or empty
        // We assume the booking consists of the single main service linked by serviceId
        if (!booking.services || (Array.isArray(booking.services) && booking.services.length === 0)) {
            console.log(`Booking ${booking.id}: Services missing. Backfilling from Service info.`);

            const serviceSnapshot = [{
                id: booking.service.id,
                title: booking.service.title,
                price: booking.service.price || 0, // Assuming price field exists on Service
                quantity: 1
            }];

            updates = { ...updates, services: serviceSnapshot };
            shouldUpdate = true;
        }

        // 2. Backfill 'duration' if it is 0
        if (!booking.duration || booking.duration === 0) {
            // Default to 60 mins if service duration is missing/0, or use service duration
            const newDuration = booking.service.duration || 60;
            console.log(`Booking ${booking.id}: Duration is ${booking.duration}. Updating to ${newDuration}.`);

            updates = { ...updates, duration: newDuration };
            shouldUpdate = true;
        }

        if (shouldUpdate) {
            await prisma.booking.update({
                where: { id: booking.id },
                data: updates
            });
            console.log(`-> Updated Booking ${booking.id}`);
        } else {
            console.log(`Booking ${booking.id}: No updates needed.`);
        }
    }

    console.log('Backfill completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
