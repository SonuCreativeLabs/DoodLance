import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { validateSession } from '@/lib/auth/jwt';
import { logAdminAction, AdminAction } from '@/lib/audit-log';

// POST /api/admin/users/action - Perform user actions
export async function POST(request: NextRequest) {
  try {
    const session = await validateSession();
    // In a real app, ensure session.role === 'admin'

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, action, reason } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'Missing required user ID or action' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let updatedUser;
    let logActionType: AdminAction;

    switch (action) {
      case 'suspend':
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { status: 'suspended' }
        });
        logActionType = 'SUSPEND';
        break;
      case 'activate':
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { status: 'active' } // Assuming active is the default/valid status
        });
        logActionType = 'ACTIVATE';
        break;
      case 'verify':
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { isVerified: true }
        });

        // Also verify freelancer profile if it exists
        if (user.role === 'freelancer') {
          try {
            await prisma.freelancerProfile.update({
              where: { userId },
              data: { isVerified: true, verifiedAt: new Date() }
            });
          } catch (e) {
            // Ignore if profile doesn't exist
          }
        }
        logActionType = 'VERIFY';
        break;
      case 'unverify':
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { isVerified: false }
        });
        if (user.role === 'freelancer') {
          try {
            await prisma.freelancerProfile.update({
              where: { userId },
              data: { isVerified: false }
            });
          } catch (e) {
            // Ignore
          }
        }
        logActionType = 'UNVERIFY';
        break;
      case 'delete':
        await prisma.user.delete({ where: { id: userId } });
        logActionType = 'DELETE';
        // Return immediately as there is no user object to return
        await logAdminAction({
          adminId: session.userId,
          adminEmail: session.email || 'unknown',
          action: logActionType,
          resource: 'USER',
          resourceId: userId,
          details: { reason },
          request
        });
        return NextResponse.json({ success: true, message: 'User deleted' });
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Log audit action
    await logAdminAction({
      adminId: session.userId,
      adminEmail: session.email || 'unknown',
      action: logActionType,
      resource: 'USER',
      resourceId: userId,
      details: { reason, previousStatus: user.status },
      request
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: `User ${action} successful`
    });
  } catch (error) {
    console.error('User action error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
