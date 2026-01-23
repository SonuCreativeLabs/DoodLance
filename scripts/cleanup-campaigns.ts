import prisma from '../src/lib/db';

async function cleanupCampaigns() {
    try {
        console.log('🧹 Cleaning up all existing campaigns...');

        // Get all campaign users
        const campaigns = await prisma.campaign.findMany({
            select: { userId: true, referralCode: true }
        });

        console.log(`Found ${campaigns.length} campaigns to delete`);

        // Delete campaigns first
        await prisma.campaign.deleteMany({});
        console.log('✅ Deleted all campaigns');

        // Delete campaign users
        const userIds = campaigns.map(c => c.userId).filter(Boolean) as string[];
        if (userIds.length > 0) {
            await prisma.user.deleteMany({
                where: { id: { in: userIds } }
            });
            console.log(`✅ Deleted ${userIds.length} campaign users`);
        }

        console.log('✨ Cleanup complete!');

    } catch (error) {
        console.error('❌ Error during cleanup:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanupCampaigns();
