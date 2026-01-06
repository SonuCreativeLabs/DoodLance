const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createMockUser() {
    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: 'user_123' }
        })

        if (existingUser) {
            console.log('User already exists:', existingUser)
            return
        }

        // Create the mock user
        const user = await prisma.user.create({
            data: {
                id: 'user_123',
                email: 'client@example.com',
                name: 'Demo Client',
                role: 'client',
                currentRole: 'client',
                coords: '[0,0]',
                isVerified: true,
            }
        })

        console.log('Created user:', user)
    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

createMockUser()
