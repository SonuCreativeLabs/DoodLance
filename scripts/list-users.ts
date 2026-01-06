require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function listUsers() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            supabaseUid: true,
            createdAt: true
        }
    })
    console.log('--- ALL USERS ---')
    users.forEach((u: any) => {
        console.log(`- ${u.email} (ID: ${u.id})`)
    })
    console.log('-----------------')
}

listUsers()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
