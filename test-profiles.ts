import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: {
      name: {
        in: ['Moksh MD', 'Maaz Ahmed', 'Mohd sufiyan Uddin']
      }
    },
    include: {
      freelancerProfile: true,
      services: true,
    }
  });
  
  console.log(JSON.stringify(users, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
