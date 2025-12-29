import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { updateJobSchema, validateRequest } from '@/lib/validations/admin';
import { logAdminAction } from '@/lib/audit-log';

// PATCH /api/admin/jobs/[id] - Update job status or details
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validate request
        const validation = validateRequest(updateJobSchema, body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const adminEmail = 'admin@doodlance.com';
        const adminId = 'admin-1';

        const updated = await prisma.job.update({
            where: { id },
            data: validation.data
        });

        // Log action
        await logAdminAction({
            adminId,
            adminEmail,
            action: 'UPDATE',
            resource: 'JOB',
            resourceId: id,
            details: body,
            request
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Update job error:', error);
        return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
    }
}

// DELETE /api/admin/jobs/[id] - Delete job
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const adminEmail = 'admin@doodlance.com';
        const adminId = 'admin-1';

        await prisma.job.delete({
            where: { id }
        });

        // Log action
        await logAdminAction({
            adminId,
            adminEmail,
            action: 'DELETE',
            resource: 'JOB',
            resourceId: id,
            request
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete job error:', error);
        return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
    }
}
