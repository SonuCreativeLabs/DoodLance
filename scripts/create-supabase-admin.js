
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
    // Get args from command line: node script.js <email> <password>
    // Default to known credentials if not provided (for this specific run/context)
    const email = process.argv[2] || 'sathishraj@doodlance.com';
    const password = process.argv[3] || 'Raj1@doodlance';
    const name = 'Sathish Raj';

    console.log(`Creating/Updating Supabase Admin: ${email}`);
    console.log(`Using provided password (length: ${password.length})`);

    try {
        // 1. Check if user exists
        const { data: users, error: listError } = await supabase.auth.admin.listUsers();

        if (listError) {
            throw listError;
        }

        const existingUser = users.users.find(u => u.email === email);
        let userId;

        if (existingUser) {
            console.log(`User already exists (ID: ${existingUser.id}). Updating metadata...`);
            userId = existingUser.id;

            const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
                password: password, // Update password to match env var
                user_metadata: {
                    role: 'ADMIN',
                    name: name,
                    admin_role: 'SUPER_ADMIN'
                },
                email_confirm: true
            });

            if (updateError) throw updateError;
            console.log('User updated successfully.');

        } else {
            console.log('Creating new user...');
            const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
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
            if (!newUser.user) throw new Error('User creation failed - no user returned');

            userId = newUser.user.id;
            console.log(`User created successfully (ID: ${userId}).`);
        }

        console.log('Done. You can now login with this email and password.');

    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createSupabaseAdmin();
