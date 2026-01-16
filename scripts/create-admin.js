const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function createAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Error: Missing Supabase environment variables');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const email = 'sathishraj@doodlance.com';
    const password = 'Raj1@doodlance';
    const name = 'Sathish Raj';

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    console.log(`Creating admin user: ${email}`);

    // Check if user exists
    const { data: existingUser } = await supabase
        .from('admins')
        .select('id')
        .eq('email', email)
        .single();

    if (existingUser) {
        console.log('User already exists, updating password...');
        const { error } = await supabase
            .from('admins')
            .update({
                password_hash,
                name,
                is_active: true,
                updated_at: new Date().toISOString()
            })
            .eq('id', existingUser.id);

        if (error) {
            console.error('Error updating admin:', error);
        } else {
            console.log('Admin updated successfully');
        }
    } else {
        console.log('Creating new user...');
        const { error } = await supabase
            .from('admins')
            .insert({
                email,
                password_hash,
                name,
                role: 'super_admin',
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });

        if (error) {
            console.error('Error creating admin:', error);
        } else {
            console.log('Admin created successfully');
        }
    }
}

createAdmin().catch(console.error);
