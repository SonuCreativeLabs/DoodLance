
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Starting Full Referral Code Reset...');

    // 1. Get All Users Ordered by Creation Date
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'asc' },
        select: { id: true, email: true, referralCode: true, createdAt: true }
    });

    console.log(`📊 Found ${users.length} users.`);

    // 2. Identify Preserved Codes
    const preservedCodes = new Set(['BAILS1', 'BAILS7']);
    const preservedUserIds = new Set<string>();

    // Use a transaction to ensure consistency if possible, or just sequential updates
    // Since we are rewriting almost everyone, we'll iterate.

    // First pass: Find who OWNS the preserved codes
    for (const user of users) {
        if (user.referralCode && preservedCodes.has(user.referralCode)) {
            preservedUserIds.add(user.id);
            console.log(`🔒 Preserving ${user.referralCode} for ${user.email}`);
        }
    }

    // 3. Assign New Codes
    let sequence = 1;

    for (const user of users) {
        // If this user owns a preserved code, skip them
        if (preservedUserIds.has(user.id)) {
            continue;
        }

        // Generate Candidate
        let candidate = `BAILS${sequence}`;

        // While candidate matches a preserved code, skip that sequence number
        while (preservedCodes.has(candidate)) {
            console.log(`⚠️  Skipping reserved sequence ${candidate}`);
            sequence++;
            candidate = `BAILS${sequence}`;
        }

        // Update User
        // Optimization: If user already has this code, skip update
        if (user.referralCode === candidate) {
            console.log(`   ✅ ${user.email} already has ${candidate}`);
        } else {
            try {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { referralCode: candidate }
                });
                console.log(`   ✏️  Updated ${user.email}: ${user.referralCode} -> ${candidate}`);
            } catch (e) {
                console.error(`   ❌ Failed to update ${user.email} to ${candidate}`, e);
            }
        }

        // Increment for next user
        sequence++;
    }

    // 4. Save New Sequence back to Config
    // The next available sequence is the current 'sequence' value (since we incremented at end of loop)
    await prisma.systemConfig.upsert({
        where: { key: 'NEXT_REFERRAL_SEQUENCE' },
        update: { value: sequence.toString() },
        create: {
            key: 'NEXT_REFERRAL_SEQUENCE',
            value: sequence.toString(),
            description: 'Next sequence number for referral code generation'
        }
    });

    console.log(`💾 Saved Next Sequence: ${sequence}`);
    console.log('🎉 Full Reset Complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
