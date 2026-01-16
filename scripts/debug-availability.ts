
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const userId = 'c2d242d3-34e7-426e-bf47-a398932543d8'; // Sathishraj
    console.log(`Fetching profile for userId: ${userId}`);

    const profile = await prisma.freelancerProfile.findUnique({
        where: { userId: userId },
        select: { id: true, availability: true }
    });

    if (!profile) {
        console.log("Profile not found!");
        return;
    }

    console.log("Found Profile ID:", profile.id);
    console.log("Raw Availability Type:", typeof profile.availability);

    let avail = profile.availability;
    if (typeof avail === 'string') {
        try {
            avail = JSON.parse(avail);
            console.log("Parsed string availability");
        } catch (e) {
            console.log("Failed to parse string availability");
        }
    }

    console.log("Availability Value:", JSON.stringify(avail, null, 2));

    if (Array.isArray(avail)) {
        avail.forEach((day: any) => {
            if (day.available) {
                console.log(`Day: ${day.day || day.name || day.id} (${day.available})`);
                console.log(`  Slots:`, day.timeSlots);
            }
        });
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
