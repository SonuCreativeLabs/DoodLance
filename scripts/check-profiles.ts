const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

const TARGET_IDS = [
    'ce4fb54d-b674-44e7-8fb4-b0ea2a10b75a', // sonucreativelabs
    '09a5d449-f358-4066-801b-001f440e8256'  // sonuofficials07
];

async function checkProfiles() {
    console.log('--- Checking for Existing Profiles ---')

    for (const userId of TARGET_IDS) {
        console.log(`\nChecking User ID: ${userId}...`);

        // Check Freelancer Profile
        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: userId }
        });

        if (profile) {
            console.log(`✅ FOUND Profile!`);
            console.log(`- Title: ${profile.title}`);
            console.log(`- Skills: ${profile.skills}`);
            console.log(`- Earnings: ${profile.totalEarnings}`);
        } else {
            console.log(`❌ No Freelancer Profile found.`);
        }

        // Check Client Profile
        const client = await prisma.clientProfile.findUnique({
            where: { userId: userId }
        });
        if (client) {
            console.log(`✅ FOUND Client Profile!`);
            console.log(`- Company: ${client.company}`);
        } else {
            console.log(`❌ No Client Profile found.`);
        }
    }
}

checkProfiles()
    .catch((e: any) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
