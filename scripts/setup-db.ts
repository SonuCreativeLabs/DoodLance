import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up Database...')

  try {
    // Test the connection
    await prisma.$connect()
    console.log('✅ Connected to Database')

    // Create initial categories with required fields
    const categories: Array<{ name: string; slug: string; description: string; icon: string }> = [
      // Categories removed as per requirements - using comprehensive seed data instead
    ]

    for (const category of categories) {
      await prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: category,
      })
    }

    console.log('✅ Created initial categories')

    // Create sample users (for testing)
    const sampleUsers = [
      {
        email: 'client@example.com',
        name: 'John Client',
        role: 'client',
        currentRole: 'client',
        phone: '+1234567890',
        location: 'Chennai, TN',
        coords: [80.2707, 13.0338],
        referralCode: 'CLIENT2024',
        isVerified: true,
      },
      {
        email: 'freelancer@example.com',
        name: 'Sarah Freelancer',
        role: 'freelancer',
        currentRole: 'freelancer',
        phone: '+1234567891',
        location: 'Chennai, TN',
        coords: [80.2279, 13.0418],
        bio: 'Experienced service provider with 5+ years in the industry',
        referralCode: 'SARAH2024',
        isVerified: true,
      }
    ]

    for (const userData of sampleUsers) {
      await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData,
      })
    }

    console.log('✅ Created sample users')

    console.log('🎉 Database setup complete!')

  } catch (error) {
    console.error('❌ Database setup failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
