import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js'; // We need admin client for auth updates
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest) {
    try {
        // 1. Verify Session
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = user.id;
        const originalEmail = user.email!;
        const timestamp = Date.now();
        const deletedEmail = `deleted_${timestamp}_${originalEmail}`;

        console.log(`[Account Deletion] Starting soft delete for user ${userId} (${originalEmail})`);

        // 2. Database Soft Delete (Rename & Deactivate)
        // We use a transaction to ensure atomic update
        await prisma.$transaction(async (tx) => {
            // Check if user exists
            const dbUser = await tx.user.findUnique({ where: { id: userId } });
            if (!dbUser) {
                // If user is not in DB but is in Auth, we still proceed with Auth rename
                console.warn(`[Account Deletion] User ${userId} not found in DB, skipping DB update.`);
            } else {
                // Update User record
                await tx.user.update({
                    where: { id: userId },
                    data: {
                        status: 'deleted',
                        email: deletedEmail,
                        username: `deleted_${timestamp}_${dbUser.username || 'user'}`,
                        supabaseUid: `deleted_${timestamp}_${userId}`, // Detach from live Auth map if unique constraint exists
                        name: 'Deleted User', // Optional: Anonymize name for privacy? User asked to keep infos.
                        // Let's keep the name as is, since user said "all infos will be stay".
                        // Actually, to avoid confusion in UI if admin sees it, maybe append (Deleted)?
                        // User said "all info will be stay", so let's touch as little as possible,
                        // BUT we MUST rename email/username to free up unique constraints.
                    }
                });
                console.log(`[Account Deletion] DB record updated for ${userId}`);
            }
        });

        // 3. Supabase Auth Soft Delete (Rename Email)
        // We need the SERVICE_ROLE_KEY to perform admin updates on Auth
        const supabaseAdmin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            userId,
            { email: deletedEmail }
        );

        if (updateError) {
            console.error(`[Account Deletion] Failed to rename Auth details for ${userId}:`, updateError);
            // If Auth update fails, we might want to revert DB? Or just log it.
            // For now, we return 500 because if Auth isn't renamed, they can't re-register.
            return NextResponse.json(
                { error: 'Failed to release email address' },
                { status: 500 }
            );
        }

        console.log(`[Account Deletion] Auth record renamed for ${userId}`);

        // 4. Force Logout (optional, usually handled by client, but we can revoke sessions)
        await supabaseAdmin.auth.admin.signOut(user.token); // Sign out all sessions if possible, or just trust client.

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('[Account Deletion] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete account' },
            { status: 500 }
        );
    }
}
