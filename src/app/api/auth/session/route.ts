import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const cookieStore = cookies();
        const accessToken = cookieStore.get('access_token')?.value;

        if (!accessToken) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        try {
            const decoded = verifyAccessToken(accessToken);

            return NextResponse.json({
                user: {
                    id: decoded.userId,
                    email: decoded.email,
                    role: decoded.role,
                },
                expires: new Date(decoded.exp * 1000).toISOString()
            });
        } catch (err) {
            // Token invalid or expired
            return NextResponse.json({ user: null }, { status: 401 });
        }
    } catch (error) {
        console.error('Session API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
