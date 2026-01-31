
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const bookingId = 'cmkybhwe'; // The ID to inspect
    console.log(`Inspecting booking: ${bookingId}`);

    try {
        const booking = await prisma.booking.findFirst({
            where: {
                OR: [
                    { id: bookingId },
                    { id: { contains: bookingId } },
                ]
            },
            include: {
                service: {
                    include: {
                        provider: {
                            select: {
                                name: true,
                                email: true,
                                freelancerProfile: true
                            }
                        }
                    }
                },
                client: { select: { name: true, email: true } },
            }
        });

        if (!booking) {
            console.log('Booking not found!');
            return;
        }

        console.log('Booking found:');
        console.log('ID:', booking.id);
        console.log('Status:', booking.status);
        console.log('Payment Status:', booking.paymentStatus);
        console.log('Scheduled At:', booking.scheduledAt);
        console.log('Transaction ID:', booking.transactionId);
        console.log('Service:', booking.service.title);
        console.log('Provider:', booking.service.provider.name);
        console.log('Client:', booking.client.name);
        console.log('Notes:', booking.notes);
        console.log('Requirements:', booking.requirements);
        console.log('Created At:', booking.createdAt);

    } catch (e) {
        console.error('Error fetching booking:', e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
