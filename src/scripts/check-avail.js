
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const profiles = await prisma.freelancerProfile.findMany({
            where: { id: "cmk1kdk800003kwfkzm79c5tj" },
            select: { availability: true }
        });
        console.log(JSON.stringify(profiles, null, 2));
    } catch (e) {
        console.error(e);
    }
}

main()
    .finally(async () => {
        await prisma.$disconnect();
    });
