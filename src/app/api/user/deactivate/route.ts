import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error('[Account Deactivation] Auth Error:', authError);
            if (authError?.status === 504 || authError?.name === 'ConnectTimeoutError' || (authError as any)?.cause?.code === 'UND_ERR_CONNECT_TIMEOUT') {
                return NextResponse.json({ error: 'Connection to Auth server failed. Please try again.' }, { status: 503 });
            }
            return NextResponse.json({ error: 'Unauthorized: ' + (authError?.message || 'No user found') }, { status: 401 });
        }

        // Just update status to 'inactive'
        await prisma.user.update({
            where: { id: user.id },
            data: { status: 'inactive' }
        });

        console.log(`[Account Deactivation] User ${user.id} status set to inactive (hold).`);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Account deactivation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to deactivate account' },
            { status: 500 }
        );
    }
}
