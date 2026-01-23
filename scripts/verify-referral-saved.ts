import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyReferral() {
    const email = process.argv[2];

    if (!email) {
        console.log('Usage: npx tsx scripts/verify-referral-saved.ts <email>');
        process.exit(1);
    }

    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            referredBy: true,
            createdAt: true
        }
    });

    if (!user) {
        console.log(`❌ User not found: ${email}`);
    } else {
        console.log('\n✅ User found:');
        console.log(`   Email: ${user.email}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Referred By: ${user.referredBy || 'NULL ❌'}`);
        console.log(`   Created: ${user.createdAt}`);

        if (user.referredBy) {
            console.log('\n🎉 SUCCESS! Referral code was saved!');
        } else {
            console.log('\n❌ FAILED! No referral code saved.');
        }
    }

    await prisma.$disconnect();
}

verifyReferral();
