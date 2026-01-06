import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
    const diagnosticInfo: any = {
        env: {
            hasDatabaseUrl: !!process.env.DATABASE_URL,
            databaseUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.split(':')[0] : 'N/A',
            hasDirectUrl: !!process.env.DIRECT_URL,
            directUrlPrefix: process.env.DIRECT_URL ? process.env.DIRECT_URL.split(':')[0] : 'N/A',
            nodeEnv: process.env.NODE_ENV,
        },
        connection: 'pending',
        timestamp: new Date().toISOString(),
    };

    const prisma = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
    });

    try {
        const start = Date.now();
        await prisma.$connect();
        diagnosticInfo.connection = 'success';
        diagnosticInfo.latency = `${Date.now() - start}ms`;

        // Try a simple query
        try {
            const userCount = await prisma.user.count();
            diagnosticInfo.queryTest = { status: 'success', count: userCount };
        } catch (queryError: any) {
            diagnosticInfo.queryTest = {
                status: 'failed',
                error: queryError.message,
                code: queryError.code
            };
        }

        return NextResponse.json(diagnosticInfo, { status: 200 });

    } catch (error: any) {
        console.error('Diagnostic DB Connection Failed:', error);
        diagnosticInfo.connection = 'failed';
        diagnosticInfo.error = {
            message: error.message,
            name: error.name,
            code: error.code,
            meta: error.meta,
            stack: error.stack ? error.stack.split('\n').slice(0, 3) : undefined // Only first 3 lines
        };
        return NextResponse.json(diagnosticInfo, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
