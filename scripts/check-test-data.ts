import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing required environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkForTestData() {
  console.log('🔍 Checking for test data in Supabase...');
  
  try {
    // Check client profiles table
    console.log('\n📋 Checking client_profiles table...');
    let clientProfiles: any[] = [];
    try {
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .or('name.ilike.%test%,name.ilike.%example%,name.ilike.%demo%,name.ilike.%sathish%')
        .limit(100);
      
      if (error) throw error;
      clientProfiles = data || [];
      
      if (clientProfiles.length > 0) {
        console.log(`⚠️  Found ${clientProfiles.length} potential test client profiles:`);
        clientProfiles.forEach(profile => {
          console.log(`   - ID: ${profile.id}, Name: ${profile.name || 'N/A'}, Email: ${profile.email || 'N/A'}`);
        });
      } else {
        console.log('✅ No test client profiles found');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`⚠️  Could not check client_profiles table: ${errorMessage}`);
    }
    
    
    // Check freelancer_profiles table
    console.log('\n📋 Checking freelancer_profiles table...');
    const { data: freelancerProfiles, error: freelancerProfilesError } = await supabase
      .from('freelancer_profiles')
      .select('*')
      .or('name.ilike.%test%,name.ilike.%example%,name.ilike.%demo%,name.ilike.%sathish%')
      .limit(100);
    
    if (freelancerProfilesError) throw freelancerProfilesError;
    
    if (freelancerProfiles.length > 0) {
      console.log(`⚠️  Found ${freelancerProfiles.length} potential test freelancer profiles:`);
      freelancerProfiles.forEach(profile => {
        console.log(`   - ID: ${profile.id}, Name: ${profile.name || 'N/A'}, Title: ${profile.title || 'N/A'}`);
      });
    } else {
      console.log('✅ No test freelancer profiles found');
    }
    
    // Check auth.users table (only basic info, as auth.users has restricted access)
    console.log('\n📋 Checking auth.users table (limited access)...');
    const { data: authUsers, error: authUsersError } = await supabase
      .from('users')
      .select('id, email, created_at')
      .or('email.ilike.%@example.com,email.ilike.%@test.com,email.ilike.%@demo.com,email.ilike.%@temp.com')
      .limit(100);
    
    if (authUsersError) {
      console.log('⚠️  Could not check auth.users table (permission denied). Check Supabase dashboard manually.');
    } else if (authUsers && authUsers.length > 0) {
      console.log(`⚠️  Found ${authUsers.length} potential test auth users:`);
      authUsers.forEach(user => {
        console.log(`   - ID: ${user.id}, Email: ${user.email}`);
      });
    } else {
      console.log('✅ No test auth users found');
    }
    
    console.log('\n🔍 Check complete!');
    
    if (clientProfiles.length > 0 || freelancerProfiles.length > 0 || (authUsers && authUsers.length > 0)) {
      console.log('\n🚨 Test data found! Run `npx tsx scripts/clean-test-data.ts` to remove it.');
    } else {
      console.log('\n✨ No test data found in the database!');
    }
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error checking for test data:', errorMessage);
    if (error instanceof Error && 'code' in error) {
      console.error('Error code:', (error as any).code);
    }
    process.exit(1);
  }
}

checkForTestData();
