import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🏏 Starting migration: Backfilling Cricket Data...');

    try {
        // 1. Fetch all freelancer profiles
        const profiles = await prisma.freelancerProfile.findMany();
        console.log(`Found ${profiles.length} profiles to migrate.`);

        let updatedCount = 0;

        // 2. Iterate and update
        for (const profile of profiles) {
            // Skip if already migrated (optional optimization, but safe to overwrite for idempotency)
            if (profile.mainSport === 'Cricket' && profile.sportsDetails) {
                // console.log(`Profile ${profile.id} already migrated.`);
                // continue; 
            }

            // Construct sportsDetails JSON
            const sportsDetails = {
                cricketRole: profile.cricketRole,
                battingStyle: profile.battingStyle,
                bowlingStyle: profile.bowlingStyle,
            };

            // 3. Update the record
            await prisma.freelancerProfile.update({
                where: { id: profile.id },
                data: {
                    mainSport: 'Cricket',
                    sportsDetails: sportsDetails as Prisma.JsonObject, // Cast to JsonObject
                },
            });

            updatedCount++;
            process.stdout.write(`\rMigrated ${updatedCount}/${profiles.length} profiles...`);
        }

        console.log(`\n✅ Migration complete! Updated ${updatedCount} profiles.`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
