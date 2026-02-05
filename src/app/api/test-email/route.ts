
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const to = searchParams.get('to') || 'sathishraj@bails.in';

    // 1. Check Env Vars availability (mask values for security)
    const envStatus = {
        SMTP_HOST: process.env.SMTP_HOST ? 'Set' : 'Missing',
        SMTP_PORT: process.env.SMTP_PORT ? 'Set' : 'Missing',
        SMTP_USER: process.env.SMTP_USER ? 'Set' : 'Missing',
        SMTP_PASS: process.env.SMTP_PASS ? 'Set' : 'Missing',
        SMTP_FROM: process.env.SMTP_FROM ? 'Set' : 'Missing',
        SMTP_SECURE: process.env.SMTP_SECURE ? 'Set' : 'Missing'
    };

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return NextResponse.json({
            success: false,
            message: 'Missing SMTP Environment Variables',
            envStatus
        }, { status: 500 });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            // Debug options
            debug: true,
            logger: true
        });

        // Verify connection config
        await transporter.verify();

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject: 'Test Email from Vercel Production',
            text: 'If you received this, SMTP is working correctly on Vercel.',
            html: '<h1>Success!</h1><p>SMTP is working correctly.</p>'
        });

        return NextResponse.json({
            success: true,
            message: 'Email sent successfully',
            messageId: info.messageId,
            response: info.response,
            envStatus
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'Failed to send email',
            error: error.message,
            stack: error.stack,
            code: error.code,
            command: error.command,
            response: error.response,
            responseCode: error.responseCode,
            envStatus
        }, { status: 500 });
    }
}
