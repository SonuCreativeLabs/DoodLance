
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export { }; // Treat as module to avoid global scope collision

async function main() {
    const sonuId = 'ce4fb54d-b674-44e7-8fb4-b0ea2a10b75a';

    console.log(`Inspecting bookings for provider: ${sonuId}`);

    const bookings = await prisma.booking.findMany({
        where: { service: { providerId: sonuId } },
        include: { service: true, client: true }
    });

    console.log(JSON.stringify(bookings, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
