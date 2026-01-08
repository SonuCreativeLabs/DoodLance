import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const serviceId = params.id;
        const body = await request.json();
        const { action, isActive, title, price, description, category, deliveryTime } = body;

        let updateData: any = {};

        // Handle Status Actions
        if (action === 'approve') {
            updateData.isActive = true;
        } else if (action === 'reject') {
            updateData.isActive = false;
        } else if (typeof isActive !== 'undefined') {
            updateData.isActive = isActive;
        }

        // Handle Field Updates
        if (title) updateData.title = title;
        if (price) updateData.price = parseFloat(price);
        if (description) updateData.description = description;
        if (category) updateData.category = category;
        if (deliveryTime) updateData.deliveryTime = deliveryTime;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No valid fields provided' }, { status: 400 });
        }

        const updatedService = await prisma.service.update({
            where: { id: serviceId },
            data: updateData
        });

        return NextResponse.json(updatedService);

    } catch (error) {
        console.error('Update service error:', error);
        return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.service.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
