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

    if (usersWithWhitespace.length === 0) {
        console.log('No users with whitespace in username found.');
        return;
    }

    console.log(`Found ${usersWithWhitespace.length} users with leading/trailing whitespace in their username.`);

    for (const user of usersWithWhitespace) {
        if (user.username) {
            const trimmed = user.username.trim();
            console.log(`Updating user ${user.id} from '${user.username}' to '${trimmed}'`);
            await prisma.user.update({
                where: { id: user.id },
                data: { username: trimmed }
            });
        }
    }

    console.log('Successfully completed username cleanup.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
