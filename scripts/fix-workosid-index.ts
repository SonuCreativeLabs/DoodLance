import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function fixWorkosIdIndex() {
  const uri = process.env.DATABASE_URL
  if (!uri) {
    throw new Error('DATABASE_URL not found in environment variables')
  }

  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db('doodlance_db')
    const usersCollection = db.collection('users')

    // Drop the problematic index if it exists
    try {
      await usersCollection.dropIndex('users_workosId_key')
      console.log('✅ Dropped old workosId index')
    } catch (error: any) {
      if (error.code === 27) {
        console.log('ℹ️  Index does not exist, skipping drop')
      } else {
        console.log('⚠️  Error dropping index:', error.message)
      }
    }

    // Create a sparse unique index (only enforces uniqueness for non-null values)
    await usersCollection.createIndex(
      { workosId: 1 },
      { unique: true, sparse: true, name: 'users_workosId_key' }
    )
    console.log('✅ Created sparse unique index for workosId')

    console.log('🎉 Index fix complete!')
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await client.close()
  }
}

fixWorkosIdIndex()
