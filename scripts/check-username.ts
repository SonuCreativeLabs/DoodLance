
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsername() {
    const inputName = process.argv[2];
    if (!inputName) {
        console.log('Usage: npx ts-node scripts/check-username.ts <username>');
        process.exit(1);
    }

    console.log(`Searching for username: "${inputName}" ...`);

    // Case-insensitive findFirst
    const user = await prisma.user.findFirst({
        where: {
            username: {
                equals: inputName,
                mode: 'insensitive'
            }
        }
    });

    if (user) {
        console.log('✅ User Found!');
        console.log(`Stored Username: "${user.username}"`);
        console.log(`ID: ${user.id}`);
        console.log(`Email: ${user.email}`);
    } else {
        console.log('❌ User not found with that username (any case).');
    }
}

checkUsername();
