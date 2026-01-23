import prisma from '../src/lib/db';
import bcrypt from 'bcryptjs';

async function addAdminUser() {
    try {
        const email = 'sathishraj@bails.in';
        const password = 'admin123'; // Change this to a secure password
        const name = 'Sathishraj S';

        console.log(`🔐 Adding admin user: ${email}`);

        //Check if admin already exists
        const existing = await prisma.admin.findUnique({
            where: { email }
        });

        if (existing) {
            console.log('⚠️  Admin already exists with this email!');
            console.log('Admin details:', {
                id: existing.id,
                email: existing.email,
                name: existing.name,
                role: existing.role,
                isActive: existing.is_active
            });
            return;
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Create admin
        const admin = await prisma.admin.create({
            data: {
                email,
                password_hash,
                name,
                role: 'SUPER_ADMIN', // or 'ADMIN', 'SUPPORT', 'FINANCE', 'MARKETING'
                is_active: true,
                permissions: JSON.stringify([
                    'dashboard.view',
                    'users.view', 'users.edit',
                    'bookings.view', 'bookings.edit',
                    'jobs.view', 'jobs.edit',
                    'services.view', 'services.edit',
                    'transactions.view',
                    'support.view', 'support.edit',
                    'reports.view',
                    'verification.view', 'verification.edit',
                    'promos.view', 'promos.edit',
                    'analytics.view',
                    'settings.view', 'settings.edit'
                ])
            }
        });

        console.log('✅ Admin created successfully!');
        console.log('Admin details:', {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role
        });
        console.log('\n📝 Login credentials:');
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
        console.log('\n🔗 Login at: http://localhost:3000/admin/login');

    } catch (error) {
        console.error('❌ Error adding admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

addAdminUser();
