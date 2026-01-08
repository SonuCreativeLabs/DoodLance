
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
    console.log('Sample statuses:', bookings.map(b => b.status));

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

    console.log(`Count exact 'PENDING': ${pendingCount}`);
    console.log(`Count exact 'pending': ${pendingLowerCount}`);

    // Check recent
    const recent = await prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
    });
    console.log('Recent 5 bookings:', recent.map(b => ({ id: b.id, status: b.status, created: b.createdAt })));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
