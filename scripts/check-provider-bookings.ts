
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const sonuId = 'ce4fb54d-b674-44e7-8fb4-b0ea2a10b75a';
    const nathishId = '66f5722d-30f9-4226-9cbe-493520c57f2d'; // from previous inspect

    console.log('--- Checking Sonu user 3 Provider Bookings ---');
    const sonuBookings = await prisma.booking.findMany({
        where: { service: { providerId: sonuId } }
    });
    console.log(`Sonu (Provider) Count: ${sonuBookings.length}`);

    console.log('--- Checking Sathishraj Provider Bookings ---');
    const nathishBookings = await prisma.booking.findMany({
        where: { service: { providerId: nathishId } }
    });
    console.log(`Sathishraj (Provider) Count: ${nathishBookings.length}`);
    if (nathishBookings.length > 0) {
        console.log('Sample Booking IDs:', nathishBookings.map(b => b.id));
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
