import { getSignInUrl } from '@workos-inc/authkit-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

async function redirectToSignIn(request: NextRequest) {
  const returnTo = request.nextUrl.searchParams.get('returnTo');
  const promptParam = request.nextUrl.searchParams.get('prompt');
  const prompt = promptParam === 'consent' ? 'consent' : undefined;

  const url = await getSignInUrl({
    redirectUri: process.env.WORKOS_REDIRECT_URI,
    prompt,
  });

  const destination = returnTo ? new URL(url) : url;

  if (returnTo) {
    const parsed = new URL(destination.toString());
    parsed.searchParams.set('return_to', returnTo);
    return NextResponse.redirect(parsed);
  }

  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  return redirectToSignIn(request);
}

export async function POST(request: NextRequest) {
  return redirectToSignIn(request);
}
