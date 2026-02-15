const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to DB...');
        const count = await prisma.user.count();
        console.log('User count:', count);

        console.log('Fetching freelancers...');
        const profiles = await prisma.freelancerProfile.findMany({
            take: 1,
            include: {
                user: {
                    include: {
                        services: true
                    }
                }
            }
        });
        console.log('Freelancer fetched:', profiles.length);
        if (profiles.length > 0) {
            console.log('First freelancer:', profiles[0].user.name);
        }
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
