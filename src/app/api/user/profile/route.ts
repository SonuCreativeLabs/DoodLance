import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/user/profile - Get current user profile
export async function GET(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Query user from database
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                avatar: true,
                location: true,
                bio: true,
                gender: true,
                username: true,
                displayId: true,
                address: true,
                area: true,
                city: true,
                state: true,
                postalCode: true,
                role: true,
                currentRole: true,
                isVerified: true,
                phoneVerified: true,
                createdAt: true,
            }
        });

        if (!dbUser) {
            console.log(`[API] User ${user.id} not found in DB, creating new record...`);

            try {
                // Auto-create user if they exist in Auth but not in DB (Self-healing)
                // Use upsert to handle race conditions where parallel requests try to create
                const newDbUser = await prisma.user.upsert({
                    where: { id: user.id },
                    update: {},
                    create: {
                        id: user.id,
                        email: user.email!,
                        name: user.user_metadata?.name || user.user_metadata?.full_name || user.email!.split('@')[0],
                        role: 'client', // Default role
                        coords: '[0,0]',
                        isVerified: false,
                        referredBy: user.user_metadata?.referredBy || null,
                    },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        phone: true,
                        avatar: true,
                        location: true,
                        bio: true,
                        gender: true,
                        username: true,
                        displayId: true,
                        address: true,
                        area: true,
                        city: true,
                        state: true,
                        postalCode: true,
                        role: true,
                        currentRole: true,
                        isVerified: true,
                        phoneVerified: true,
                        createdAt: true,
                    }
                });
                return NextResponse.json(newDbUser);
            } catch (createError: any) {
                console.error('[API] Failed to auto-create user:', createError);

                // Handle email collision (P2002)
                if (createError.code === 'P2002' && Array.isArray(createError.meta?.target) && createError.meta.target.includes('email')) {
                    console.log('[API] Email conflict detected, linking to existing user...');
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email }
                    });
                    if (existingUser) {
                        // Link new Supabase ID to existing user
                        const updated = await prisma.user.update({
                            where: { id: existingUser.id },
                            data: { supabaseUid: user.id },
                            select: {
                                id: true,
                                email: true,
                                name: true,
                                phone: true,
                                avatar: true,
                                location: true,
                                bio: true,
                                gender: true,
                                username: true,
                                displayId: true,
                                address: true,
                                area: true,
                                city: true,
                                state: true,
                                postalCode: true,
                                role: true,
                                currentRole: true,
                                isVerified: true,
                                phoneVerified: true,
                                createdAt: true,
                            }
                        });
                        return NextResponse.json(updated);
                    }
                }

                // Try one last fetch by ID
                const retryUser = await prisma.user.findUnique({ where: { id: user.id } });
                if (retryUser) return NextResponse.json(retryUser);

                return NextResponse.json(
                    { error: 'Failed to create user profile' },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json(dbUser);

    } catch (error) {
        console.error('[API] Error fetching user profile:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user profile' },
            { status: 500 }
        );
    }
}
