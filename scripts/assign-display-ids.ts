/**
 * Migration Script: Assign Display IDs to Existing Users
 * 
 * This script assigns sequential display IDs (C00001, F00001) to users
 * who don't have one yet.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function assignDisplayIds() {
    console.log('🔄 Starting display ID assignment...\n');

    try {
        // Get all users without display IDs
        const usersWithoutDisplayId = await prisma.user.findMany({
            where: {
                displayId: null,
            },
            orderBy: {
                createdAt: 'asc', // Assign in order of registration
            },
        });

        console.log(`Found ${usersWithoutDisplayId.length} users without display IDs\n`);

        if (usersWithoutDisplayId.length === 0) {
            console.log('✅ All users already have display IDs!');
            return;
        }

        // Separate by role
        const clients = usersWithoutDisplayId.filter(
            (u) => u.role === 'client' || u.currentRole === 'client'
        );
        const freelancers = usersWithoutDisplayId.filter(
            (u) => u.role === 'freelancer' || u.currentRole === 'freelancer'
        );

        console.log(`📊 Breakdown:`);
        console.log(`   - Clients: ${clients.length}`);
        console.log(`   - Freelancers: ${freelancers.length}\n`);

        // Get current max sequence for each type
        const maxClientId = await prisma.user.findFirst({
            where: { displayId: { startsWith: 'C' } },
            orderBy: { displayId: 'desc' },
        });

        const maxFreelancerId = await prisma.user.findFirst({
            where: { displayId: { startsWith: 'F' } },
            orderBy: { displayId: 'desc' },
        });

        let clientSequence = maxClientId
            ? parseInt(maxClientId.displayId!.substring(1)) + 1
            : 1;
        let freelancerSequence = maxFreelancerId
            ? parseInt(maxFreelancerId.displayId!.substring(1)) + 1
            : 1;

        console.log(`📍 Starting sequences:`);
        console.log(`   - Clients: C${String(clientSequence).padStart(5, '0')}`);
        console.log(`   - Freelancers: F${String(freelancerSequence).padStart(5, '0')}\n`);

        // Assign to clients
        console.log('👥 Assigning client IDs...');
        for (const client of clients) {
            const displayId = `C${String(clientSequence).padStart(5, '0')}`;
            await prisma.user.update({
                where: { id: client.id },
                data: { displayId },
            });
            console.log(`   ✓ ${client.email} → ${displayId}`);
            clientSequence++;
        }

        // Assign to freelancers
        console.log('\n💼 Assigning freelancer IDs...');
        for (const freelancer of freelancers) {
            const displayId = `F${String(freelancerSequence).padStart(5, '0')}`;
            await prisma.user.update({
                where: { id: freelancer.id },
                data: { displayId },
            });
            console.log(`   ✓ ${freelancer.email} → ${displayId}`);
            freelancerSequence++;
        }

        console.log('\n✅ Display ID assignment complete!');
        console.log(`\n📊 Final counts:`);
        console.log(`   - Clients: ${clients.length} assigned`);
        console.log(`   - Freelancers: ${freelancers.length} assigned`);
        console.log(`   - Total: ${usersWithoutDisplayId.length} users updated`);
    } catch (error) {
        console.error('❌ Error assigning display IDs:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the migration
assignDisplayIds()
    .then(() => {
        console.log('\n🎉 Migration completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Migration failed:', error);
        process.exit(1);
    });
