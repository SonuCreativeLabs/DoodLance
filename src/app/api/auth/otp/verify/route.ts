import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifySMSChallenge } from '@/lib/workos-mfa';
import { formatPhoneNumber } from '@/lib/phone-utils';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const MAX_VERIFICATION_ATTEMPTS = 5;

export async function POST(req: Request) {
  try {
    const { email, phone, code } = await req.json();
    let identifier = email || phone;

    if (!identifier || !code) {
      return NextResponse.json({ error: 'Email/Phone and code are required' }, { status: 400 });
    }

    // Normalize phone number to E.164 format if it's a phone
    if (phone) {
      const formattedPhone = formatPhoneNumber(phone);
      if (formattedPhone) {
        identifier = formattedPhone;
      }
    }

    console.log('🔍 OTP Verify - Looking for identifier:', identifier);
    console.log('🔍 OTP Verify - Code:', code);

    // Find the OTP record
    const otpClient = prisma.otp || prisma.oTP;
    if (!otpClient) {
      throw new Error('Prisma OTP client not found');
    }

    const otpRecord = await otpClient.findFirst({
      where: {
        identifier,
        verified: false,
        expiresAt: {
          gt: new Date() // Must not be expired
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!otpRecord) {
      console.log('❌ OTP Verify - No OTP record found for identifier:', identifier);
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
    }

    console.log('✅ OTP Verify - Found OTP record:', {
      id: otpRecord.id,
      identifier: otpRecord.identifier,
      code: otpRecord.code,
      challengeId: otpRecord.challengeId,
      attempts: otpRecord.attempts
    });

    // Check verification attempts
    if (otpRecord.attempts >= MAX_VERIFICATION_ATTEMPTS) {
      await otpClient.delete({
        where: { id: otpRecord.id }
      });
      return NextResponse.json({
        error: 'Too many verification attempts. Please request a new code.'
      }, { status: 429 });
    }

    let isValid = false;

    // If we have a WorkOS challenge ID AND WorkOS is configured, try to verify with WorkOS
    if (otpRecord.challengeId && phone) {
      console.log('🔵 OTP Verify - Verifying with WorkOS challenge:', otpRecord.challengeId);
      const verifyResult = await verifySMSChallenge(otpRecord.challengeId, code);

      // If WorkOS verification succeeded and was valid, use that result
      if (verifyResult.success && verifyResult.valid) {
        isValid = true;
        console.log('✅ OTP Verify - WorkOS verification succeeded');
      } else {
        // WorkOS verification failed OR WorkOS not configured - fallback to local
        console.log('🔄 OTP Verify - WorkOS verification failed or unavailable, using local verification');
        console.log('   Error:', verifyResult.error);
        isValid = otpRecord.code === code;
        console.log('🔍 OTP Verify - Local verification result:', isValid, '(expected:', otpRecord.code, 'got:', code, ')');
      }
    } else {
      // No WorkOS challenge ID - use local code verification
      console.log('🔵 OTP Verify - No challenge ID, using local code verification');
      isValid = otpRecord.code === code;
      console.log('🔍 OTP Verify - Verification result:', isValid, '(expected:', otpRecord.code, 'got:', code, ')');
    }

    if (!isValid) {
      // Increment attempts
      await otpClient.update({
        where: { id: otpRecord.id },
        data: { attempts: otpRecord.attempts + 1 }
      });

      const remainingAttempts = MAX_VERIFICATION_ATTEMPTS - (otpRecord.attempts + 1);
      return NextResponse.json({
        error: 'Invalid code',
        remainingAttempts
      }, { status: 400 });
    }

    // Delete the OTP record (prevent reuse)
    await otpClient.delete({
      where: { id: otpRecord.id }
    });

    // Format phone number if provided
    const formattedPhone = phone ? formatPhoneNumber(phone) : undefined;

    // Check if user exists
    let user = await prisma.user.findFirst({
      where: email ? { email } : { phone: formattedPhone }
    });

    if (!user) {
      // Create a basic user if they don't exist
      user = await prisma.user.create({
        data: {
          email: email || `${formattedPhone}@placeholder.doodlance.com`, // Temporary email for phone users
          phone: formattedPhone || undefined,
          phoneVerified: !!phone, // Mark phone as verified if phone login
          phoneVerifiedAt: phone ? new Date() : undefined,
          name: (email ? email.split('@')[0] : formattedPhone) || 'User',
          role: 'client', // Default
          coords: '[]'
        }
      });
    } else if (phone && !user.phoneVerified) {
      // Update user to mark phone as verified
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          phone: formattedPhone,
          phoneVerified: true,
          phoneVerifiedAt: new Date()
        }
      });
    }

    // Generate JWT token for session
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create response with user data and token
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        phoneVerified: user.phoneVerified,
        role: user.role,
        avatar: user.avatar
      },
      token
    });

    // Set token as HTTP-only cookie
    response.cookies.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({
      error: 'Verification failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
