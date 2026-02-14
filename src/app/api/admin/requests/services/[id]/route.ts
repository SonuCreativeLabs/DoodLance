import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await req.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json(
                { error: 'Status is required' },
                { status: 400 }
            );
        }

        const updatedRequest = await db.serviceRequest.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(updatedRequest);
    } catch (error) {
        console.error('Error updating service request:', error);
        return NextResponse.json(
            { error: 'Failed to update service request' },
            { status: 500 }
        );
    }
}
