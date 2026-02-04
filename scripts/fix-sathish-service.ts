
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Searching for "fitness trainer" service with price 234...')
        const service = await prisma.service.findFirst({
            where: {
                title: { contains: 'fitness trainer', mode: 'insensitive' },
                price: 234,
                isActive: true
            }
        })

        if (service) {
            console.log(`Found service: ${service.title} (ID: ${service.id})`)
            console.log(`Current Status: ${service.isActive ? 'Active' : 'Inactive'}`)

            console.log('Marking service as inactive...')
            await prisma.service.update({
                where: { id: service.id },
                data: { isActive: false }
            })
            console.log('Service marked as inactive.')
        } else {
            console.log('No active service found with title "fitness trainer" and price 234.')
        }

    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
