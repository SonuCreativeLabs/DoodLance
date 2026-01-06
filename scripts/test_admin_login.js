const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function testAdminLogin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('=== TESTING ADMIN LOGIN ===');
    console.log('1. Supabase URL:', supabaseUrl?.substring(0, 30) + '...');
    console.log('2. Service key configured:', !!supabaseServiceKey);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Test 1: Fetch all admins
    console.log('\n3. Fetching all admins...');
    const { data: admins, error: allError } = await supabase
        .from('admins')
        .select('email, name, role, is_active');

    console.log('   Result:', {
        count: admins?.length,
        error: allError?.message,
        admins: admins
    });

    // Test 2: Fetch specific admin
    const testEmail = 'admin@doodlance.com';
    console.log('\n4. Fetching admin:', testEmail);
    const { data: admin, error: fetchError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', testEmail)
        .eq('is_active', true)
        .single();

    console.log('   Result:', {
        found: !!admin,
        error: fetchError?.message,
        email: admin?.email,
        hashPrefix: admin?.password_hash?.substring(0, 20)
    });

    // Test 3: Verify password
    if (admin) {
        const testPassword = 'admin123';
        console.log('\n5. Testing password:', testPassword);
        const validPassword = await bcrypt.compare(testPassword, admin.password_hash);
        console.log('   Password valid:', validPassword);
    }

    console.log('\n======================\n');
}

testAdminLogin().catch(console.error);
