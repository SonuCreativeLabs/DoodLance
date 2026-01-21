const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function inspectUsers() {
    console.log('🔍 Inspecting users with codes BAILS1 and BAILS2...')

    try {
        const users = await prisma.user.findMany({
            where: {
                referralCode: {
                    in: ['BAILS1', 'BAILS2']
                }
            },
            select: {
                id: true,
                email: true,
                name: true,
                referralCode: true,
                supabaseUid: true,
                createdAt: true,
                role: true
            }
        })

        console.log(JSON.stringify(users, null, 2))
    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

inspectUsers()
