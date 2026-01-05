
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const sonuId = 'ce4fb54d-b674-44e7-8fb4-b0ea2a10b75a';
    const clientId = '66f5722d-30f9-4226-9cbe-493520c57f2d'; // Nathish as client

    console.log('--- Seeding Performance Data for Sonu ---');

    const jobsToCreate = [
        {
            title: 'Cricket Bat Repair',
            budget: 1500,
            completedAt: new Date(), // This month
            experience: 'Intermediate',
            location: 'Chennai',
            type: 'Fixed Price',
            workMode: 'On-site',
            skills: 'Bat Repair',
            category: 'Equipment Repair'
        },
        {
            title: 'Personal Coaching Session',
            budget: 2000,
            completedAt: new Date(new Date().setMonth(new Date().getMonth() - 1)), // Last month
            experience: 'Expert',
            location: 'Mumbai',
            type: 'Hourly',
            workMode: 'On-site',
            skills: 'Coaching',
            category: 'Coaching'
        },
        {
            title: 'Pitch Maintenance Advice',
            budget: 5000,
            completedAt: new Date(new Date().setMonth(new Date().getMonth() - 2)), // 2 months ago
            experience: 'Expert',
            location: 'Bangalore',
            type: 'Consultation',
            workMode: 'Remote',
            skills: 'Pitch Curator',
            category: 'Consultation'
        }
    ];

    for (const jobData of jobsToCreate) {
        const job = await prisma.job.create({
            data: {
                ...jobData,
                description: 'Seeded job for performance testing',
                coords: '0,0',
                clientId: clientId,
                freelancerId: sonuId,
                status: 'COMPLETED',
                progress: 100,
                completedBy: sonuId
            }
        });
        console.log(`Created job: ${job.title} (ID: ${job.id})`);
    }

    // Force update profile just in case, though API is dynamic now
    // We update rating to make it look good
    await prisma.freelancerProfile.update({
        where: { userId: sonuId },
        data: {
            rating: 4.8,
            reviewCount: 3,
            completionRate: 100
        }
    });

    console.log('Seeding complete! Performance analytics should now show data.');
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
