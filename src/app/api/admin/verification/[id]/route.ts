import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { logAdminAction } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const profileId = params.id;
        const body = await request.json();
        const { action, notes } = body;

        if (action === 'verify') {
            const updatedProfile = await prisma.freelancerProfile.update({
                where: { id: profileId },
                data: {
                    isVerified: true,
                    verifiedAt: new Date(),
                    // We should also update the User.isVerified flag to be consistent
                    user: {
                        update: {
                            isVerified: true
                        }
                    }
                },
                include: { user: true }
            });

            await logAdminAction({
                adminId: 'admin-1',
                adminEmail: 'admin@doodlance.com',
                action: 'VERIFY',
                resource: 'KYC',
                resourceId: profileId,
                details: { userName: updatedProfile.user.name, email: updatedProfile.user.email },
                request
            });

            return NextResponse.json(updatedProfile);
        } else if (action === 'reject') {
            // Fetch current docs first to preserve them avoiding data loss
            const currentProfile = await prisma.freelancerProfile.findUnique({
                where: { id: profileId },
                select: { verificationDocs: true }
            });

            let currentDocs = {};
            try {
                if (currentProfile?.verificationDocs) {
                    currentDocs = JSON.parse(currentProfile.verificationDocs);
                }
            } catch (e) {
                // If it was a raw string? wrap it
                currentDocs = { raw: currentProfile?.verificationDocs };
            }

            // Mark as rejected in the JSON blob
            const updatedDocs = {
                ...currentDocs,
                kycStatus: 'rejected',
                rejectionReason: notes,
                rejectedAt: new Date().toISOString()
            };

            const updatedProfile = await prisma.freelancerProfile.update({
                where: { id: profileId },
                data: {
                    isVerified: false,
                    verificationDocs: JSON.stringify(updatedDocs),
                    user: {
                        update: {
                            isVerified: false
                        }
                    }
                },
                include: { user: true }
            });

            await logAdminAction({
                adminId: 'admin-1',
                adminEmail: 'admin@doodlance.com',
                action: 'REJECT',
                resource: 'KYC',
                resourceId: profileId,
                details: { reason: notes, userName: updatedProfile.user.name },
                request
            });

            return NextResponse.json(updatedProfile);
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Verification action error:', error);
        return NextResponse.json({ error: 'Failed to update verification status' }, { status: 500 });
    }
}
