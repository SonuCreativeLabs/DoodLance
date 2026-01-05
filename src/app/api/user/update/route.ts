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

        // Check DB connection explicitly
        try {
            await prisma.$connect();
        } catch (dbError: any) {
            console.error('Database connection failed:', dbError);
            return NextResponse.json({
                error: `Database connection failed: ${dbError.message}`,
                details: String(dbError)
            }, { status: 503 });
        }

        if (Object.keys(updates).length > 0) {
            await prisma.user.upsert({
                where: { id: user.id },
                update: updates,
                create: {
                    id: user.id,
                    email: user.email!,
                    role: 'client', // Default role for new users
                    coords: '[0,0]', // Default coords
                    ...updates
                }
            });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('User update error:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        return NextResponse.json(
            { error: `Failed to update user profile: ${error.message}` },
            { status: 500 }
        );
    }
}
