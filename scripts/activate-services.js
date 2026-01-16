
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Activating all services...');

    try {
        const result = await prisma.service.updateMany({
            data: {
                isActive: true,
            },
        });

        console.log(`✅ Successfully activated ${result.count} services.`);
    } catch (error) {
        console.error('❌ Error activating services:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
