import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { jwtVerify } from 'jose';

// Helper: Ensure we have a valid admin token
export async function GET(req: NextRequest) {
    try {
        const authToken = req.cookies.get('auth-token')?.value;

        if (!authToken) {
            return NextResponse.json({ error: 'No token found' }, { status: 401 });
        }

        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET || 'fallback-secret-for-dev'
        );

        // Verify JWT
        const { payload } = await jwtVerify(authToken, secret);

        if (payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Invalid role' }, { status: 403 });
        }

        const userId = payload.userId as string;

        // Optional: Re-fetch latest details from DB to ensure still active
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

        const supabase = (supabaseUrl && supabaseServiceKey)
            ? createClient(supabaseUrl, supabaseServiceKey)
            : null;

        if (!supabase) {
            return NextResponse.json({ error: 'Service Unavailable' }, { status: 503 });
        }

        const { data: admin, error } = await supabase
            .from('admins')
            .select('*')
            .eq('id', userId)
            .eq('is_active', true)
            .single();

        if (error || !admin) {
            return NextResponse.json({ error: 'User not found or inactive' }, { status: 401 });
        }

        const { password_hash, ...adminData } = admin;

        return NextResponse.json({
            success: true,
            admin: {
                id: adminData.id,
                email: adminData.email,
                name: adminData.name,
                role: adminData.role,
                permissions: adminData.permissions || [],
                avatar: adminData.avatar,
                lastLoginAt: adminData.last_login_at
            }
        });

    } catch (error) {
        console.error('Auth Check Error:', error);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}
