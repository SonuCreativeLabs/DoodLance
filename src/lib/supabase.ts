import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Define the database schema type for better TypeScript support
type Database = {}

let supabase: SupabaseClient<Database> | null = null

// Only initialize Supabase if the required environment variables are present
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  try {
    console.log('Initializing Supabase client with URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    
    supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
        },
        global: {
          headers: {
            'X-Client-Info': 'doodlance-web-app',
          },
        },
      }
    )
    
    console.log('Supabase client initialized successfully')
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error)
  }
} else {
  console.warn('Supabase client not initialized - missing environment variables')
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) console.warn('Missing: NEXT_PUBLIC_SUPABASE_URL')
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) console.warn('Missing: NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export { supabase }