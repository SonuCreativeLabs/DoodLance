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

async function diagnoseDatabase() {
  console.log('🔍 Diagnosing Supabase database structure and data...');
  console.log(`📍 Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
  
  try {
    // 1. List all tables in the public schema
    console.log('\n📋 Listing all tables in public schema...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE');
    
    if (tablesError) {
      console.log('⚠️  Could not list tables:', tablesError.message);
      // Try alternative approach
      console.log('\n🔄 Trying to access common table names directly...');
      
      const commonTables = [
        'profiles',
        'user_profiles', 
        'client_profiles',
        'freelancer_profiles',
        'users',
        'auth.users'
      ];
      
      for (const tableName of commonTables) {
        try {
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);
          
          if (!error) {
            console.log(`✅ Found table: ${tableName}`);
            // Check if it has test data
            const { data: testData, error: testError } = await supabase
              .from(tableName)
              .select('*')
              .or('name.ilike.%test%,name.ilike.%example%,name.ilike.%demo%,name.ilike.%sathish%,full_name.ilike.%test%,full_name.ilike.%example%,full_name.ilike.%demo%,full_name.ilike.%sathish%')
              .limit(10);
            
            if (!testError && testData && testData.length > 0) {
              console.log(`   ⚠️  Found ${testData.length} potential test records in ${tableName}`);
              testData.forEach((record: any, index: number) => {
                console.log(`     ${index + 1}. ID: ${record.id}, Name: ${record.name || record.full_name || 'N/A'}`);
              });
            }
          }
        } catch (e) {
          // Table doesn't exist or no access
        }
      }
    } else {
      console.log(`✅ Found ${tables.length} tables:`);
      tables.forEach((table: any) => {
        console.log(`   - ${table.table_name}`);
      });
    }
    
    // 2. Check localStorage/sessionStorage patterns in the app
    console.log('\n🔍 Checking for hardcoded data in the codebase...');
    const fs = await import('fs');
    const path = await import('path');
    
    function searchInFiles(dir: string, searchTerm: string, extensions: string[] = ['.ts', '.tsx', '.js', '.jsx']) {
      const results: string[] = [];
      
      function walkDir(currentDir: string) {
        const files = fs.readdirSync(currentDir);
        
        for (const file of files) {
          const filePath = path.join(currentDir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            walkDir(filePath);
          } else if (stat.isFile() && extensions.some(ext => file.endsWith(ext))) {
            try {
              const content = fs.readFileSync(filePath, 'utf8');
              if (content.toLowerCase().includes(searchTerm.toLowerCase())) {
                results.push(filePath);
              }
            } catch (e) {
              // Skip files that can't be read
            }
          }
        }
      }
      
      walkDir(dir);
      return results;
    }
    
    const searchTerms = ['sathish', 'test', 'example', 'demo'];
    for (const term of searchTerms) {
      const files = searchInFiles(path.join(process.cwd(), 'src'), term);
      if (files.length > 0) {
        console.log(`\n📄 Found "${term}" in ${files.length} files:`);
        files.slice(0, 5).forEach(file => {
          console.log(`   - ${file}`);
        });
        if (files.length > 5) {
          console.log(`   ... and ${files.length - 5} more files`);
        }
      }
    }
    
    // 3. Check context providers for initial data
    console.log('\n🔍 Checking context providers for initial data...');
    const contextFiles = [
      'src/contexts/PersonalDetailsContext.tsx',
      'src/contexts/SkillsContext.tsx',
      'src/contexts/ExperienceContext.tsx',
      'src/contexts/ServicesContext.tsx',
      'src/contexts/ClientServicesContext.tsx'
    ];
    
    for (const contextFile of contextFiles) {
      try {
        const content = fs.readFileSync(path.join(process.cwd(), contextFile), 'utf8');
        if (content.includes('const initial') || content.includes('const default')) {
          console.log(`   📄 ${contextFile} - has initial/default data`);
        }
      } catch (e) {
        // File doesn't exist
      }
    }
    
    console.log('\n✨ Diagnosis complete!');
    console.log('\n💡 If you see data on the frontend but not in the database, it might be:');
    console.log('   - Stored in localStorage/sessionStorage');
    console.log('   - Coming from context providers with default values');
    console.log('   - Cached in the browser');
    console.log('   - Coming from a different table or data source');
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error during diagnosis:', errorMessage);
    if (error instanceof Error && 'code' in error) {
      console.error('Error code:', (error as any).code);
    }
    process.exit(1);
  }
}

diagnoseDatabase();
