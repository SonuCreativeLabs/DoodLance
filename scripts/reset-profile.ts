const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

const EMAIL = 'sonucreativelabs@gmail.com';

async function resetProfile() {
    console.log('--- Resetting Profile Data from "Test" ---')

    const user = await prisma.user.findUnique({
        where: { email: EMAIL }
    });

    if (!user) return console.log("User not found");

    // Reset User Name
    await prisma.user.update({
        where: { id: user.id },
        data: {
            name: 'Sonu CreativeLabs', // More respectful default
            location: 'Chennai, India'
        }
    });

    // Reset Profile
    await prisma.freelancerProfile.update({
        where: { userId: user.id },
        data: {
            title: 'Professional Freelancer',
            about: 'I am a passionate freelancer ready to work on your projects.',
            cricketRole: null, // Clear these specific test values
            battingStyle: null,
            bowlingStyle: null,
            // Keep other data safe or reset if "Test"
        }
    });
    console.log('✅ Profile Reset to Defaults');
}

resetProfile()
    .catch((e: any) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
