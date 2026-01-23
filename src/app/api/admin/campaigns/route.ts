import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Helper to verify admin session
async function verifyAdminSession(request: NextRequest) {
    const authToken = request.cookies.get('auth-token')?.value;
    if (!authToken) return null;

    try {
        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET || 'fallback-secret-for-dev'
        );
        const { payload } = await jwtVerify(authToken, secret);
        if (payload.role !== 'ADMIN') return null;
        return { adminId: payload.userId as string, adminEmail: payload.email as string };
    } catch { return null; }
}

// GET /api/admin/campaigns - List all campaigns with stats
export async function GET(request: NextRequest) {
    try {
        const admin = await verifyAdminSession(request);
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const locationType = searchParams.get('type') || 'all';
        const status = searchParams.get('status') || 'all';

        const where: any = {};
        if (locationType !== 'all') {
            where.locationType = locationType;
        }
        if (status === 'active') {
            where.isActive = true;
        } else if (status === 'inactive') {
            where.isActive = false;
        }

        const campaigns = await prisma.campaign.findMany({
            where,
            include: {
                user: {
                    select: {
                        email: true,
                        name: true,
                        createdAt: true,
                        referredBy: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Get referral stats for each campaign
        const campaignsWithStats = await Promise.all(
            campaigns.map(async (campaign) => {
                // Count users who were referred by this code (case-insensitive)
                const referralCount = await prisma.user.count({
                    where: {
                        referredBy: {
                            equals: campaign.referralCode,
                            mode: 'insensitive'
                        }
                    }
                });

                // Count successful referrals (those who have completed bookings)
                const successfulReferrals = await prisma.user.count({
                    where: {
                        referredBy: {
                            equals: campaign.referralCode,
                            mode: 'insensitive'
                        },
                        bookings: {
                            some: {
                                status: 'COMPLETED'
                            }
                        }
                    }
                });

                // Calculate total earnings from referrals
                const bookings = await prisma.booking.findMany({
                    where: {
                        client: {
                            referredBy: {
                                equals: campaign.referralCode,
                                mode: 'insensitive'
                            }
                        },
                        status: 'COMPLETED'
                    },
                    select: {
                        totalPrice: true
                    }
                });

                const totalEarnings = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

                return {
                    id: campaign.id,
                    referralCode: campaign.referralCode,
                    name: campaign.name || `Campaign ${campaign.referralCode}`,
                    locationType: campaign.locationType,
                    locationAddress: campaign.locationAddress,
                    contactEmail: campaign.contactEmail,
                    contactPhone: campaign.contactPhone,
                    contactPerson: campaign.contactPerson,
                    city: campaign.city,
                    state: campaign.state,
                    notes: campaign.notes,
                    isActive: campaign.isActive,
                    qrPrinted: campaign.qrPrinted,
                    qrPrintedAt: campaign.qrPrintedAt,
                    createdAt: campaign.createdAt,
                    updatedAt: campaign.updatedAt,
                    userId: campaign.userId,
                    userEmail: campaign.user?.email,
                    userName: campaign.user?.name,
                    stats: {
                        totalReferrals: referralCount,
                        successfulReferrals,
                        pendingReferrals: referralCount - successfulReferrals,
                        totalEarnings
                    },
                    link: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/login?ref=${campaign.referralCode.toUpperCase()}`
                };
            })
        );

        return NextResponse.json({ campaigns: campaignsWithStats });

    } catch (error) {
        console.error('Campaigns fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
    }
}
