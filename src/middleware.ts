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

        // 1. Check for custom 'auth-token' first (for the custom Admin system)
        const authToken = request.cookies.get('auth-token')?.value;
        if (authToken) {
            try {
                const secret = new TextEncoder().encode(
                    process.env.JWT_SECRET || 'fallback-secret-for-dev'
                );
                const { payload } = await jwtVerify(authToken, secret);

                // Verify it's an admin token
                if (payload.role === 'ADMIN' || (payload.user_metadata as any)?.role === 'ADMIN') {
                    // Authorized via custom token!
                    return NextResponse.next();
                }
            } catch (err) {
                console.warn('Invalid auth-token found:', err);
                // Fall through to standard Supabase check
            }
        }

        // 2. Fallback: Create Supabase client to check standard session
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
        // Fix: Role check should be case-insensitive to match AdminAuthContext
        if (!role || role.toUpperCase() !== 'ADMIN') {
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
