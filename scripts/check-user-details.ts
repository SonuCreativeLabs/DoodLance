
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
    const username = 'rohitkesav';
    const user = await prisma.user.findUnique({
        where: { username },
        select: {
            id: true,
            username: true,
            name: true,
            email: true
        }
    });

    console.log('User Details:');
    console.log(user);
}

checkUser();
