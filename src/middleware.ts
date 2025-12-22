import { authkitMiddleware } from '@workos-inc/authkit-nextjs';
import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const authkit = authkitMiddleware({
  redirectUri: process.env.WORKOS_REDIRECT_URI,
});

// JWT Secret for verification
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Protected API routes that require authentication
const protectedApiRoutes = [
  '/api/bookings',
  '/api/services/create',
  '/api/users/profile',
  '/api/wallet',
  '/api/payments',
];

// Admin-only API routes (except login/auth endpoints)
const adminOnlyRoutes = [
  '/api/admin',
];

// Public auth routes (no authentication required)
const publicAuthRoutes = [
  '/api/admin/auth/login',
  '/api/admin/auth/verify',
];

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const pathname = request.nextUrl.pathname;

  // Handle /post redirect
  if (pathname === '/post') {
    const response = NextResponse.redirect(new URL('/client/post', request.url));
    for (const [key, value] of request.headers) {
      response.headers.append(key, value);
    }
    return response;
  }

  // Skip auth middleware for IDE preview requests
  const userAgent = request.headers.get('user-agent') || '';
  const isIDEPreview = userAgent.includes('vscode') ||
    request.url.includes('vscodeBrowserReqId') ||
    request.headers.get('referer')?.includes('vscode') ||
    false;

  if (isIDEPreview) {
    return NextResponse.next();
  }

  // Check if this is a protected API route
  const isProtectedApiRoute = protectedApiRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminOnlyRoutes.some(route => pathname.startsWith(route));
  const isPublicAuthRoute = publicAuthRoutes.some(route => pathname.startsWith(route));

  // Skip authentication for public auth routes
  if (isPublicAuthRoute) {
    return NextResponse.next();
  }

  if (isProtectedApiRoute) {
    // Get token from Authorization header or cookies
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : request.cookies.get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      // Check admin permission for admin routes
      if (isAdminRoute && decoded.role !== 'admin' && decoded.role !== 'super_admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }

      // Add user info to headers for use in API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decoded.userId);
      requestHeaders.set('x-user-email', decoded.email);
      requestHeaders.set('x-user-role', decoded.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
  }

  // For non-API routes, use authkit middleware
  return authkit(request, event);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
