const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function cleanupTestUsers() {
    console.log('🧹 Cleaning up test users...')

    const testEmails = [
        'csk@doodlance.com',
        'tnca@doodlance.com',
        'annaclub@doodlance.com',
        'arjun.mehta@doodlance.com',
        'cca@doodlance.com',
        'ccl@doodlance.com',
        'ncc@doodlance.com',
        'velachery@doodlance.com',
        'client@doodlance.com',
        'freelancer@doodlance.com',
        'bowler@doodlance.com'
    ]

    try {
        await prisma.$connect()

        for (const email of testEmails) {
            const user = await prisma.user.findUnique({ where: { email } })

            if (user) {
                console.log(`Deleting user: ${email} (${user.id})`)

                // Manual Clean up dependencies first (similar to our delete route logic)

                // 1. Client Profile
                await prisma.clientProfile.deleteMany({ where: { userId: user.id } })

                // 2. Jobs
                const jobs = await prisma.job.findMany({ where: { clientId: user.id }, select: { id: true } })
                const jobIds = jobs.map(j => j.id)
                if (jobIds.length > 0) {
                    await prisma.application.deleteMany({ where: { jobId: { in: jobIds } } })
                    await prisma.job.deleteMany({ where: { id: { in: jobIds } } })
                }

                // 3. Freelancer Profile
                const freelancerProfile = await prisma.freelancerProfile.findUnique({ where: { userId: user.id } })
                if (freelancerProfile) {
                    await prisma.achievement.deleteMany({ where: { profileId: freelancerProfile.id } })
                    await prisma.portfolio.deleteMany({ where: { profileId: freelancerProfile.id } })
                    await prisma.review.deleteMany({ where: { profileId: freelancerProfile.id } })
                    await prisma.freelancerProfile.delete({ where: { id: freelancerProfile.id } })
                }

                // 4. Conversations
                const conversations = await prisma.conversation.findMany({
                    where: { OR: [{ clientId: user.id }, { freelancerId: user.id }] },
                    select: { id: true }
                })
                const conversationIds = conversations.map(c => c.id)
                if (conversationIds.length > 0) {
                    await prisma.message.deleteMany({ where: { conversationId: { in: conversationIds } } })
                    await prisma.conversation.deleteMany({ where: { id: { in: conversationIds } } })
                }

                // 5. Wallet
                const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } })
                if (wallet) {
                    await prisma.transaction.deleteMany({ where: { walletId: wallet.id } })
                    await prisma.wallet.delete({ where: { id: wallet.id } })
                }

                // 6. Delete User
                await prisma.user.delete({ where: { id: user.id } })
                console.log(`✅ Deleted ${email}`)
            } else {
                console.log(`⚠️ User not found: ${email}`)
            }
        }

        console.log('✅ Cleanup complete!')

    } catch (error) {
        console.error('❌ Cleanup failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

cleanupTestUsers()
