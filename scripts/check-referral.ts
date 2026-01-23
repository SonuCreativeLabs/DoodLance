import prisma from '../src/lib/db';

async function checkUser() {
    const user = await prisma.user.findUnique({
        where: { email: 'sonudxplorer@gmail.com' },
        select: {
            id: true,
            email: true,
            name: true,
            referredBy: true,
            referralCode: true,
            createdAt: true
        }
    });

    console.log('User data:', user);

    if (user?.referredBy) {
        // Check if there's a matching campaign
        const campaign = await prisma.campaign.findFirst({
            where: {
                referralCode: {
                    equals: user.referredBy,
                    mode: 'insensitive'
                }
            }
        });
        console.log('Matching campaign:', campaign);
    }

    await prisma.$disconnect();
}

checkUser();
