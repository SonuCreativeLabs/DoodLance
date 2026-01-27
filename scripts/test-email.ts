
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
    console.log('Testing SMTP connection...');
    console.log('Host:', process.env.SMTP_HOST);
    console.log('User:', process.env.SMTP_USER);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        await transporter.verify();
        console.log('✅ SMTP Connection Verified');
    } catch (error) {
        console.error('❌ SMTP Connection Failed:', error);
        return;
    }

    console.log('Sending test email...');
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: 'sathishraj@doodlance.com', // Admin email
            subject: 'BAILS SMTP Test',
            text: 'This is a test email from the debugging script. If you see this, email sending is working.',
        });
        console.log('✅ Test Email Sent:', info.messageId);
        console.log('Preview URL (if ethereal):', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('❌ Failed to send email:', error);
    }
}

main();
