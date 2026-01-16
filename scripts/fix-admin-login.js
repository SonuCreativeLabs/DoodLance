const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function createExactAdmin() {
    // User requested these EXACT credentials
    const email = 'sathishraj@doodlance';  // Disabling email validation locally if needed
    const password = process.env.ADMIN_PASSWORD || 'default_secure_password';
    const name = 'Sathish Raj';

    console.log(`Creating/Updating admin: ${email}`);

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    try {
        // Try to find existing
        const existing = await prisma.admin.findFirst({
            where: {
                OR: [
                    { email: email },
                    { email: 'sathishraj@doodlance.com' }
                ]
            }
        });

        if (existing) {
            console.log(`Found existing admin with email: ${existing.email}. Updating...`);
            await prisma.admin.update({
                where: { id: existing.id },
                data: {
                    email: email, // Force update to the exact email user wants
                    password_hash,
                    name,
                    is_active: true,
                }
            });
        } else {
            console.log('Creating new admin...');
            await prisma.admin.create({
                data: {
                    email,
                    password_hash,
                    name,
                    role: 'super_admin',
                    is_active: true,
                }
            });
        }

        console.log('Successfully set admin credentials for:', email);
        console.log('Password set to:', password);

        // VERIFY IMMEDIATELY
        const admin = await prisma.admin.findUnique({ where: { email } });    // Verify password match immediately
        const isMatch = await bcrypt.compare(password, admin.password_hash);
        console.log('Immediate verification check:', isMatch ? 'PASSED' : 'FAILED');

        // FIX PERMISSIONS
        console.log('Fixing permissions for service_role...');
        try {
            await prisma.$executeRawUnsafe(`GRANT USAGE ON SCHEMA public TO service_role;`);
            await prisma.$executeRawUnsafe(`GRANT ALL ON TABLE public.admins TO service_role;`);
            await prisma.$executeRawUnsafe(`GRANT ALL ON SEQUENCE public.admins_id_seq TO service_role;`); // If it exists
            console.log('Permissions granted successfully.');
        } catch (permError) {
            console.log('Note: Permission grant failed (might be unnecessary or insufficient privileges):', permError.message);
        }

        // Create the .com version just in case
        const emailCom = email + '.com';
        const existingAdminCom = await prisma.admin.findUnique({ where: { email: emailCom } });
        if (!existingAdminCom) {
            console.log(`Creating fallback admin: ${emailCom}`);
            await prisma.admin.create({
                data: {
                    email: emailCom,
                    password_hash: password_hash, // Use the already hashed password
                    name: 'Sathish Raj (Fallback)',
                    role: 'super_admin',
                    is_active: true
                }
            });
        } else {
            console.log(`Updating fallback admin: ${emailCom}`);
            await prisma.admin.update({
                where: { email: emailCom },
                data: { password_hash: password_hash } // Use the already hashed password
            });
        }


    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createExactAdmin();
