
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Starting referral code reset...');

    // 1. Fetch all users sorted by creation date (oldest first)
    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: 'asc',
        },
        select: {
            id: true,
            email: true,
            name: true,
        },
    });

    console.log(`Found ${users.length} users.`);

    // 2. Define reserved logic
    const reservedMap: Record<string, number> = {
        'sonucreativelabs@gmail.com': 1,
        'sonurandom07@gmail.com': 7,
    };

    const reservedValues = new Set(Object.values(reservedMap));

    let currentSequence = 1;
    const updates: Promise<any>[] = [];

    for (const user of users) {
        let newCode = '';

        if (reservedMap[user.email]) {
            // User has a reserved specific code
            newCode = `BAILS${reservedMap[user.email]}`;
            console.log(`✅ Assigned RESERVED ${newCode} to ${user.email}`);
        } else {
            // Find next available sequence that isn't reserved
            while (reservedValues.has(currentSequence)) {
                currentSequence++;
            }

            newCode = `BAILS${currentSequence}`;
            console.log(`assigned ${newCode} to ${user.email} (seq: ${currentSequence})`);

            currentSequence++;
        }

        // Push update operation
        updates.push(
            prisma.user.update({
                where: { id: user.id },
                data: { referralCode: newCode },
            })
        );
    }

    // 3. Execute all updates
    console.log('💾 Saving changes to database...');
    await Promise.all(updates); // Run in parallel for speed, or seq if too many connections

    // 4. Update System Config for future codes
    // The next available code should be the currentSequence (which is already incremented past the last used one)
    // We need to make sure we don't accidentally land on a reserved one again if we ended right before one
    while (reservedValues.has(currentSequence)) {
        currentSequence++;
    }

    await prisma.systemConfig.upsert({
        where: { key: 'NEXT_REFERRAL_SEQUENCE' },
        update: { value: currentSequence.toString() },
        create: {
            key: 'NEXT_REFERRAL_SEQUENCE',
            value: currentSequence.toString(),
            description: 'Next sequence number for referral code generation',
        },
    });

    console.log(`✨ Done! Next sequence set to: ${currentSequence}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
