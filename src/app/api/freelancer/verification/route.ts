import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { documentUrl, idType, idNumber, selfieUrl } = body;

        if (!documentUrl || !idType || !idNumber) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Get profile
        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: user.id }
        });

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // Create verification docs object
        const verificationDocs = {
            idType,
            idNumber,
            documentUrl,
            selfieUrl,
            submittedAt: new Date().toISOString()
        };


        // Update profile
        await prisma.freelancerProfile.update({
            where: { id: profile.id },
            data: {
                verificationDocs: JSON.stringify(verificationDocs),
                isVerified: false, // Pending verification
            }
        });

        // Send Admin Notification
        try { // Wrap in try-catch to not block response
            const userData = await prisma.user.findUnique({
                where: { id: user.id },
                select: { name: true, email: true }
            });

            if (userData) {
                const { sendAdminNotification } = await import('@/lib/email');
                const subject = `KYC Documents Uploaded: ${userData.name || 'Freelancer'}`;
                const htmlContent = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                        <h2 style="color: #6B46C1; text-align: center;">KYC Documents Submitted 📄</h2>
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
                            <p><strong>Freelancer:</strong> ${userData.name}</p>
                            <p><strong>Email:</strong> ${userData.email}</p>
                            <p><strong>ID Type:</strong> ${idType}</p>
                            <p><strong>Submitted At:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                        </div>
                        <div style="text-align: center; margin-top: 20px;">
                            <a href="https://bails.in/admin/verifications" style="background-color: #6B46C1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Review Documents</a>
                        </div>
                    </div>
                `;

                await sendAdminNotification(
                    subject,
                    `New KYC documents submitted by ${userData.name} (${userData.email})`,
                    htmlContent
                );
            }
        } catch (mailError) {
            console.error('Failed to send admin verification email:', mailError);
        }


        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Verification submission error:', error);
        return NextResponse.json({ error: 'Failed to submit verification' }, { status: 500 });
    }
}
