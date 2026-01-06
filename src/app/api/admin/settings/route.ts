import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { updateSettingsSchema, validateRequest } from '@/lib/validations/admin';
import { logAdminAction } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

// GET /api/admin/settings - Get all system settings
export async function GET(request: NextRequest) {
    try {
        const settings = await prisma.systemConfig.findMany({
            orderBy: { category: 'asc' }
        });

        // Convert to key-value object
        const settingsObj: Record<string, any> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        settings.forEach((setting: any) => {
            try {
                // Parse value based on type
                if (setting.type === 'BOOLEAN') {
                    settingsObj[setting.key] = setting.value === 'true';
                } else if (setting.type === 'NUMBER') {
                    settingsObj[setting.key] = parseFloat(setting.value);
                } else if (setting.type === 'JSON') {
                    settingsObj[setting.key] = JSON.parse(setting.value);
                } else {
                    settingsObj[setting.key] = setting.value;
                }
            } catch (e) {
                settingsObj[setting.key] = setting.value;
            }
        });

        return NextResponse.json({ settings: settingsObj, raw: settings });
    } catch (error) {
        console.error('Fetch settings error:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

// PATCH /api/admin/settings - Update multiple settings
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request
        const validation = validateRequest(updateSettingsSchema, body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const { settings } = validation.data;
        const adminEmail = 'admin@doodlance.com';
        const adminId = 'admin-1';

        // Update each setting
        const updates = await Promise.all(
            Object.entries(settings).map(([key, value]) => {
                // Determine type
                let type = 'STRING';
                let stringValue = String(value);

                if (typeof value === 'boolean') {
                    type = 'BOOLEAN';
                    stringValue = value ? 'true' : 'false';
                } else if (typeof value === 'number') {
                    type = 'NUMBER';
                    stringValue = value.toString();
                } else if (typeof value === 'object') {
                    type = 'JSON';
                    stringValue = JSON.stringify(value);
                }

                return prisma.systemConfig.upsert({
                    where: { key },
                    update: { value: stringValue, type },
                    create: {
                        key,
                        value: stringValue,
                        type,
                        category: 'GENERAL' // Default category
                    }
                });
            })
        );

        // Log action
        await logAdminAction({
            adminId,
            adminEmail,
            action: 'UPDATE',
            resource: 'SETTINGS',
            details: { updatedCount: updates.length },
            request
        });

        return NextResponse.json({ success: true, updated: updates.length });
    } catch (error) {
        console.error('Update settings error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
