const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createSupabaseAdmin() {
    const email = process.argv[2];
    const password = process.argv[3];
    const name = 'Sathish Raj';

    if (!email || !password) {
        console.error('Error: Email and Password arguments are required.');
        console.error('Usage: node scripts/reset-admin.js <email> <password>');
        process.exit(1);
    }

    console.log(`Resetting Admin: ${email}`);

    try {
        const { data: { users }, error } = await supabase.auth.admin.listUsers();
        if (error) throw error;

        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            console.log(`Found user ${existingUser.id}. Updating...`);
            const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
                password: password,
                email_confirm: true,
                user_metadata: {
                    role: 'ADMIN',
                    name: name,
                    admin_role: 'SUPER_ADMIN'
                }
            });
            if (updateError) throw updateError;
            console.log('✅ Admin password RESET successfully.');
        } else {
            console.log('Creating NEW admin user...');
            const { error: createError } = await supabase.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: {
                    role: 'ADMIN',
                    name: name,
                    admin_role: 'SUPER_ADMIN'
                }
            });
            if (createError) throw createError;
            console.log('✅ Admin user CREATED successfully.');
        }
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

createSupabaseAdmin();
