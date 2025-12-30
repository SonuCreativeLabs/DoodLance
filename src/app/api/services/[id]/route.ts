import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { validateSession } from '@/lib/auth/jwt';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/services/[id]
 * Update a service
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await validateSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const serviceId = params.id;
        const body = await request.json();

        // Verify ownership
        const existingService = await prisma.service.findUnique({
            where: { id: serviceId },
            select: { providerId: true }
        });

        if (!existingService) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        if (existingService.providerId !== session.userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Map fields
        const updateData: any = {};
        if (body.title) updateData.title = body.title;
        if (body.description !== undefined) updateData.description = body.description;
        if (body.price) {
            updateData.price = parseFloat(body.price.replace(/[^0-9.]/g, ''));
        }
        if (body.deliveryTime) updateData.deliveryTime = body.deliveryTime;
        if (body.type) updateData.serviceType = body.type;

        // Handle features updating JSON
        if (body.features) {
            // This is a bit simplistic, usually you'd merge or replace
            updateData.packages = JSON.stringify({ features: body.features });
        }

        // Category? Usually requires ID lookup again. 
        // For MVP updates often don't change category, but if they do:
        if (body.category) {
            let cat = await prisma.category.findUnique({ where: { name: body.category } });
            if (cat) updateData.categoryId = cat.id;
        }

        const updatedService = await prisma.service.update({
            where: { id: serviceId },
            data: updateData
        });

        return NextResponse.json({ success: true, service: updatedService });

    } catch (error) {
        console.error('Failed to update service:', error);
        return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
    }
}

/**
 * DELETE /api/services/[id]
 * Delete a service
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await validateSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const serviceId = params.id;

        // Verify ownership
        const existingService = await prisma.service.findUnique({
            where: { id: serviceId },
            select: { providerId: true }
        });

        if (!existingService) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        if (existingService.providerId !== session.userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Delete
        await prisma.service.delete({
            where: { id: serviceId }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Failed to delete service:', error);
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}
