import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { phone } = await req.json();

        const otpClient = prisma.otp || prisma.oTP;

        // Get all OTPs for this phone
        const otps = await otpClient.findMany({
            where: {
                identifier: {
                    contains: phone
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        });

        return NextResponse.json({
            phone,
            otps: otps.map((otp: any) => ({
                id: otp.id,
                identifier: otp.identifier,
                code: otp.code,
                codeType: typeof otp.code,
                codeLength: otp.code?.length,
                verified: otp.verified,
                attempts: otp.attempts,
                createdAt: otp.createdAt,
                expiresAt: otp.expiresAt,
                challengeId: otp.challengeId,
                isExpired: new Date() > otp.expiresAt
            }))
        });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
