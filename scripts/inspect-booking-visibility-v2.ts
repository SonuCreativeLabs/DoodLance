
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

    if (!booking) {
        console.log('Booking not found!');
        return;
    }

    console.log(JSON.stringify(booking, null, 2));
    console.log('--- IDs ---');
    console.log('Booking Client ID:', booking.clientId);
    console.log('Booking Client Name:', booking.client.name);
    console.log('Service Provider ID:', booking.service.providerId);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

export { };
