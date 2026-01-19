
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUserDetailed() {
    const email = 'sonucreativelabs@gmail.com';
    console.log(`Checking DETAILED status for ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            freelancerProfile: true
        }
    });

    if (!user) {
        console.log('User not found.');
        return;
    }

    console.log('--- USER TABLE ---');
    console.log('ID:', user.id);
    console.log('Name:', user.name);
    console.log('isVerified (User level):', user.isVerified);

    console.log('\n--- FREELANCER PROFILE TABLE ---');
    if (user.freelancerProfile) {
        console.log('ID:', user.freelancerProfile.id);
        console.log('isVerified (Freelancer level):', user.freelancerProfile.isVerified);
        console.log('verificationDocs:', user.freelancerProfile.verificationDocs);
    } else {
        console.log('No freelancer profile.');
    }
}

checkUserDetailed()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
