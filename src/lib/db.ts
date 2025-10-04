import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Helper function to connect to database
export async function connectDB() {
  try {
    await prisma.$connect()
    console.log('✅ Connected to MongoDB')
    return prisma
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error)
    throw error
  }
}

// Helper function to disconnect from database
export async function disconnectDB() {
  try {
    await prisma.$disconnect()
    console.log('✅ Disconnected from MongoDB')
  } catch (error) {
    console.error('❌ Failed to disconnect from MongoDB:', error)
  }
}

export default prisma
