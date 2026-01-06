import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// PATCH /api/admin/verification/[id] - Verify or reject a user
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { action, notes } = body;

        // Extract userId from KYC ID format (KYC123ABC -> find user)
        // Or if the id is already a userId, use it directly
        let userId = params.id;

        // If it starts with "KYC", it's our formatted ID - extract the user ID
        if (userId.startsWith('KYC')) {
            // We need to find the user by matching the ID pattern
            // Since we created the format as KYC{first6chars}, we need to search
            // For simplicity, let's assume the frontend passes the actual userId
            // or we store it properly. For now, extract after KYC prefix
            const idPart = userId.substring(3).toLowerCase();

            // Find user whose ID starts with this pattern
            const users = await prisma.user.findMany({
                where: {
                    id: {
                        startsWith: idPart
                    }
                },
                take: 1
            });

            if (users.length === 0) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            userId = users[0].id;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (action === 'verify') {
            // Verify the user
            await prisma.user.update({
                where: { id: userId },
                data: {
                    isVerified: true,
                    updatedAt: new Date()
                }
            });

            // TODO: Send notification to user about verification success
            // eventEmitter.emit('userVerified', { userId, notes });

            return NextResponse.json({
                success: true,
                message: 'User verified successfully'
            });

        } else if (action === 'reject') {
            // Reject verification (keep isVerified as false)
            await prisma.user.update({
                where: { id: userId },
                data: {
                    isVerified: false,
                    updatedAt: new Date()
                }
            });

            // TODO: Send notification to user about rejection with reason
            // eventEmitter.emit('userRejected', { userId, notes });

            return NextResponse.json({
                success: true,
                message: 'Verification rejected',
                notes
            });

        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

    } catch (error) {
        console.error('Verification action error:', error);
        return NextResponse.json({ error: 'Failed to process verification' }, { status: 500 });
    }
}
