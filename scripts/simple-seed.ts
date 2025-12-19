import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting simple seed...')
  
  // Create a test client user with ID matching mock auth
  const client = await prisma.user.upsert({
    where: { id: 'user_123' },
    update: {
      email: 'client@example.com',
      name: 'Demo Client',
      role: 'client',
      currentRole: 'client',
    },
    create: {
      id: 'user_123',
      email: 'client@example.com',
      name: 'Demo Client',
      role: 'client',
      currentRole: 'client',
      phone: '+91 9876543210',
      location: 'Chennai, Tamil Nadu',
      coords: JSON.stringify([80.2707, 13.0338]),
      bio: 'Demo client for job posting',
      isVerified: true,
    },
  })
  
  console.log('✅ Created demo client:', client.email, '(ID:', client.id, ')')
  
  // Create a test freelancer user
  const freelancer = await prisma.user.upsert({
    where: { email: 'freelancer@test.com' },
    update: {},
    create: {
      email: 'freelancer@test.com',
      name: 'Test Freelancer',
      role: 'freelancer',
      currentRole: 'freelancer',
      phone: '+91 9876543211',
      location: 'Chennai, Tamil Nadu',
      coords: JSON.stringify([80.2279, 13.0418]),
      bio: 'Test freelancer',
      isVerified: true,
    },
  })
  
  console.log('✅ Created test freelancer:', freelancer.email)
  
  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
