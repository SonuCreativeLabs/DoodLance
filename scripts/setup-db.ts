import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up MongoDB database...')
  
  try {
    // Test the connection
    await prisma.$connect()
    console.log('✅ Connected to MongoDB')
    
    // Create initial categories
    const categories = [
      { name: 'Cricket Coaching', description: 'Professional cricket training and coaching', icon: 'cricket' },
      { name: 'Home Cleaning', description: 'Professional home cleaning services', icon: 'cleaning' },
      { name: 'AC Repair', description: 'Air conditioning repair and maintenance', icon: 'ac' },
      { name: 'Plumbing', description: 'Professional plumbing services', icon: 'plumbing' },
      { name: 'Electrical', description: 'Electrical repair and installation', icon: 'electrical' },
      { name: 'Beauty & Wellness', description: 'Beauty treatments and wellness services', icon: 'beauty' },
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
