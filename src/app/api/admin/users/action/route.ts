import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { logAdminAction, AdminAction } from '@/lib/audit-log';
import { createClient } from '@/lib/supabase/server';

// POST /api/admin/users/action - Perform user actions
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role via database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true, email: true }
    });

    if (!dbUser || dbUser.role !== 'admin') {
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

    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!targetUser) {
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
        if (targetUser.role === 'freelancer') {
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
        if (targetUser.role === 'freelancer') {
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
          adminId: user.id,
          adminEmail: dbUser.email || 'unknown',
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
      adminId: user.id,
      adminEmail: dbUser.email || 'unknown',
      action: logActionType,
      resource: 'USER',
      resourceId: userId,
      details: { reason, previousStatus: targetUser.status },
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
