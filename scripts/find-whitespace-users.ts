import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            username: true,
        }
    });

    const usersWithWhitespace = users.filter((u) => u.username && u.username !== u.username.trim());

    console.log(`Found ${usersWithWhitespace.length} users with leading/trailing whitespace in their username`);
    console.log(usersWithWhitespace);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
