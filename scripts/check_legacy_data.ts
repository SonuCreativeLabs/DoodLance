
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        // Try to query the old table using raw query
        console.log("Checking for 'experiences' table...");
        try {
            const oldData = await prisma.$queryRaw`SELECT * FROM "experiences"`;
            console.log("FOUND experiences table!");
            console.log(JSON.stringify(oldData, null, 2));
        } catch (e: any) {
            if (e.message.includes('does not exist')) {
                console.log("Table 'experiences' does not exist.");
            } else {
                console.error("Error querying experiences:", e.message);
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
