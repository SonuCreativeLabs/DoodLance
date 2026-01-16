import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// Re-map PATCH to support full updates or create PUT
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        const dataToUpdate: any = {
            updatedAt: new Date(),
        };

        // Map frontend fields to DB schema
        if (body.code) dataToUpdate.code = body.code;
        if (body.description !== undefined) dataToUpdate.description = body.description;
        if (body.discountType) dataToUpdate.discountType = body.discountType;
        if (body.discountValue !== undefined) dataToUpdate.discountValue = body.discountValue;
        if (body.minOrderAmount !== undefined) dataToUpdate.minOrderAmount = body.minOrderAmount;
        if (body.maxDiscount !== undefined) dataToUpdate.maxDiscount = body.maxDiscount;
        if (body.usageLimit !== undefined) dataToUpdate.usageLimit = body.usageLimit;
        if (body.perUserLimit !== undefined) dataToUpdate.perUserLimit = body.perUserLimit;

        if (body.validFrom) dataToUpdate.startDate = new Date(body.validFrom);
        if (body.validTo) dataToUpdate.endDate = body.validTo ? new Date(body.validTo) : null;

        if (typeof body.isActive !== 'undefined') {
            dataToUpdate.status = body.isActive ? 'active' : 'inactive';
        }

        const updated = await prisma.promoCode.update({
            where: { id },
            data: dataToUpdate
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Update promo error:', error);
        return NextResponse.json({ error: 'Failed to update promo' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        const dataToUpdate: any = {};

        // Handle status toggle from frontend (isActive -> status)
        if (typeof body.isActive !== 'undefined') {
            dataToUpdate.status = body.isActive ? 'active' : 'inactive';
        }

        const updated = await prisma.promoCode.update({
            where: { id },
            data: dataToUpdate
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Update promo error:', error);
        return NextResponse.json({ error: 'Failed to update promo' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        await prisma.promoCode.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete promo error:', error);
        return NextResponse.json({ error: 'Failed to delete promo' }, { status: 500 });
    }
}
