const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function inspectDebug() {
    console.log('🔍 Inspecting Referral System Debug Data...')

    try {
        // 1. Check Sequence
        const config = await prisma.systemConfig.findUnique({ where: { key: 'NEXT_REFERRAL_SEQUENCE' } })
        console.log('\n🔢 Current Sequence in DB:', config)

        // 2. Check "Random Code" Users
        const randomCodeUsers = await prisma.user.findMany({
            where: {
                referralCode: {
                    not: {
                        startsWith: 'BAILS'
                    }
                }
            },
            take: 5,
            select: {
                id: true,
                email: true,
                referralCode: true,
                createdAt: true
            }
        })
        console.log('\n🎲 Users with non-BAILS codes:', JSON.stringify(randomCodeUsers, null, 2))

        // 3. Check the Mismatched User (sathishraj@doodlance.com)
        const mismatchUser = await prisma.user.findUnique({
            where: { email: 'sathishraj@doodlance.com' },
            select: {
                id: true,
                email: true,
                referralCode: true,
                supabaseUid: true
            }
        })
        console.log('\n⚠️ Mismatched User found in DB:', mismatchUser)

    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

inspectDebug()
