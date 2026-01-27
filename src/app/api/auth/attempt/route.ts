import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sendAdminNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Check if user already exists in our database
        console.log(`[API] 🔍 Auth Attempt Check for: ${email}`);

        // We only want to notify for POTENTIAL NEW users (Signups)
        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true, isVerified: true, createdAt: true }
        });

        if (existingUser) {
            // User exists.

            // 1. If user is VERIFIED, it's a login -> Skip notification
            if (existingUser.isVerified) {
                console.log(`[API] 👤 Verified User Login: ${existingUser.id}`);
                return NextResponse.json({
                    isNewUser: false,
                    existingUserId: existingUser.id,
                    isVerified: true,
                    message: 'Verified user login - no notification sent'
                });
            }

            // 2. If user is NOT VERIFIED, it's a Pending Signup / Retry -> Send Notification
            console.log(`[API] ⚠️ Unverified User Retry: ${existingUser.id} - Sending Alert`);
            // Fall through to send notification...
        }

        // User does NOT exist -> PROBABLE NEW SIGNUP
        console.log(`[API] 📧 Sending admin alert for new signup attempt: ${email}`);

        const subject = `[BAILS] 🚀 New Signup Attempt: ${email}`;
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <h2 style="color: #6B46C1; text-align: center;">New Signup Attempt 🚀</h2>
                <p style="color: #555; text-align: center;">A visitor has requested an OTP to sign up.</p>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
                    <p style="margin: 8px 0;"><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                    <p style="margin: 8px 0; font-size: 12px; color: #777;"><em>Note: They have requested an OTP but haven't verified it yet.</em></p>
                </div>

                <div style="text-align: center; margin-top: 20px;">
                    <p style="font-size: 12px; color: #999;">
                        BAILS Admin Notification
                    </p>
                </div>
            </div>
        `;

        // Fire and forget - don't block the response
        await sendAdminNotification(
            subject,
            `New signup attempt by ${email}`,
            htmlContent
        ).catch(err => console.error(`[API] ❌ Failed to send signup alert for ${email}:`, err));

        return NextResponse.json({ isNewUser: true, notificationSent: true });

    } catch (error) {
        console.error('[API] Error processing auth attempt:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
