
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const email = 'sonucreativelabs@gmail.com'; // Default user based on context

        const user = await prisma.user.findUnique({
            where: { email },
            include: { freelancerProfile: true }
        });

        if (!user || !user.freelancerProfile) {
            console.error("User or profile not found for seeding.");
            return;
        }

        const profileId = user.freelancerProfile.id;

        console.log(`Seeding achievements for profile: ${profileId}`);

        const achievements = [
            { title: 'Man of the Match', company: 'District Finals 2024' },
            { title: 'Best Bowler', company: 'State Championship' },
            { title: 'Centurion (105*)', company: 'Club League' },
            { title: 'Team Captain', company: 'City XI' },
            { title: 'Under-19 Selection', company: 'National Camp' }
        ];

        for (const ach of achievements) {
            await prisma.achievement.create({
                data: {
                    title: ach.title,
                    company: ach.company,
                    profileId: profileId
                }
            });
        }

        console.log("Successfully added 5 sample achievements.");

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
