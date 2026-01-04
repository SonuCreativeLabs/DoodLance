
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        where: {
            phone: {
                contains: '99999999'
            }
        }
    });

    console.log('Found', users.length, 'users with phone containing 99999999');
    users.forEach(u => {
        console.log(`User: ${u.name} (${u.role}) - Phone: ${u.phone}`);
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
