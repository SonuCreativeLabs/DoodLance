const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

const EMAIL = 'sonucreativelabs@gmail.com';

async function debugProfile() {
    console.log('--- Debugging Profile Creation ---')

    // 1. Find User
    const user = await prisma.user.findUnique({
        where: { email: EMAIL }
    });

    if (!user) {
        console.error('❌ User not found! (This implies restore failed?)');
        return;
    }
    console.log(`✅ User found: ${user.id}`);

    // 2. Try to Update User (Mimic API)
    try {
        console.log('Attempting User Update...');
        await prisma.user.update({
            where: { id: user.id },
            data: {
                name: 'Test Name',
                location: 'Test Location',
                // username: 'testuser' // Uncomment if we suspect username clash
            }
        });
        console.log('✅ User Update Success');
    } catch (e: any) {
        console.error('❌ User Update Failed:', e.message);
    }

    // 3. Try to Create/Update Profile (Mimic API)
    try {
        console.log('Attempting Profile Upsert...');

        const existingProfile = await prisma.freelancerProfile.findUnique({
            where: { userId: user.id }
        });

        if (existingProfile) {
            console.log('Profile exists, updating...');
            await prisma.freelancerProfile.update({
                where: { userId: user.id },
                data: {
                    title: 'Test Title'
                }
            });
        } else {
            console.log('Profile missing, creating...');
            await prisma.freelancerProfile.create({
                data: {
                    userId: user.id,
                    title: 'Test Title',
                    about: 'Test About',
                    cricketRole: 'Batsman',
                    battingStyle: 'Right-hand bat',
                    bowlingStyle: 'Right-arm medium',
                    hourlyRate: 30,
                    isOnline: true,
                    skills: "[]",
                    specializations: "[]",
                    availability: [],
                    dateOfBirth: new Date(),
                    // Required defaults from schema scan
                    rating: 0,
                    reviewCount: 0,
                    completedJobs: 0,
                    responseTime: '1 hour',
                    deliveryTime: '1 day',
                    completionRate: 100,
                    repeatClientRate: 0,
                    totalEarnings: 0,
                    thisMonthEarnings: 0,
                    avgProjectValue: 0,
                }
            });
        }
        console.log('✅ Profile Operation Success');

    } catch (e: any) {
        console.error('❌ Profile Operation Failed:', e);
        console.error('Meta:', e.meta);
    }
}

debugProfile()
    .catch((e: any) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
