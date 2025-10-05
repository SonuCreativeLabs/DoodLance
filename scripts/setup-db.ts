import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up MongoDB database...')
  
  try {
    // Test the connection
    await prisma.$connect()
    console.log('✅ Connected to MongoDB')
    
    // Create initial categories
    const categories: Array<{ name: string; description: string; icon: string }> = [
      // Categories removed as per requirements
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
        phone: '+1234567890',
        location: 'Chennai, TN'
      },
      {
        email: 'freelancer@example.com', 
        name: 'Sarah Freelancer',
        role: 'freelancer',
        phone: '+1234567891',
        location: 'Chennai, TN',
        bio: 'Experienced service provider with 5+ years in the industry'
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
