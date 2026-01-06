
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        select: { id: true, email: true, phone: true, name: true, createdAt: true, updatedAt: true }
    })
    console.log('Recent Users:', JSON.stringify(users, null, 2))
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
