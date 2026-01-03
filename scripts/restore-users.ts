const { PrismaClient } = require('@prisma/client')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const prisma = new PrismaClient()

// Initialize Supabase Admin
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const EMAILS_TO_RESTORE = [
    'sonucreativelabs@gmail.com',
    'sonuofficials07@gmail.com'
];

async function restoreUsers() {
    console.log('--- Restoring Users ---')

    for (const email of EMAILS_TO_RESTORE) {
        console.log(`\nProcessing ${email}...`)

        // 1. Get User from Supabase Auth
        const { data, error } = await supabase.auth.admin.listUsers();

        if (error) {
            console.error(`Error fetching users from Supabase:`, error.message);
            continue;
        }

        const sbUser = data.users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());

        if (!sbUser) {
            console.warn(`⚠️  User ${email} not found in Supabase Auth! Cannot restore.`);
            continue;
        }

        console.log(`✅ Found in Supabase ID: ${sbUser.id}`);

        // 2. Insert into Prisma DB
        try {
            const user = await prisma.user.upsert({
                where: { id: sbUser.id }, // Use Supabase UUID as ID
                update: {
                    email: sbUser.email,
                    supabaseUid: sbUser.id
                },
                create: {
                    id: sbUser.id,
                    email: sbUser.email,
                    role: 'freelancer',
                    name: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || email.split('@')[0],
                    isVerified: true,
                    createdAt: new Date(sbUser.created_at),
                    coords: JSON.stringify([0, 0]),
                    supabaseUid: sbUser.id,
                    location: 'Chennai, India' // Default
                }
            });
            console.log(`✅ Synced to Database: ${user.email} (${user.id})`);

        } catch (e: any) {
            console.error(`Failed to sync ${email}:`, e.message);
            console.error(e);
        }
    }
}

restoreUsers()
    .catch((e: any) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
