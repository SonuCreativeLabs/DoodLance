import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;

        // Verify ownership
        const service = await prisma.service.findUnique({
            where: { id }
        });

        if (!service) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        if (service.providerId !== user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Soft delete: mark as inactive instead of deleting
        // This preserves all existing bookings and history
        await prisma.service.update({
            where: { id },
            data: { isActive: false }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting service:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;
        const body = await request.json();

        // Verify ownership
        const service = await prisma.service.findUnique({
            where: { id }
        });

        if (!service) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        if (service.providerId !== user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Map UI fields to Database fields
        const updates: any = {};
        if (body.title) updates.title = body.title;
        if (body.description) updates.description = body.description;
        if (body.price) {
            updates.price = parseFloat(String(body.price).replace(/[^0-9.]/g, ''));
        }
        if (body.deliveryTime) updates.deliveryTime = body.deliveryTime;
        if (body.type) updates.serviceType = body.type;
        if (body.features) updates.packages = JSON.stringify(body.features);
        if (body.skill) updates.tags = body.skill;
        if (body.videoUrls !== undefined) updates.videoUrl = body.videoUrls;

        // Handle Category update if needed
        if (body.category) {
            let categoryRecord = await prisma.category.findUnique({
                where: { name: body.category }
            });

            if (!categoryRecord) {
                // Create if missing
                const slug = body.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
                categoryRecord = await prisma.category.create({
                    data: {
                        name: body.category,
                        slug,
                        description: `Category for ${body.category}`,
                    }
                });
            }
            updates.categoryId = categoryRecord.id;
        }

        const updatedService = await prisma.service.update({
            where: { id },
            data: updates,
            include: {
                category: true
            }
        });

        const formattedService = {
            id: updatedService.id,
            title: updatedService.title,
            description: updatedService.description,
            price: `₹${updatedService.price.toString()}`,
            deliveryTime: updatedService.deliveryTime,
            type: updatedService.serviceType,
            features: updatedService.packages ? JSON.parse(updatedService.packages) : [],
            category: updatedService.category.name,
            skill: updatedService.tags,
            videoUrls: updatedService.videoUrl || []
        };

        return NextResponse.json({ service: formattedService });

    } catch (error) {
        console.error('Error updating service:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
