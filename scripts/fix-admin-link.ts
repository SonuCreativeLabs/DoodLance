const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixAdminLink() {
    const email = 'sathishraj@doodlance.com'
    const correctSupabaseUid = '5ecc444d-f72e-4ff5-8371-84495638d879'

    console.log(`🛠️ Fixing admin link for: ${email}`)
    console.log(`Target Supabase UID: ${correctSupabaseUid}`)

    try {
        // 1. Verify user exists
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            console.error('❌ User not found!')
            return
        }

        console.log(`Found user ID: ${user.id}`)
        console.log(`Current Supabase UID: ${user.supabaseUid}`)

        // 2. Update Supabase UID
        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                supabaseUid: correctSupabaseUid
            }
        })

        console.log('✅ Successfully updated Supabase UID!')
        console.log('New Record:', {
            id: updatedUser.id,
            email: updatedUser.email,
            supabaseUid: updatedUser.supabaseUid,
            role: updatedUser.role
        })

    } catch (error) {
        console.error('❌ Error updating user:', error)
    } finally {
        await prisma.$disconnect()
    }
}

fixAdminLink()
