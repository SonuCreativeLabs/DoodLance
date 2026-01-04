
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Find providers with the mock number or just update all for testing?
    // Let's first look at what we have
    const providers = await prisma.user.findMany({
        where: {
            role: 'freelancer'
        }
    });

    console.log('Updating', providers.length, 'freelancers');

    for (const p of providers) {
        if (!p.phone || p.phone === '9999999999') {
            const newPhone = '9876543210'; // Sample valid number
            await prisma.user.update({
                where: { id: p.id },
                data: { phone: newPhone }
            });
            console.log(`Updated ${p.name} (${p.id}) phone to ${newPhone}`);
        } else {
            console.log(`${p.name} already has phone: ${p.phone}`);
        }
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
