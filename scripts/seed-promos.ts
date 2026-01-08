
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const promos = [
        {
            code: 'WELCOME20',
            description: '20% off first booking',
            discountType: 'PERCENTAGE',
            discountValue: 20,
            usageLimit: 100,
            status: 'active',
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
        {
            code: 'WEEKEND15',
            description: '15% off weekend bookings',
            discountType: 'PERCENTAGE',
            discountValue: 15,
            usageLimit: null,
            status: 'active',
            startDate: new Date(),
            endDate: null, // Forever
        },
        {
            code: 'BULK25',
            description: '25% off bulk orders',
            discountType: 'PERCENTAGE',
            discountValue: 25,
            usageLimit: 50,
            status: 'active',
            startDate: new Date(),
            endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        }
    ];

    for (const p of promos) {
        try {
            await prisma.promoCode.upsert({
                where: { code: p.code },
                update: {},
                create: p,
            });
            console.log(`Upserted ${p.code}`);
        } catch (e) {
            console.error(`Failed to upsert ${p.code}`, e);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
