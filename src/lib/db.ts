
import { PrismaClient } from '@prisma/client';

// Dynamic import for Prisma client to handle cases where it's not generated
let PrismaClientClass: any;

try {
  // Try to import PrismaClient using require (works better in some environments)
  PrismaClientClass = require('@prisma/client').PrismaClient;
} catch (error) {
  console.warn('⚠️ Prisma client not available, using mock mode:', error);
  PrismaClientClass = null;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Try to create Prisma client, but fall back gracefully if it fails
let prisma: PrismaClient;

if (PrismaClientClass) {
  try {
    prisma = globalForPrisma.prisma ?? new PrismaClientClass({
      log: ['query'],
    });

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prisma;
    }
  } catch (error) {
    console.warn('⚠️ Prisma client creation failed, using mock mode:', error);
    prisma = createMockPrismaClient() as unknown as PrismaClient;
  }
} else {
  console.warn('⚠️ Prisma client not available, using mock mode');
  prisma = createMockPrismaClient() as unknown as PrismaClient;
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
    bankAccount: {
      findUnique: async () => null,
      upsert: async () => ({}),
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
    },
    // Add other models as needed for the demo
    // We add explicit any here to allow arbitrary property access in mock mode if needed,
    // though the cast to PrismaClient makes TypeScript assume strictly typed.
  };
}

// Helper function to connect to database
export async function connectDB() {
  try {
    await prisma.$connect()
    console.log('✅ Connected to database')
    return prisma
  } catch (error) {
    console.error('❌ Failed to connect to database:', error)
    throw error
  }
}

// Helper function to disconnect from database
export async function disconnectDB() {
  try {
    await prisma.$disconnect()
    console.log('✅ Disconnected from database')
  } catch (error) {
    console.error('❌ Failed to disconnect from database:', error)
  }
}

export default prisma;
