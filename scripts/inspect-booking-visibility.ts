
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const bookingId = 'cmjye0o3d00014pv27pp4zd08';
    console.log(`Inspecting booking: ${bookingId}`);

    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            service: true,
            client: true
        }
    });

    console.log(JSON.stringify(booking, null, 2));
    console.log('--- IDs ---');
    console.log('Booking Client ID:', booking.clientId);
    console.log('Service Provider ID:', booking.service.providerId);

    // Also check who 'Sathishraj' is (assuming he is the user viewing the wrong page)
    // The user message implied 'Sathishraj' sees it in HIS client page.
    // If Sathishraj is the provider, he should NOT see it in Client Bookings.
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
