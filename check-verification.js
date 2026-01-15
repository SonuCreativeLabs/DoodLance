const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkVerification() {
    try {
        const email = 'sonucreativelabs@gmail.com';
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                freelancerProfile: true,
            },
        });

        if (!user) {
            console.log(`User with email ${email} not found.`);
            return;
        }

        console.log(`User Found: ${user.name} (${user.id})`);
        console.log(`User.isVerified: ${user.isVerified}`);

        if (user.freelancerProfile) {
            console.log(`FreelancerProfile Found: ${user.freelancerProfile.id}`);
            console.log(`FreelancerProfile.isVerified: ${user.freelancerProfile.isVerified}`);
        } else {
            console.log('No FreelancerProfile found for this user.');
        }

    } catch (error) {
        console.error('Error checking verification:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkVerification();
