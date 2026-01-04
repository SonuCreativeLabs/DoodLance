
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const bookings = await prisma.booking.findMany({
        take: 5,
        include: {
            service: {
                include: {
                    provider: true
                }
            }
        }
    });

    console.log('Found', bookings.length, 'bookings');
    bookings.forEach(b => {
        console.log(`Booking ID: ${b.id}`);
        console.log(`Provider: ${b.service.provider.name}`);
        console.log(`Provider Phone: ${b.service.provider.phone}`);
        console.log('---');
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
