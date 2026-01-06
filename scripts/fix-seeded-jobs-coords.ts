
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Fixing Seeded Data Coords ---');

    // Find jobs with invalid coords '0,0'
    const jobs = await prisma.job.findMany({
        where: {
            coords: '0,0'
        }
    });

    console.log(`Found ${jobs.length} jobs with invalid coords.`);

    for (const job of jobs) {
        await prisma.job.update({
            where: { id: job.id },
            data: {
                coords: '[0,0]' // Valid JSON array
            }
        });
        console.log(`Updated job ${job.title} (${job.id})`);
    }

    console.log('Fix complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

export { };
