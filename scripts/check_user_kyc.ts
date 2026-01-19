
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUserKyc() {
    const email = 'sonucreativelabs@gmail.com';
    console.log(`Checking KYC for ${email}...`);

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

    console.log('User found:', user.id, user.name);

    if (!user.freelancerProfile) {
        console.log('No freelancer profile found for this user.');
        return;
    }

    console.log('Freelancer Profile ID:', user.freelancerProfile.id);
    console.log('isVerified:', user.freelancerProfile.isVerified);
    console.log('verificationDocs:', user.freelancerProfile.verificationDocs);
}

checkUserKyc()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
