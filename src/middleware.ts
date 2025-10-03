import { authkitMiddleware } from '@workos-inc/authkit-nextjs';
import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';

const authkit = authkitMiddleware({
  redirectUri: process.env.WORKOS_REDIRECT_URI,
});

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const pathname = request.nextUrl.pathname;

  if (pathname === '/post') {
    const response = NextResponse.redirect(new URL('/client/post', request.url));
    for (const [key, value] of request.headers) {
      response.headers.append(key, value);
    }
    return response;
  }

  return authkit(request, event);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};