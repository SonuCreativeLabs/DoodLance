import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const results = {
        prismaConnection: 'PENDING',
        userCount: -1,
        freelancerCount: -1,
        supabaseConnection: 'PENDING',
        supabaseUser: 'NONE',
        error: null as string | null
    };

    try {
        // 1. Check Prisma
        results.userCount = await prisma.user.count();
        results.freelancerCount = await prisma.freelancerProfile.count();
        results.prismaConnection = 'SUCCESS';

        // 2. Check Supabase
        try {
            const supabase = createClient();
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                // It's expected to fail if no cookie, but should not throw
                results.supabaseConnection = 'CHECKED (No Cookie)';
                results.supabaseUser = error.message;
            } else {
                results.supabaseConnection = 'SUCCESS';
                results.supabaseUser = data.user ? data.user.id : 'NO_SESSION';
            }
        } catch (sbError: any) {
            results.supabaseConnection = 'FAILED';
            results.supabaseUser = sbError.message;
        }

        return NextResponse.json(results);
    } catch (e: any) {
        console.error('Test DB Error:', e);
        results.error = e.message;
        return NextResponse.json(results, { status: 500 });
    }
}
