import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: 'shubham', mode: 'insensitive' } },
        { username: { contains: 'shubham', mode: 'insensitive' } }
      ]
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true
    }
  });

  console.log('Found users:', users);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
