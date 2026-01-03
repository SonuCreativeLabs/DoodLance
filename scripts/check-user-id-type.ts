const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function checkIds() {
    console.log('--- Checking User IDs ---')
    const emails = ['sonucreativelabs@gmail.com', 'sonuofficials07@gmail.com'];

    for (const email of emails) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            const isCuid = user.id.startsWith('c'); // Crude check, but CUIDs usually start with c
            const isUuid = user.id.includes('-'); // UUIDs have dashes
            console.log(`Email: ${email}`);
            console.log(`  ID: ${user.id}`);
            console.log(`  Type: ${isCuid ? 'CUID' : (isUuid ? 'UUID' : 'Custom')}`);
        } else {
            console.log(`Email: ${email} - NOT FOUND`);
        }
    }
}

checkIds()
    .catch((e: any) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
