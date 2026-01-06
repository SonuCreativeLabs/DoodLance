
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const profiles = await prisma.freelancerProfile.findMany({
        select: {
            id: true,
            userId: true,
            skills: true,
            user: {
                select: {
                    email: true,
                    name: true,
                    id: true
                }
            }
        }
    });

    console.log("Found profiles:", profiles.length);
    profiles.forEach(p => {
        console.log(`\nUser: ${p.user.name} (${p.user.email}) [ID: ${p.userId}]`);
        console.log(`Skills Raw:`, p.skills);
        try {
            console.log(`Skills Parsed:`, JSON.parse(p.skills));
        } catch (e) {
            console.log(`Skills Parse Error:`, e.message);
        }
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
