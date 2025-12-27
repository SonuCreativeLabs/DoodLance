import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const { action } = await request.json();

        if (!id) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

        let updateData = {};

        switch (action) {
            case 'verify':
                updateData = { isVerified: true };
                break;
            case 'unverify':
                updateData = { isVerified: false };
                break;
            // case 'suspend':  // Schema needs update for this
            //   updateData = { isActive: false }; 
            //   break;
            // case 'activate':
            //   updateData = { isActive: true };
            //   break;
            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(updatedUser);

    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
