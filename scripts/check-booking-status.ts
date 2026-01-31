import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkBookingStatus() {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: 'cml262app0002smchu8ztai82' },
            select: {
                id: true,
                status: true,
                service: {
                    select: {
                        title: true
                    }
                },
                client: {
                    select: {
                        name: true
                    }
                },
                freelancer: {
                    select: {
                        name: true
                    }
                }
            }
        });

        console.log('\n📋 Booking Details:');
        console.log(JSON.stringify(booking, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkBookingStatus();
