import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { z } from 'zod';

const requestSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    sport: z.string().min(1, 'Sport is required').optional(),
    details: z.string().min(1, 'Please provide more details about the service'),
    userId: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validation = requestSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid request data', details: validation.error.format() },
                { status: 400 }
            );
        }

        const { name, email, sport, details, userId } = validation.data;

        const serviceRequest = await db.serviceRequest.create({
            data: {
                name,
                email,
                sport: sport || 'Uncategorized',
                details,
                userId,
                status: 'PENDING',
            },
        });

        return NextResponse.json(serviceRequest, { status: 201 });
    } catch (error) {
        console.error('Error creating service request:', error);
        return NextResponse.json(
            { error: 'Failed to create service request' },
            { status: 500 }
        );
    }
}
