const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

function parseJwt(token) {
    try {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    } catch (e) {
        return null;
    }
}

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('=== KEY VERIFICATION ===');

if (!serviceKey) {
    console.log('❌ SUPABASE_SERVICE_ROLE_KEY is missing!');
} else {
    const decoded = parseJwt(serviceKey);
    if (decoded) {
        console.log('Checking SUPABASE_SERVICE_ROLE_KEY:');
        console.log('  Role:', decoded.role);
        console.log('  Iss:', decoded.iss);

        if (decoded.role === 'service_role') {
            console.log('  ✅ Valid Service Role Key');
        } else {
            console.log('  ❌ INVALID ROLE! Expected "service_role", got "' + decoded.role + '"');
            console.log('  ⚠️  You are likely using the Anon key as the Service key!');
        }
    } else {
        console.log('❌ Could not decode Service Key JWT');
    }
}

console.log('\nChecking NEXT_PUBLIC_SUPABASE_ANON_KEY:');
const decodedAnon = parseJwt(anonKey);
if (decodedAnon) {
    console.log('  Role:', decodedAnon.role);
}

