
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Fixing service durations...');

    const updateResult = await prisma.service.updateMany({
        where: {
            OR: [
                { duration: 0 },
                { duration: { equals: undefined } } // Just in case
            ]
        },
        data: {
            duration: 60 // Default to 60 mins
        }
    });

    console.log(`Updated ${updateResult.count} services to have 60 mins duration.`);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
