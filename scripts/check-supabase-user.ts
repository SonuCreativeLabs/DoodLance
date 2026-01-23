import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(__dirname, '../.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabaseUser() {
    try {
        const { data: { users }, error } = await supabase.auth.admin.listUsers();

        if (error) {
            console.error('Error fetching users:', error);
            return;
        }

        const user = users.find(u => u.email === 'sonudxplorer@gmail.com');

        if (user) {
            console.log('User found in Supabase Auth:');
            console.log('Email:', user.email);
            console.log('ID:', user.id);
            console.log('Created:', user.created_at);
            console.log('User Metadata:', JSON.stringify(user.user_metadata, null, 2));
            console.log('App Metadata:', JSON.stringify(user.app_metadata, null, 2));
        } else {
            console.log('User not found in Supabase Auth');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

checkSupabaseUser();
