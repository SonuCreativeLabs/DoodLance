import prisma from '../src/lib/db';

async function main() {
    const email = process.argv[2];
    if (!email) {
        console.error('Please provide an email address');
        process.exit(1);
    }
    console.log(`Checking for user: ${email}...`);
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (user) {
        console.log(`User FOUND: ${user.id} (Role: ${user.role})`);
    } else {
        console.log(`User NOT FOUND in database.`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
