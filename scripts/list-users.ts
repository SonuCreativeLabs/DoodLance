
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                name: true,
                username: true
            }
        });

        console.log('--- Users in public.users ---');
        if (users.length === 0) {
            console.log('No users found in public.users table.');
        } else {
            users.forEach((u: any) => console.log(`User: ${u.username} | Email: ${u.email} | ID: ${u.id}`));
        }
        console.log('-----------------------------');

    } catch (error) {
        console.error('Error listing users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

listUsers();
