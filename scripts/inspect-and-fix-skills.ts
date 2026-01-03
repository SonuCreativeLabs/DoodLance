
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Inspecting Service Tags for Bookings...');

    const bookings = await prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            service: true
        }
    });

    for (const booking of bookings) {
        console.log(`Booking ID: ${booking.id}`);
        console.log(`Service Title: ${booking.service.title}`);
        console.log(`Current Tags: '${booking.service.tags}'`);

        // If tags are empty or just empty brackets/string, fix them
        if (!booking.service.tags || booking.service.tags.trim() === '' || booking.service.tags === '[]') {
            const newTags = "Cricket, Bowling, Coaching";
            console.log(`-> Updating tags to: '${newTags}'`);

            await prisma.service.update({
                where: { id: booking.service.id },
                data: { tags: newTags }
            });
        }
        console.log('---');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
