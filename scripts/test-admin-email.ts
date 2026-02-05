
import { sendAdminNotification } from '../src/lib/email';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
    console.log('🚀 Testing sendAdminNotification...');

    const result = await sendAdminNotification(
        'Test Admin Alert',
        'This is a test message to verify admin notifications are working.',
        '<p>This is a <strong>test message</strong> to verify admin notifications are working.</p>'
    );

    if (result) {
        console.log('✅ sendAdminNotification returned TRUE');
    } else {
        console.error('❌ sendAdminNotification returned FALSE');
    }
}

main().catch(console.error);
