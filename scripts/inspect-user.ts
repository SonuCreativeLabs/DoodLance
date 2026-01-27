
import prisma from '../src/lib/db';

async function main() {
    const email = process.argv[2];
    if (!email) {
        process.exit(1);
    }
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            isVerified: true
        }
    });

    if (user) {
        console.log(JSON.stringify(user, null, 2));
    } else {
        console.log('User not found');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
