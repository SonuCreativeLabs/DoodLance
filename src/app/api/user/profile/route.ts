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
            include: {
                freelancerProfile: {
                    select: {
                        dateOfBirth: true,
                        isOnline: true,
                        cricketRole: true,
                        title: true,
                        coverImage: true,
                    }
                }
            }
        });

        if (!dbUser) {
            console.log(`[API] User ${user.id} not found in DB, creating new record...`);

            try {
                // Generate Referral Code (BAILS + Sequence)
                let referralCode = null;
                try {
                    // Fetch and increment sequence in a transaction to minimize race conditions
                    // Note: 'value' is a string, so we can't use atomic increment directly unless we change schema
                    // We'll use a read-write approach. If concurrency is high, this might need a lock or int field.
                    const config = await prisma.systemConfig.findUnique({ where: { key: 'NEXT_REFERRAL_SEQUENCE' } });
                    let sequence = 22; // Default start if missing
                    if (config) {
                        sequence = parseInt(config.value);
                    }
                    referralCode = `BAILS${sequence}`;

                    await prisma.systemConfig.upsert({
                        where: { key: 'NEXT_REFERRAL_SEQUENCE' },
                        update: { value: (sequence + 1).toString() },
                        create: { key: 'NEXT_REFERRAL_SEQUENCE', value: (sequence + 1).toString() }
                    });
                } catch (e) {
                    console.error('[API] Failed to generate referral code, falling back to lazy generation:', e);
                }

                // Auto-create user if they exist in Auth but not in DB (Self-healing)
                // Use upsert to handle race conditions where parallel requests try to create
                const referredBy = user.user_metadata?.referredBy || null;
                if (referredBy) {
                    console.log(`[API] New user ${user.id} was referred by: ${referredBy}`);
                }
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
                        referralCode: referralCode, // Add generated code
                        referredBy: referredBy,
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


                // Create Welcome Notification
                try {
                    await prisma.notification.create({
                        data: {
                            userId: newDbUser.id,
                            title: 'Welcome to BAILS! 🎉',
                            message: `Hi ${newDbUser.name}, welcome to BAILS! Complete your profile to get started.`,
                            type: 'WELCOME',
                            entityId: newDbUser.id,
                            entityType: 'user',
                            actionUrl: '/client/profile',
                        }
                    });
                } catch (notifError) {
                    console.error('[API] Failed to create welcome notification:', notifError);
                }

                // Send Admin Notification
                const { sendAdminNotification } = await import('@/lib/email');

                const subject = `New User Signup: ${newDbUser.name || 'User'}`;
                const htmlContent = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                        <h2 style="color: #6B46C1; text-align: center;">New User Signup 🎉</h2>
                        <p style="color: #555; text-align: center;">A new user has joined the platform.</p>
                        
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
                            <p style="margin: 8px 0;"><strong>Name:</strong> ${newDbUser.name}</p>
                            <p style="margin: 8px 0;"><strong>Email:</strong> ${newDbUser.email}</p>
                            <p style="margin: 8px 0;"><strong>Role:</strong> ${newDbUser.role}</p>
                            <p style="margin: 8px 0;"><strong>Joined:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                        </div>

                        <div style="text-align: center; margin-top: 20px;">
                            <a href="https://bails.in/admin/users?search=${newDbUser.email}" style="background-color: #6B46C1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View User</a>
                        </div>
                        
                        <p style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
                            User ID: ${newDbUser.id}
                        </p>
                    </div>
                `;

                await sendAdminNotification(
                    subject,
                    `New user signed up: ${newDbUser.name} (${newDbUser.email})`,
                    htmlContent
                ).catch(err => console.error('Failed to send admin notification:', err));

                return NextResponse.json(newDbUser);
            } catch (createError: any) {
                console.error('[API] Failed to auto-create user:', createError);

                // Handle email collision (P2002)
                if (createError.code === 'P2002' && Array.isArray(createError.meta?.target) && createError.meta.target.includes('email')) {
                    console.log('[API] Email conflict detected, returning existing user...');
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email }
                    });
                    if (existingUser) {
                        // Return the existing user so the frontend receives data
                        // We might want to log a warning that IDs mismatch
                        console.warn(`[API] ID Mismatch: Supabase(${user.id}) vs DB(${existingUser.id}) for email ${user.email}`);

                        // Optional: Try to update some fields if needed, but be careful with ID
                        return NextResponse.json(existingUser);
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

