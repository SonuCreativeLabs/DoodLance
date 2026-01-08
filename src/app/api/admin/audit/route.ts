import { NextRequest, NextResponse } from 'next/server';
import { getAdminLogs, logAdminAction } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const resource = searchParams.get('resource') as any;
    const limit = parseInt(searchParams.get('limit') || '50');

    const logs = await getAdminLogs({
      resource: resource !== 'all' ? resource : undefined,
      limit
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Assume simplified recording from frontend or other services
    await logAdminAction({
      adminId: body.adminId || 'unknown',
      adminEmail: body.adminEmail || 'unknown',
      action: body.action,
      resource: body.resource,
      resourceId: body.resourceId,
      details: body.details,
      request
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to log' }, { status: 500 });
  }
}
