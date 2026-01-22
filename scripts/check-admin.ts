
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
    try {
        const admin = await prisma.admin.findUnique({
            where: { email: 'sathishraj@bails.in' }
        });
        console.log('Admin found:', admin ? 'YES' : 'NO');
        if (admin) {
            console.log('Is Active:', admin.is_active);
            console.log('Login hash prefix:', admin.password_hash?.substring(0, 10));
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}
main();
