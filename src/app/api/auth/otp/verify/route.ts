import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, phone, code } = await req.json();
    const identifier = email || phone;

    if (!identifier || !code) {
      return NextResponse.json({ error: 'Email/Phone and code are required' }, { status: 400 });
    }

    // Find the OTP record
    const otpClient = prisma.otp || prisma.oTP;
    if (!otpClient) {
      throw new Error('Prisma OTP client not found');
    }

    const otpRecord = await otpClient.findFirst({
      where: {
        identifier,
        code,
        verified: false,
        expiresAt: {
          gt: new Date() // Must not be expired
        }
      }
    });

    if (!otpRecord) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
    }

    // Mark as verified (or delete it)
    // We'll delete it to prevent reuse
    await otpClient.delete({
      where: { id: otpRecord.id }
    });

    // Check if user exists, if not create one?
    // Or just return success and let the client handle the "login"
    // Ideally, we should return a session token here, but sticking to the current architecture:
    // We verify the OTP, then the client sets the user state.
    // To make it more robust, we should fetch the user here.
    
    let user = await prisma.user.findFirst({
      where: email ? { email } : { phone }
    });

    if (!user) {
      // Create a basic user if they don't exist
      user = await prisma.user.create({
        data: {
          email: email || `${phone}@placeholder.doodlance.com`, // Temporary email for phone users
          phone: phone || undefined,
          name: (email ? email.split('@')[0] : phone) || 'User',
          role: 'client', // Default
          coords: '[]'
        }
      });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
