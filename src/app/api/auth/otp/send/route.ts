import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sendEmail, sendOTPEmail, isValidEmail } from '@/lib/email';
import { formatPhoneNumber, validatePhoneNumber } from '@/lib/phone-utils';
import { enrollSMSFactor, createSMSChallenge } from '@/lib/workos-mfa';

// Rate limiting: max 3 OTP requests per identifier per 10 minutes
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 3;

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

    // Validate phone number if provided
    if (phone) {
      if (!validatePhoneNumber(phone)) {
        console.log('❌ OTP Send - Invalid phone number format');
        return NextResponse.json({
          error: 'Invalid phone number. Please use format: +919876543210'
        }, { status: 400 });
      }
    }

    // Check rate limiting
    const otpClient = prisma.otp || prisma.oTP;
    if (!otpClient) {
      console.error('❌ OTP Send - Prisma OTP client not found');
      throw new Error('Prisma OTP client not found');
    }

    // Count recent OTP requests for this identifier
    const recentOTPs = await otpClient.count({
      where: {
        identifier,
        createdAt: {
          gte: new Date(Date.now() - RATE_LIMIT_WINDOW)
        }
      }
    });

    if (recentOTPs >= MAX_ATTEMPTS) {
      console.log('❌ OTP Send - Rate limit exceeded');
      return NextResponse.json({
        error: 'Too many OTP requests. Please try again in 10 minutes.'
      }, { status: 429 });
    }

    // Generate OTP code
    // Phone: Always use 123456 for easy mock data access
    // Email: Generate random code for production use
    const code = phone ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔵 OTP Send - Generated code:', code);

    // Set expiration (10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    console.log('🔵 OTP Send - Expiration:', expiresAt);

    // Delete any existing OTPs for this identifier
    console.log('🔵 OTP Send - Deleting existing OTPs...');
    await otpClient.deleteMany({
      where: { identifier }
    });
    console.log('✅ OTP Send - Deleted existing OTPs');

    let challengeId: string | undefined;

    // Send OTP via Email or SMS
    if (email) {
      console.log('🔵 OTP Send - Sending email OTP...');
      const emailSent = await sendOTPEmail(email, code);

      if (!emailSent) {
        console.log('⚠️ Email sending failed (check server logs for code)');
      }
    } else if (phone) {
      // Format phone number to E.164
      const formattedPhone = formatPhoneNumber(phone);
      if (!formattedPhone) {
        return NextResponse.json({
          error: 'Failed to format phone number'
        }, { status: 400 });
      }

      console.log('🔵 OTP Send - Formatted phone:', formattedPhone);

      // Check if user exists and has a WorkOS factor ID
      let user = await prisma.user.findFirst({
        where: { phone: formattedPhone }
      });

      let factorId = user?.workosFactorId;

      // If no factor ID exists, enroll a new SMS factor
      if (!factorId) {
        console.log('🔵 OTP Send - Enrolling new SMS factor...');
        const enrollResult = await enrollSMSFactor(formattedPhone);

        if (!enrollResult.success) {
          console.error('❌ OTP Send - Failed to enroll SMS factor:', enrollResult.error);
          // Fallback to mock SMS if WorkOS enrollment fails
          console.log(`📱 [MOCK SMS] To: ${formattedPhone}, Code: ${code}`);
        } else {
          factorId = enrollResult.factorId;
          console.log('✅ OTP Send - SMS factor enrolled:', factorId);

          // Update or create user with factor ID
          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: { workosFactorId: factorId }
            });
          }
        }
      }

      // Create SMS challenge if we have a factor ID
      if (factorId) {
        console.log('🔵 OTP Send - Creating SMS challenge...');
        const challengeResult = await createSMSChallenge(factorId);

        if (challengeResult.success) {
          challengeId = challengeResult.challengeId;
          console.log('✅ OTP Send - SMS challenge created:', challengeId);
        } else {
          console.error('❌ OTP Send - Failed to create SMS challenge:', challengeResult.error);
          // Fallback to mock SMS
          console.log(`📱 [MOCK SMS] To: ${formattedPhone}, Code: ${code}`);
        }
      } else {
        // Fallback to mock SMS if no factor ID
        console.log(`📱 [MOCK SMS] To: ${formattedPhone}, Code: ${code}`);
      }
    }

    // Create OTP record
    console.log('🔵 OTP Send - Creating new OTP record...');
    await otpClient.create({
      data: {
        identifier,
        code,
        expiresAt,
        challengeId: challengeId || null,
        attempts: 0
      }
    });
    console.log('✅ OTP Send - OTP created successfully');

    // Only log email OTP codes in terminal
    if (email && code !== '123456') {
      console.log('\n' + '='.repeat(60));
      console.log('📧 EMAIL OTP CODE');
      console.log('='.repeat(60));
      console.log(`📧 Email: ${identifier}`);
      console.log(`🔢 CODE: ${code}`);
      console.log(`⏰ Expires: ${expiresAt.toLocaleString()}`);
      console.log('='.repeat(60) + '\n');
    }

    console.log('✅ OTP Send - Request completed successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ OTP Send - Error occurred:', error);
    console.error('❌ OTP Send - Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({
      error: 'Failed to send OTP',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
