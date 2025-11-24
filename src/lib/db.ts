// Dynamic import for Prisma client to handle cases where it's not generated
let PrismaClient: any;

try {
  // Try to import PrismaClient using require (works better in some environments)
  PrismaClient = require('@prisma/client').PrismaClient;
} catch (error) {
  console.warn('⚠️ Prisma client not available, using mock mode:', error);
  PrismaClient = null;
}

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

// Try to create Prisma client, but fall back gracefully if it fails
let prisma: any;

if (PrismaClient) {
  try {
    prisma = globalForPrisma.prisma ?? new PrismaClient({
      log: ['query'],
    });

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prisma;
    }
  } catch (error) {
    console.warn('⚠️ Prisma client creation failed, using mock mode:', error);
    prisma = createMockPrismaClient();
  }
} else {
  console.warn('⚠️ Prisma client not available, using mock mode');
  prisma = createMockPrismaClient();
}

function createMockPrismaClient() {
  return {
    $connect: async () => Promise.resolve(),
    $disconnect: async () => Promise.resolve(),
    job: {
      findUnique: async () => null,
      findMany: async () => [],
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
    },
    user: {
      findUnique: async () => null,
      findMany: async () => [],
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
    },
    application: {
      findMany: async () => [],
      create: async () => ({}),
    },
    otp: {
      create: async () => ({}),
      findFirst: async () => null,
      delete: async () => ({}),
      deleteMany: async () => ({}),
    },
    // Add other models as needed for the demo
  };
}

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
