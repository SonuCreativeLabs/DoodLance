import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing required environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function clearLocalStorage() {
  console.log('🧹 Clearing localStorage...');
  try {
    const localStorageKeys = [
      'userSkills',
      'personalDetails',
      'experiences',
      'services',
      'clientServices',
      'freelancerProfile',
      'userProfile',
      'auth-token',
      'sb-access-token',
      'sb-refresh-token'
    ];

    // Clear all localStorage items
    if (typeof window !== 'undefined') {
      localStorage.clear();
      console.log('✅ Cleared all localStorage');
    } else {
      console.log('⚠️  Not in browser environment, localStorage not cleared');
    }
  } catch (error) {
    console.error('❌ Error clearing localStorage:', error);
  }
}

async function clearSessionStorage() {
  console.log('🧹 Clearing sessionStorage...');
  try {
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
      console.log('✅ Cleared all sessionStorage');
    } else {
      console.log('⚠️  Not in browser environment, sessionStorage not cleared');
    }
  } catch (error) {
    console.error('❌ Error clearing sessionStorage:', error);
  }
}

async function clearIndexedDB() {
  console.log('🧹 Clearing IndexedDB...');
  try {
    if (typeof window !== 'undefined' && window.indexedDB) {
      const databases = await window.indexedDB.databases();
      for (const db of databases) {
        if (db.name) {
          window.indexedDB.deleteDatabase(db.name);
          console.log(`   - Deleted IndexedDB: ${db.name}`);
        }
      }
      console.log('✅ Cleared all IndexedDB databases');
    } else {
      console.log('⚠️  Not in browser environment or IndexedDB not supported');
    }
  } catch (error) {
    console.error('❌ Error clearing IndexedDB:', error);
  }
}

async function clearCacheStorage() {
  console.log('🧹 Clearing Cache Storage...');
  try {
    if (typeof window !== 'undefined' && 'caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log(`✅ Cleared ${cacheNames.length} cache(s)`);
    } else {
      console.log('⚠️  Not in browser environment or Cache API not supported');
    }
  } catch (error) {
    console.error('❌ Error clearing Cache Storage:', error);
  }
}

async function resetContextProviders() {
  console.log('🔄 Resetting context providers...');
  
  // List of context files to reset
  const contextFiles = [
    'src/contexts/PersonalDetailsContext.tsx',
    'src/contexts/SkillsContext.tsx',
    'src/contexts/ExperienceContext.tsx',
    'src/contexts/ServicesContext.tsx',
    'src/contexts/ClientServicesContext.tsx'
  ];

  // These are the default/initial values we want to ensure are empty/clean
  const defaultValues = {
    PersonalDetailsContext: {
      name: "",
      title: "",
      location: "",
      about: "",
      bio: "",
      avatarUrl: "",
      coverImageUrl: "",
      online: false,
      readyToWork: false,
      dateOfBirth: ""
    },
    SkillsContext: {
      skills: []
    },
    ExperienceContext: {
      experiences: []
    },
    ServicesContext: {
      services: []
    },
    ClientServicesContext: {
      services: []
    }
  };

  for (const file of contextFiles) {
    try {
      const filePath = path.join(process.cwd(), file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Get the context name from the file name
      const contextName = file.split('/').pop()?.replace('.tsx', '').replace('Context', '') || '';
      
      // Update the default values if they exist
      if (defaultValues[contextName as keyof typeof defaultValues]) {
        const defaultValue = defaultValues[contextName as keyof typeof defaultValues];
        const defaultValueStr = JSON.stringify(defaultValue, null, 2);
        
        // Find and replace the default/initial values
        content = content.replace(
          /(const\s+(initial|default)\w*\s*=\s*){([^}]*)}/s,
          `const ${contextName.charAt(0).toLowerCase() + contextName.slice(1)}Data = ${defaultValueStr}`
        );
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated default values in ${file}`);
      }
    } catch (error) {
      console.error(`❌ Error updating ${file}:`, error);
    }
  }
}

async function main() {
  console.log('🚀 Starting cleanup process...');
  
  // Clear browser storage
  await clearLocalStorage();
  await clearSessionStorage();
  await clearIndexedDB();
  await clearCacheStorage();
  
  // Reset context providers
  await resetContextProviders();
  
  console.log('\n✨ Cleanup complete!');
  console.log('\n🔁 Please do the following to ensure all changes take effect:');
  console.log('   1. Stop your development server if it\'s running');
  console.log('   2. Clear your browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)');
  console.log('   3. Restart your development server');
  console.log('   4. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)');
}

main().catch(console.error);
