
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Fetching first service...');
    const service = await prisma.service.findFirst();

    if (!service) {
        console.log('No services found.');
        return;
    }

    console.log(`Updating service: ${service.title} (${service.id})`);

    await prisma.service.update({
        where: { id: service.id },
        data: {
            totalOrders: 42,
            reviewCount: 15,
            rating: 4.8
        }
    });

    console.log('Service updated with Metrics: Orders=42, Reviews=15, Rating=4.8');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
