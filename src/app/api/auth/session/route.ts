import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { sendMetaEvent, hashData } from '@/lib/meta-capi';

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

            // Fetch user from database to get display ID
            const prisma = (await import('@/lib/db')).default;
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: { displayId: true }
            });

            return NextResponse.json({
                user: {
                    id: decoded.userId,
                    displayId: user?.displayId || null,
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
// POST /api/auth/session - Set session cookies
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { user } = body;

        if (!user || !user.id || !user.email) {
            return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
        }

        const { generateAuthTokens, setAuthCookies } = await import('@/lib/auth/jwt');

        // Generate tokens
        const tokens = generateAuthTokens({
            id: user.id,
            email: user.email,
            role: user.role || 'client'
        });

        // Set cookies
        await setAuthCookies(tokens.accessToken, tokens.refreshToken);

        // If user has referredBy in metadata, save it to database
        if (user.referredBy) {
            try {
                const prisma = (await import('@/lib/db')).default;
                await prisma.user.update({
                    where: { id: user.id },
                    data: { referredBy: user.referredBy }
                });
                console.log(`✅ Saved referredBy: ${user.referredBy} for user ${user.id}`);
            } catch (dbError) {
                console.error('Failed to save referredBy:', dbError);
            }
        }

        // Check if this is a new signup for Meta Tracking
        try {
            const prisma = (await import('@/lib/db')).default;
            const dbUser = await prisma.user.findUnique({
                where: { id: user.id },
                select: { createdAt: true, email: true, phone: true }
            });

            if (dbUser) {
                const now = new Date();
                const createdAt = new Date(dbUser.createdAt);
                const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

                // If created in the last 2 minutes, consider it a new registration
                if (diffMinutes < 2) {
                    console.log('🚀 New User Detected! Triggering Meta CompleteRegistration');
                    sendMetaEvent({
                        event_name: 'CompleteRegistration',
                        event_id: `signup_${user.id}`,
                        event_source_url: request.url,
                        user_data: {
                            em: [hashData(dbUser.email)],
                            ph: dbUser.phone ? [hashData(dbUser.phone)] : undefined,
                            client_ip_address: request.headers.get('x-forwarded-for') || undefined,
                            client_user_agent: request.headers.get('user-agent') || undefined,
                        },
                        custom_data: {
                            content_name: 'Signup',
                            status: 'success'
                        }
                    });
                }
            }
        } catch (capiError) {
            console.error('Failed to track CompleteRegistration:', capiError);
        }

        return NextResponse.json({ success: true, user: { ...user, role: user.role || 'client' } });
    } catch (error) {
        console.error('Session API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
