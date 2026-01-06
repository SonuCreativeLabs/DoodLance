import prisma from '@/lib/db';
import { NextRequest } from 'next/server';

export type AdminAction =
    | 'CREATE' | 'UPDATE' | 'DELETE'
    | 'APPROVE' | 'REJECT' | 'VERIFY' | 'UNVERIFY'
    | 'SUSPEND' | 'ACTIVATE' | 'TOGGLE';

export type AdminResource =
    | 'USER' | 'SERVICE' | 'BOOKING' | 'JOB' | 'TRANSACTION'
    | 'PROMO' | 'SUPPORT_TICKET' | 'SETTINGS' | 'KYC';

interface LogParams {
    adminId: string;
    adminEmail: string;
    action: AdminAction;
    resource: AdminResource;
    resourceId?: string;
    details?: Record<string, any>;
    request?: NextRequest;
}

/**
 * Log admin actions for audit trail
 */
export async function logAdminAction(params: LogParams): Promise<void> {
    try {
        const { adminId, adminEmail, action, resource, resourceId, details, request } = params;

        await prisma.adminLog.create({
            data: {
                adminId,
                adminEmail,
                action,
                resource,
                resourceId: resourceId || null,
                details: details ? JSON.stringify(details) : null,
                ipAddress: request?.ip || request?.headers.get('x-forwarded-for') || null,
                userAgent: request?.headers.get('user-agent') || null,
            },
        });
    } catch (error) {
        // Don't throw - logging failures shouldn't break the main operation
        console.error('Failed to log admin action:', error);
    }
}

/**
 * Get recent admin logs
 */
export async function getAdminLogs(params: {
    limit?: number;
    adminId?: string;
    resource?: AdminResource;
    startDate?: Date;
    endDate?: Date;
}) {
    const { limit = 100, adminId, resource, startDate, endDate } = params;

    const where: any = {};

    if (adminId) where.adminId = adminId;
    if (resource) where.resource = resource;
    if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
    }

    return await prisma.adminLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
}

/**
 * Get admin activity summary
 */
export async function getAdminActivitySummary(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [totalActions, actionsByResource, actionsByAdmin] = await Promise.all([
        prisma.adminLog.count({
            where: { createdAt: { gte: startDate } },
        }),
        prisma.adminLog.groupBy({
            by: ['resource'],
            where: { createdAt: { gte: startDate } },
            _count: { id: true },
        }),
        prisma.adminLog.groupBy({
            by: ['adminId', 'adminEmail'],
            where: { createdAt: { gte: startDate } },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 10,
        }),
    ]);

    return {
        totalActions,
        actionsByResource,
        topAdmins: actionsByAdmin,
    };
}
