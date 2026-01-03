
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Starting migration of booking locations...');

    // Find bookings with missing or empty locations
    const bookings = await prisma.booking.findMany({
        where: {
            OR: [
                { location: null },
                { location: '' }
            ]
        },
        include: {
            service: true
        }
    });

    console.log(`Found ${bookings.length} bookings to update.`);

    for (const booking of bookings) {
        // Strategy: Use Service location -> specific default
        let newLocation = booking.service.location;

        // If service has no location, fallback (based on user logs, Chennai seems appropriate for this test data)
        if (!newLocation) {
            newLocation = "Chennai, TN";
        }

        console.log(`Updating Booking ${booking.id}: '${booking.location}' -> '${newLocation}'`);

        await prisma.booking.update({
            where: { id: booking.id },
            data: { location: newLocation }
        });
    }

    console.log('Migration completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
