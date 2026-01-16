import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { updateSession } from '@/lib/supabase/middleware';

// Rate limiting storage (in-memory for development, use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function rateLimit(ip: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
        return true;
    }

    if (record.count >= limit) {
        return false;
    }

    record.count++;
    return true;
}

export async function middleware(request: NextRequest) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

    // Rate limiting for API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {

        const isAdminApi = request.nextUrl.pathname.startsWith('/api/admin/');
        const isAuthApi = request.nextUrl.pathname.startsWith('/api/auth/');

        let limit = 30; // Default: 30 req/min
        const windowMs = 60 * 1000; // 1 minute

        if (isAdminApi) {
            limit = 1000; // Admin: 100 req/min
        } else if (isAuthApi) {
            limit = 600; // Auth: 60 req/min
        } else {
            limit = 1000 // Default increased for debugging
        }

        if (!rateLimit(ip, limit, windowMs)) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }
    }

    // Admin route protection (except login page and auth endpoints)
    if ((request.nextUrl.pathname.startsWith('/admin') ||
        request.nextUrl.pathname.startsWith('/api/admin')) &&
        request.nextUrl.pathname !== '/admin/login' &&
        !request.nextUrl.pathname.startsWith('/api/admin/auth')) {

        // Create Supabase client to check session
        // Note: We need to use createServerClient here manually or leverage updateSession
        // But since updateSession is at the end, we validatng here.
        // Actually, let's use the helper from @supabase/ssr

        const { createServerClient } = await import('@supabase/ssr');

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                    },
                },
            }
        );

        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            if (request.nextUrl.pathname.startsWith('/api/admin')) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            const redirectUrl = new URL('/admin/login', request.url);
            redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
            return NextResponse.redirect(redirectUrl);
        }

        // Check for ADMIN role
        const role = user.user_metadata?.role;
        if (role !== 'ADMIN') {
            console.warn('Unauthorized access attempt: User is not an ADMIN', { role, ip });
            if (request.nextUrl.pathname.startsWith('/api/admin')) {
                return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
            }
            const redirectUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(redirectUrl);
        }

        // Allowed
    }

    return await updateSession(request);
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/:path*'
    ],
};
