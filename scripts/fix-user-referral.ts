import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });

import prisma from '../src/lib/db';

async function fixUser() {
    // Manually set the referredBy for sonudxplorer
    const updated = await prisma.user.update({
        where: { email: 'sonudxplorer@gmail.com' },
        data: { referredBy: 'CAMPAIGN_BAILS6' }
    });

    console.log('✅ Updated user:', updated.email, 'referredBy:', updated.referredBy);

    await prisma.$disconnect();
}

fixUser();
