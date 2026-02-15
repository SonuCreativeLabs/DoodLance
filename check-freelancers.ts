
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const freelancers = await prisma.freelancerProfile.findMany({
        take: 5,
        include: {
            user: {
                select: {
                    name: true,
                    username: true
                }
            }
        }
    });

    console.log(JSON.stringify(freelancers, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
