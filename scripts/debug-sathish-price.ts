
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Searching for users with "Sathish"...')
        const users = await prisma.user.findMany({
            where: {
                name: {
                    contains: 'Sathish',
                    mode: 'insensitive'
                }
            },
            include: {
                freelancerProfile: true,
                services: true
            }
        })

        console.log(`Found ${users.length} users.`)

        for (const user of users) {
            console.log(`\nUser: ${user.name} (${user.email})`)
            console.log(`Profile Hourly Rate: ${user.freelancerProfile?.hourlyRate}`)
            console.log('Services:')
            if (user.services.length === 0) {
                console.log('  No services found.')
            }
            for (const service of user.services) {
                console.log(`  - ${service.title}: ${service.price}`)
            }
        }

        console.log('\nSearching for any service with price 234...')
        const cheapServices = await prisma.service.findMany({
            where: {
                price: 234
            },
            include: {
                provider: true
            }
        })

        if (cheapServices.length > 0) {
            console.log(`Found ${cheapServices.length} services with price 234:`)
            for (const s of cheapServices) {
                console.log(`  - ${s.title} by ${s.provider.name}`)
            }
        } else {
            console.log('No services found with price 234.')
        }

    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
