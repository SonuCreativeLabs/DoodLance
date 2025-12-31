import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { validateSession } from '@/lib/auth/jwt';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await validateSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;
        const body = await request.json();

        // actions (suspend/verify) should now go through /api/admin/users/action
        if (body.action) {
            return NextResponse.json({ error: 'Use /api/admin/users/action for state changes' }, { status: 400 });
        }

        // Placeholder for future profile updates (name, email, etc.)
        // This endpoint can be expanded when we implement direct profile editing from admin

        return NextResponse.json({ message: 'Profile update not implemented yet' }, { status: 501 });

    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
