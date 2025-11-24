import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    console.log('🔵 OTP Send - Starting request');
    
    const body = await req.json();
    console.log('🔵 OTP Send - Request body:', body);
    
    const { email, phone } = body;
    const identifier = email || phone;

    if (!identifier) {
      console.log('❌ OTP Send - No identifier provided');
      return NextResponse.json({ error: 'Email or Phone is required' }, { status: 400 });
    }

    console.log('🔵 OTP Send - Identifier:', identifier);

    // Generate a 6-digit code
    const code = '123456'; // Fixed code for testing
    console.log('🔵 OTP Send - Generated code:', code);
    
    // Set expiration (e.g., 10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    console.log('🔵 OTP Send - Expiration:', expiresAt);

    // Delete any existing OTPs for this identifier
    console.log('🔵 OTP Send - Checking prisma client...');
    console.log('🔵 OTP Send - prisma.otp exists?', !!prisma.otp);
    console.log('🔵 OTP Send - prisma.oTP exists?', !!prisma.oTP);
    
    const otpClient = prisma.otp || prisma.oTP;
    if (!otpClient) {
      console.error('❌ OTP Send - Prisma OTP client not found');
      throw new Error('Prisma OTP client not found');
    }

    console.log('🔵 OTP Send - Deleting existing OTPs...');
    await otpClient.deleteMany({
      where: { identifier }
    });
    console.log('✅ OTP Send - Deleted existing OTPs');

    console.log('🔵 OTP Send - Creating new OTP...');
    await otpClient.create({
      data: {
        identifier,
        code,
        expiresAt
      }
    });
    console.log('✅ OTP Send - OTP created successfully');

    // Send OTP via Email or SMS
    if (email) {
      console.log('🔵 OTP Send - Attempting to send email...');
      const emailSent = await sendEmail({
        to: email,
        subject: 'Your DoodLance Verification Code',
        text: `Your verification code is: ${code}. It will expire in 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #6b46c1;">Verify your email</h2>
            <p>Please use the following code to verify your account:</p>
            <div style="background: #f4f4f5; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; margin: 20px 0;">
              ${code}
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">If you didn't request this code, please ignore this email.</p>
          </div>
        `
      });
      
      if (!emailSent) {
        console.log('⚠️ Email sending failed (check server logs for code)');
      }
    } else if (phone) {
      // Mock SMS sending - in production this would use Twilio/SNS etc.
      console.log(`📱 [MOCK SMS] To: ${phone}, Code: ${code}`);
      // TODO: Implement actual SMS provider here
    }

    console.log('✅ OTP Send - Request completed successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ OTP Send - Error occurred:', error);
    console.error('❌ OTP Send - Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ error: 'Failed to send OTP', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
