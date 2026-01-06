const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.create({
        data: {
            email: 'test@example.com',
            role: 'FREELANCER',
            displayId: 'TEST-USER-123',
            coords: '0,0'
        }
    });
    console.log('CREATED_USER_ID:', user.id);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
