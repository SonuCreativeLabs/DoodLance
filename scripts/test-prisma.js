
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const profiles = await prisma.freelancerProfile.findMany({ select: { id: true, userId: true, user: { select: { name: true } } } });
        console.log('Profiles:', profiles);
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
