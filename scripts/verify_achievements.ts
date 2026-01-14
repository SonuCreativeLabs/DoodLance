
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Verifying Achievement model...');
    // Attempt to access the model. If it doesn't exist on the client, this will throw or fail to compile if run with ts-node
    // But since I'm running with tsx/node, it mimics runtime.
    
    // Check if 'achievement' property exists
    if (!prisma.achievement) {
      console.error('ERROR: prisma.achievement is undefined!');
      process.exit(1);
    }
    
    console.log('Model exists on client. Querying count...');
    const count = await prisma.achievement.count();
    console.log(`Success! Table 'achievements' exists. Row count: ${count}`);
    
    // Also check FreelancerProfile relation
    console.log('Checking FreelancerProfile include...');
    const profile = await prisma.freelancerProfile.findFirst({
        include: { achievements: true }
    });
    console.log('Query with include: achievements successful.');
    
  } catch (e) {
    console.error('Verification Failed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
