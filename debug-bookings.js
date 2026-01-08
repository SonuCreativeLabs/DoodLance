
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Fetching bookings...');
    const bookings = await prisma.booking.findMany({
        select: {
            id: true,
            status: true,
            totalPrice: true,
            createdAt: true
        }
    });

    console.log(`Found ${bookings.length} bookings.`);

    // Check unique statuses
    const statuses = [...new Set(bookings.map(b => b.status))];
    console.log('Unique statuses:', statuses);

    // Check Pending count specifically with different inputs
    const pendingCount = await prisma.booking.count({
        where: { status: 'PENDING' }
    });
    const pendingLowerCount = await prisma.booking.count({
        where: { status: 'pending' }
    });
    const newCount = await prisma.booking.count({
        where: { status: 'new' }
    });

    console.log(`Count exact 'PENDING': ${pendingCount}`);
    console.log(`Count exact 'pending': ${pendingLowerCount}`);
    console.log(`Count exact 'new': ${newCount}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
