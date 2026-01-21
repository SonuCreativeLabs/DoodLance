const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function inspectAdmin() {
    const email = 'sathishraj@doodlance.com'
    console.log(`🔍 Inspecting potential admin: ${email}`)

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                wallet: true,
                _count: {
                    select: {
                        bookings: true,
                        clientJobs: true
                    }
                }
            }
        })

        if (user) {
            console.log('\n👤 User Details:')
            console.log(`ID: ${user.id}`)
            console.log(`Supabase UID: ${user.supabaseUid}`)
            console.log(`Role: ${user.role}`) // checking if 'admin'
            console.log(`Bookings: ${user._count.bookings}`)
            console.log(`Posted Jobs: ${user._count.jobs}`)
            console.log(`Wallet Balance: ${user.wallet ? user.wallet.balance : 'No Wallet'}`)
        } else {
            console.log('User not found.')
        }

    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

inspectAdmin()
