
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUserServices() {
    const username = 'rohitkesav'; // Lowercase as per new rules

    const user = await prisma.user.findFirst({
        where: {
            username: {
                equals: username,
                mode: 'insensitive'
            }
        },
        include: {
            services: true
        }
    });

    if (!user) {
        console.log('User not found.');
        return;
    }

    if (!user.services || user.services.length === 0) {
        console.log('User has no services.');
        // Check if maybe it's stored in FreelancerProfile as a JSON string or some other way in older profiles?
        // But schema says typical Service relation is on User.
        return;
    }

    console.log(`Services for ${user.username}:`);
    user.services.forEach((service: any) => {
        console.log(`\n--- Service: ${service.title} ---`);
        console.log(`Description:\n${service.description}`);
        console.log(`Features: ${service.features}`);
        console.log('---------------------------');
    });
}

checkUserServices();
