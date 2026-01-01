import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export async function PATCH(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, phone, location, avatarUrl, gender, bio } = body;

        const updates: any = {};
        if (name !== undefined) updates.name = name;
        if (phone !== undefined) updates.phone = phone;
        if (location !== undefined) updates.location = location;
        if (avatarUrl !== undefined) updates.avatar = avatarUrl;
        if (gender !== undefined) updates.gender = gender;
        if (bio !== undefined) updates.bio = bio;

        if (Object.keys(updates).length > 0) {
            await prisma.user.update({
                where: { id: user.id },
                data: updates
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('User update error:', error);
        return NextResponse.json(
            { error: 'Failed to update user profile' },
            { status: 500 }
        );
    }
}
