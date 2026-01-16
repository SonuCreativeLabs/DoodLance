
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeUserAdmin() {
    const email = process.argv[2];

    if (!email) {
        console.error('Please provide an email address.');
        console.error('Usage: npx ts-node scripts/make-user-admin.ts <email>');
        process.exit(1);
    }

    const normalizedEmail = email.toLowerCase();

    try {
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (!user) {
            console.error(`User with email ${normalizedEmail} (normalized) not found in public database.`);
            process.exit(1);
        }

        const updatedUser = await prisma.user.update({
            where: { email: normalizedEmail },
            data: { role: 'admin' },
        });

        console.log(`✅ User ${email} promoted to ADMIN successfully.`);
        console.log(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

makeUserAdmin();
