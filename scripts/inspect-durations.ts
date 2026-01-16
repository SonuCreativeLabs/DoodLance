
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Fetching all services duration...');
    const services = await prisma.service.findMany({
        select: { id: true, title: true, duration: true, packages: true }
    });

    console.log('Service Durations:', JSON.stringify(services, null, 2));
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
