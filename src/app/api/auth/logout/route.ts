import { signOut } from '@workos-inc/authkit-nextjs';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const returnTo = request.nextUrl.searchParams.get('returnTo') ?? undefined;
  return signOut({ returnTo });
}

export async function POST(request: NextRequest) {
  const returnTo = request.nextUrl.searchParams.get('returnTo') ?? undefined;
  return signOut({ returnTo });
}
