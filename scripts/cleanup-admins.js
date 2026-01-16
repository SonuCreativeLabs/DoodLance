const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function cleanupAdmins() {
    const invalidEmail = 'sathishraj@doodlance';
    const validEmail = 'sathishraj@doodlance.com';
    const password = 'Raj1@doodlance';

    console.log('Starting Admin User Cleanup...');

    try {
        // 1. Remove the invalid user
        const invalidUser = await prisma.admin.findUnique({ where: { email: invalidEmail } });
        if (invalidUser) {
            console.log(`Deleting invalid admin user: ${invalidEmail}`);
            await prisma.admin.delete({ where: { email: invalidEmail } });
            console.log('✅ Invalid user deleted.');
        } else {
            console.log(`ℹ️ Invalid user ${invalidEmail} not found (already clean).`);
        }

        // 2. Ensure valid user exists with correct credentials
        console.log(`Verifying valid admin user: ${validEmail}`);
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const validUser = await prisma.admin.findUnique({ where: { email: validEmail } });

        if (validUser) {
            console.log('Found valid user, updating credentials to be sure...');
            await prisma.admin.update({
                where: { email: validEmail },
                data: {
                    password_hash,
                    role: 'super_admin', // Ensuring lowercase match for DB
                    is_active: true
                }
            });
            console.log('✅ Valid user updated.');
        } else {
            console.log('Valid user not found, creating...');
            await prisma.admin.create({
                data: {
                    email: validEmail,
                    password_hash,
                    name: 'Sathish Raj',
                    role: 'super_admin',
                    is_active: true
                }
            });
            console.log('✅ Valid user created.');
        }

        // 3. Final Verification
        const finalUser = await prisma.admin.findUnique({ where: { email: validEmail } });
        console.log('\n--- Final State Verification ---');
        console.log(`Email: ${finalUser.email}`);
        console.log(`Role: ${finalUser.role}`);
        console.log(`Active: ${finalUser.is_active}`);

        const isPasswordValid = await bcrypt.compare(password, finalUser.password_hash);
        console.log(`Password Check: ${isPasswordValid ? '✅ PASSED' : '❌ FAILED'}`);

    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanupAdmins();
