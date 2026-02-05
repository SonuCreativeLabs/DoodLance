
import { sendEmail } from '../src/lib/email';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
    console.log('Checking SMTP Configuration...');

    const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        console.error('❌ Missing Environment Variables:', missing.join(', '));
    } else {
        console.log('✅ All SMTP variables check out (presence only).');
        console.log(`- HOST: ${process.env.SMTP_HOST}`);
        console.log(`- USER: ${process.env.SMTP_USER}`);
        console.log(`- FROM: ${process.env.SMTP_FROM}`);
    }

    console.log('\nAttemping to send test email...');
    const result = await sendEmail({
        to: 'sathishraj@doodlance.com', // Admin email from file
        subject: 'Test Email from Debug Script',
        text: 'If you receive this, SMTP is working correctly.',
        html: '<p>If you receive this, <strong>SMTP is working correctly</strong>.</p>'
    });

    if (result) {
        console.log('✅ sendEmail returned TRUE.');
    } else {
        console.error('❌ sendEmail returned FALSE.');
    }
}

main().catch(console.error);
