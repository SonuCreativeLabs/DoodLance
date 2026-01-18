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

        // Check for New User (created within last 2 minutes)
        if (user.createdAt) {
            const createdAt = new Date(user.createdAt).getTime();
            const now = Date.now();
            const isNewUser = (now - createdAt) < 2 * 60 * 1000; // 2 minutes

            if (isNewUser) {
                // Send Admin Notification asynchronously
                (async () => {
                    try {
                        const { sendAdminNotification } = await import('@/lib/email');
                        const subject = `New User Signup: ${user.name || 'User'}`;
                        const message = `A new user has signed up.\n\nName: ${user.name || 'N/A'}\nEmail: ${user.email}\nPhone: ${user.phone || 'N/A'}\nRole: ${user.role}`;

                        const html = `
                            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                                <h2 style="color: #6B46C1;">New User Signup 🎉</h2>
                                <p><strong>Name:</strong> ${user.name || 'N/A'}</p>
                                <p><strong>Email:</strong> ${user.email}</p>
                                <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
                                <p><strong>Role:</strong> ${user.role}</p>
                                <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN')}</p>
                            </div>
                        `;

                        await sendAdminNotification(subject, message, html);
                        console.log('📧 New user notification sent for:', user.email);
                    } catch (emailErr) {
                        console.error('Failed to send new user notification:', emailErr);
                    }
                })();
            }
        }

        return NextResponse.json({ success: true, user: { ...user, role: user.role || 'client' } });
    } catch (error) {
        console.error('Session API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
