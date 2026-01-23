import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Helper to verify admin session
async function verifyAdminSession(request: NextRequest) {
    const authToken = request.cookies.get('auth-token')?.value;
    if (!authToken) {
        return null;
    }

    try {
        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET || 'fallback-secret-for-dev'
        );
        const { payload } = await jwtVerify(authToken, secret);

        if (payload.role !== 'ADMIN') {
            return null;
        }

        return {
            adminId: payload.userId as string,
            adminEmail: payload.email as string
        };
    } catch (error) {
        return null;
    }
}

// Parse emails from text (comma or newline separated)
function parseEmails(text?: string): string[] {
    if (!text) return [];
    return text
        .split(/[,\n]/)
        .map(email => email.trim())
        .filter(email => email.length > 0 && email.includes('@'));
}

// POST /api/admin/campaigns/bulk - Bulk create campaigns
export async function POST(request: NextRequest) {
    try {
        const admin = await verifyAdminSession(request);
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { locationType, quantity, startSequence, bulkEmails } = body;

        if (!locationType || !quantity || quantity < 1 || quantity > 100) {
            return NextResponse.json(
                { error: 'Invalid parameters. Quantity must be between 1-100' },
                { status: 400 }
            );
        }

        const start = startSequence || 1;
        const campaigns: any[] = [];
        const createdUsers: any[] = [];

        // Parse bulk emails if provided
        const emailList = parseEmails(bulkEmails);

        // Find the highest existing sequence number to avoid conflicts
        const existingCampaigns = await prisma.campaign.findMany({
            where: {
                referralCode: {
                    startsWith: 'campaign_bails'
                }
            },
            select: { referralCode: true }
        });

        const existingNumbers = existingCampaigns.map((c: any) => {
            const match = c.referralCode.match(/campaign_bails(\d+)/);
            return match ? parseInt(match[1]) : 0;
        });

        const maxExisting = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
        const actualStart = Math.max(start, maxExisting + 1);

        for (let i = 0; i < quantity; i++) {
            const sequenceNum = actualStart + i;
            const referralCode = `campaign_bails${sequenceNum}`;

            // Use campaigns_bails format for placeholder emails
            const email = emailList[i] || `campaigns_${referralCode}@placeholder.bails.in`;

            try {
                // Check if this code already exists
                const existing = await prisma.campaign.findUnique({
                    where: { referralCode }
                });

                if (existing) {
                    console.log(`Skipping ${referralCode} - already exists`);
                    continue;
                }

                // Create user in Prisma DB only (no Supabase Auth)
                const user = await prisma.user.create({
                    data: {
                        email: email,
                        name: `Campaign ${referralCode}`,
                        role: 'client',
                        status: 'active',
                        isVerified: false,
                        referralCode: referralCode,
                        coords: '0,0',
                    }
                });

                // Create campaign
                const campaign = await prisma.campaign.create({
                    data: {
                        referralCode,
                        userId: user.id,
                        locationType,
                        contactEmail: emailList[i] || null,
                        isActive: true,
                        createdBy: admin.adminId
                    }
                });

                campaigns.push({
                    id: campaign.id,
                    code: referralCode,
                    email: email,
                    link: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/login?ref=${referralCode.toUpperCase()}`
                });

                createdUsers.push(user);

            } catch (error) {
                console.error(`Error creating campaign ${referralCode}:`, error);
            }
        }

        return NextResponse.json({
            success: true,
            campaigns,
            created: campaigns.length,
            message: `Successfully created ${campaigns.length} campaigns`
        });

    } catch (error) {
        console.error('Bulk campaign creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create campaigns' },
            { status: 500 }
        );
    }
}
