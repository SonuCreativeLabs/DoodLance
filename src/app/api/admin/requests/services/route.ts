import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        // In a real app, you would verify admin authentication here.
        // Assuming middleware or higher-level check handles basic auth, 
        // but explicit check is better. For now keeping it simple as per instructions.

        const requests = await db.serviceRequest.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
        });

        return NextResponse.json(requests);
    } catch (error) {
        console.error('Error fetching service requests:', error);
        return NextResponse.json(
            { error: 'Failed to fetch service requests' },
            { status: 500 }
        );
    }
}
