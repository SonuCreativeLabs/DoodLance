import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check admin role via database
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true }
        });

        if (!dbUser || dbUser.role !== 'admin') {
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
