
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // ID for 'Sonu' from previous scripts
    const sonuId = 'ce4fb54d-b674-44e7-8fb4-b0ea2a10b75a';

    console.log(`Checking data for User ID: ${sonuId}`);

    const profile = await prisma.freelancerProfile.findUnique({
        where: { userId: sonuId }
    });

    console.log('\n--- Freelancer Profile ---');
    if (profile) {
        console.log(`Total Earnings: ${profile.totalEarnings}`);
        console.log(`Completed Jobs: ${profile.completedJobs}`);
        console.log(`Rating: ${profile.rating}`);
        console.log(`Review Count: ${profile.reviewCount}`);
    } else {
        console.log('Profile not found!');
    }

    console.log('\n--- Completed Jobs (Last 6 Months) ---');
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    const completedJobs = await prisma.job.findMany({
        where: {
            freelancerId: sonuId,
            status: 'COMPLETED'
        },
        select: {
            id: true,
            title: true,
            budget: true,
            completedAt: true
        }
    });

    console.log(`Total Completed Jobs found: ${completedJobs.length}`);
    if (completedJobs.length > 0) {
        completedJobs.forEach(job => {
            console.log(`- ${job.title}: ₹${job.budget} (Completed: ${job.completedAt})`);
        });
    } else {
        console.log('No completed jobs found.');
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

export { };
