
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Fetching Chart Data...');

    // Reuse the logic from the API to see what it would produce
    const revenueChartData = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        date.setDate(1);
        date.setHours(0, 0, 0, 0);

        const nextMonth = new Date(date);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        const monthStats = await prisma.booking.aggregate({
            where: {
                status: 'COMPLETED',
                createdAt: { gte: date, lt: nextMonth }
            },
            _sum: { totalPrice: true },
            _count: { id: true }
        });

        revenueChartData.push({
            date: date.toLocaleDateString('en-US', { month: 'short' }),
            revenue: monthStats._sum.totalPrice || 0,
            transactions: monthStats._count.id || 0
        });
    }

    console.log('Chart Data:', JSON.stringify(revenueChartData, null, 2));
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
