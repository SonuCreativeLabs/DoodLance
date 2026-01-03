const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function deleteMocks() {
    const safeEmails = [
        'sonucreativelabs@gmail.com',
        'sonuofficials07@gmail.com'
    ].map(e => e.toLowerCase().trim());

    console.log('--- SAFETY PROTOCOL ---');
    console.log('Preserving users:', safeEmails);
    console.log('-----------------------');

    const users = await prisma.user.findMany({ select: { id: true, email: true } })

    const usersToKeep = users.filter((u: any) => safeEmails.includes(u.email.toLowerCase()));
    const usersToDelete = users.filter((u: any) => !safeEmails.includes(u.email.toLowerCase()));

    console.log(`\nScan Results:`);
    console.log(`- Total Users: ${users.length}`);
    console.log(`- SAFE Users Found: ${usersToKeep.length}`);
    console.log(`- MOCK Users to Delete: ${usersToDelete.length}`);

    if (usersToDelete.length === 0) {
        console.log("\n✅ No mock users found to delete.");
        return;
    }

    console.log("\n⚠️  Starting Deletion...");
    for (const u of usersToDelete) {
        console.log(`Processing ${u.email} (${u.id})...`);
        try {
            // 1. Delete Notifications
            try { await prisma.notification.deleteMany({ where: { userId: u.id } }); } catch (e) { }

            // 2 & 2b. Delete Wallets & Transactions
            try {
                const wallets = await prisma.wallet.findMany({ where: { userId: u.id }, select: { id: true } });
                if (wallets.length > 0) {
                    const walletIds = wallets.map((w: any) => w.id);
                    try { await prisma.transaction.deleteMany({ where: { walletId: { in: walletIds } } }); } catch (e) { }
                    await prisma.wallet.deleteMany({ where: { userId: u.id } });
                }
            } catch (e) { }

            // 3. Delete Chat (Messages/Conversations)
            try {
                const conversations = await prisma.conversation.findMany({
                    where: { OR: [{ clientId: u.id }, { freelancerId: u.id }] },
                    select: { id: true }
                });
                if (conversations.length > 0) {
                    const convIds = conversations.map((c: any) => c.id);
                    try { await prisma.message.deleteMany({ where: { conversationId: { in: convIds } } }); } catch (e) { }
                    try { await prisma.conversation.deleteMany({ where: { id: { in: convIds } } }); } catch (e) { }
                }
                try { await prisma.message.deleteMany({ where: { senderId: u.id } }); } catch (e) { }
            } catch (e) { }

            // 4. Delete Client Profile
            try { await prisma.clientProfile.deleteMany({ where: { userId: u.id } }); } catch (e) { }

            // 5. Delete Freelancer Profile & Children
            try {
                const profile = await prisma.freelancerProfile.findUnique({ where: { userId: u.id } });
                if (profile) {
                    try { await prisma.experience.deleteMany({ where: { profileId: profile.id } }); } catch (e) { }
                    try { await prisma.portfolio.deleteMany({ where: { profileId: profile.id } }); } catch (e) { }
                    try { await prisma.review.deleteMany({ where: { profileId: profile.id } }); } catch (e) { }
                    try { await prisma.freelancerProfile.delete({ where: { id: profile.id } }); } catch (e) { }
                }
            } catch (e) { }

            // 6. Delete Reviews written by user (as client)
            try { await prisma.review.deleteMany({ where: { clientId: u.id } }); } catch (e) { }

            // 7. Delete Jobs & Children
            try {
                const jobs = await prisma.job.findMany({ where: { clientId: u.id }, select: { id: true } });
                if (jobs.length > 0) {
                    const jobIds = jobs.map((j: any) => j.id);
                    try { await prisma.application.deleteMany({ where: { jobId: { in: jobIds } } }); } catch (e) { }
                    try { await prisma.booking.deleteMany({ where: { jobId: { in: jobIds } } }); } catch (e) { }
                    try { await prisma.proposal.deleteMany({ where: { jobId: { in: jobIds } } }); } catch (e) { }
                    try { await prisma.job.deleteMany({ where: { clientId: u.id } }); } catch (e) { }
                }
            } catch (e) { }

            // 8. Delete Services provided by user
            try { await prisma.service.deleteMany({ where: { providerId: u.id } }); } catch (e) { }

            // 9. Delete User
            await prisma.user.delete({ where: { id: u.id } });
            console.log(`✅ Deleted ${u.email}`);

        } catch (e: any) {
            console.error(`❌ Failed to delete ${u.email}:`, e.message);
        }
    }

    console.log("\n✅ Cleanup complete.");
}

deleteMocks()
    .catch((e: any) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
