
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const bookingId = 'cmjy6vgoq008endgvmpw061p5';
    console.log(`Inspecting booking: ${bookingId}`);

    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            service: true,
            client: true
        }
    });

    console.log(JSON.stringify(booking, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
