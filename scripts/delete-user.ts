
import prisma from '../src/lib/db';

async function main() {
    const email = process.argv[2];
    if (!email) {
        console.error('Please provide an email to delete.');
        process.exit(1);
    }

    console.log(`Searching for user: ${email}...`);
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.log('User not found.');
        return;
    }

    console.log(`Deleting user ${user.id} (${email})...`);

    // Delete notifications first (FK constraint)
    await prisma.notification.deleteMany({
        where: { userId: user.id }
    });

    // Delete freelancer profile if exists
    await prisma.freelancerProfile.deleteMany({
        where: { userId: user.id }
    });

    // Delete the user
    await prisma.user.delete({
        where: { id: user.id }
    });

    console.log('✅ User deleted successfully. You can now re-test signup.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
