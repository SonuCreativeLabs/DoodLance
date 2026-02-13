
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const id = 'cmljwu91v0009q9i4e4yhtqgr';
    console.log(`Inspecting Booking/Job with ID: ${id}`);

    // Try finding in Booking
    const booking = await prisma.booking.findUnique({
        where: { id },
    });

    if (booking) {
        console.log('Found in Booking table:');
        console.log(JSON.stringify(booking, null, 2));
        return;
    }

    // Try finding in Job (if separate, but usually ID implies one or other)
    // schema says model Job? Let's check schema.

    console.log('Not found in Booking table.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
