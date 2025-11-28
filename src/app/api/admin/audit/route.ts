import { NextRequest, NextResponse } from 'next/server';

// Mock audit log storage - In production, save to database
const auditLogs: any[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Get admin info from token (simplified for demo)
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || 
                 req.headers.get('x-admin-token') ||
                 'demo-token';
    
    // Create audit log entry
    const auditEntry = {
      id: `audit-${Date.now()}`,
      adminId: body.adminId || 'admin-1',
      action: body.action,
      entityType: body.entityType,
      entityId: body.entityId,
      oldValue: body.oldValue,
      newValue: body.newValue,
      metadata: body.metadata,
      ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
      createdAt: new Date().toISOString(),
    };

    // Store audit log (in production, save to database)
    auditLogs.push(auditEntry);

    return NextResponse.json({ success: true, audit: auditEntry });
  } catch (error) {
    console.error('Audit log error:', error);
    return NextResponse.json(
      { error: 'Failed to create audit log' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Return recent audit logs (in production, query from database)
    const recentLogs = auditLogs.slice(-100).reverse();
    
    return NextResponse.json({ 
      success: true, 
      logs: recentLogs,
      total: auditLogs.length 
    });
  } catch (error) {
    console.error('Audit fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}
