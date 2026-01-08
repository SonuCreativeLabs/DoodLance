
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding financial data...');

    // Create a dummy user interactions for booking
    const user = await prisma.user.findFirst();
    const service = await prisma.service.findFirst();

    if (!user || !service) {
        console.log('User or Service not found, skipping seed.');
        return;
    }

    // Create a completed booking with a known price
    // Price = 1000, Platform Fee should be 300
    await prisma.booking.create({
        data: {
            clientId: user.id,
            serviceId: service.id,
            duration: 60,
            totalPrice: 1000,
            status: 'COMPLETED',
            coords: '0,0',
            createdAt: new Date(),   // Current month for chart
            updatedAt: new Date()
        }
    });

    console.log('Created Completed Booking: Price = 1000');

    // Create a pending withdrawal
    // Amount = 500
    const wallet = await prisma.wallet.findFirst({ where: { userId: user.id } }) ||
        await prisma.wallet.create({ data: { userId: user.id } });

    await prisma.transaction.create({
        data: {
            walletId: wallet.id,
            amount: 500,
            type: 'WITHDRAWAL',
            description: 'Test Withdrawal',
            status: 'PENDING'
        }
    });

    console.log('Created Pending Withdrawal: Amount = 500');

    console.log('Seed Complete. Check Dashboard.');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
