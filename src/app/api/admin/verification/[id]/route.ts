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
            const updatedProfile = await prisma.freelancerProfile.update({
                where: { id: profileId },
                data: {
                    isVerified: false,
                    verificationDocs: null,
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
