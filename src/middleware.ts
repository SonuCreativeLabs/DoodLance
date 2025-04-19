import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /post)
  const pathname = request.nextUrl.pathname

  // If the pathname is /post, redirect to /client/post
  if (pathname === '/post') {
    return NextResponse.redirect(new URL('/client/post', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/post']
} 