import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedCleanData() {
  console.log('🌱 Seeding database with clean structure (no mock data)...')
  
  try {
    await prisma.$connect()
    console.log('✅ Connected to database')
    
    // 1. Create Categories (essential for app structure)
    console.log('\n📂 Creating categories...')
    const categories = [
      { name: 'Playing Services', slug: 'playing', description: 'Cricket playing services including match players, net bowlers, and specialists', icon: '🏏' },
      { name: 'Coaching & Training', slug: 'coaching', description: 'Professional cricket coaching and training services', icon: '👨‍🏫' },
      { name: 'Support Staff', slug: 'support', description: 'Cricket support services like analysts, physios, and scorers', icon: '📊' },
      { name: 'Media & Content', slug: 'media', description: 'Cricket photography, videography, and content creation', icon: '📷' },
    ]
    
    for (const category of categories) {
      await prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: category,
      })
    }
    console.log(`✅ Created ${categories.length} categories`)
    
    console.log('\n🎉 Database seeding complete!')
    console.log('\n📊 Summary:')
    console.log(`   - ${categories.length} categories (no mock data)`)
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedCleanData()
