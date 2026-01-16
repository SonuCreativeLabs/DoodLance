import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createAdmin() {
    const email = process.env.ADMIN_EMAIL || 'sathishraj@doodlance.com';
    const password = process.env.ADMIN_PASSWORD || 'default_secure_password';
    const name = 'Sathish Raj';

    console.log(`Creating/Updating admin: ${email}`);

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    try {
        const admin = await prisma.admin.upsert({
            where: { email },
            update: {
                password_hash,
                name,
                is_active: true,
            },
            create: {
                email,
                password_hash,
                name,
                role: 'super_admin',
                is_active: true,
            },
        });

        console.log('Successfully created/updated admin:', admin.email);
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
