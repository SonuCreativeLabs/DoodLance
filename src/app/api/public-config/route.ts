import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const configs = await prisma.systemConfig.findMany({
            where: {
                key: {
                    in: ['clientCommission', 'freelancerCommission', 'currency', 'platformName']
                }
            }
        });

        const configMap: Record<string, string | number> = {
            clientCommission: 5, // Default
            freelancerCommission: 25, // Default
            currency: 'INR',
            platformName: 'DoodLance'
        };

        configs.forEach((conf: any) => {
            if (conf.type === 'NUMBER') {
                configMap[conf.key] = parseFloat(conf.value);
            } else {
                configMap[conf.key] = conf.value;
            }
        });

        return NextResponse.json(configMap);
    } catch (error) {
        console.error('Failed to fetch public config:', error);
        return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
    }
}
