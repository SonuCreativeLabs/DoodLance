import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { logAdminAction, AdminAction } from '@/lib/audit-log';
import { jwtVerify } from 'jose';

// POST /api/admin/users/action - Perform user actions
export async function POST(request: NextRequest) {
  try {
    // Verify admin session via JWT token
    const authToken = request.cookies.get('auth-token')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized - No admin session found' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback-secret-for-dev'
    );

    let adminPayload: any;
    try {
      const { payload } = await jwtVerify(authToken, secret);
      adminPayload = payload;
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }

    if (adminPayload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const adminId = adminPayload.userId as string;
    const adminEmail = adminPayload.email as string;

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
        // 1. Delete dependent relations acting as Client
        try {
          await prisma.booking.deleteMany({ where: { clientId: userId } });
          await prisma.review.deleteMany({ where: { clientId: userId } });
          await prisma.clientProfile.deleteMany({ where: { userId } });

          // Jobs posted by this user (as client)
          const clientJobs = await prisma.job.findMany({ where: { clientId: userId }, select: { id: true } });
          const clientJobIds = clientJobs.map(j => j.id);
          if (clientJobIds.length > 0) {
            await prisma.application.deleteMany({ where: { jobId: { in: clientJobIds } } });
            await prisma.job.deleteMany({ where: { id: { in: clientJobIds } } });
          }
        } catch (e: any) {
          console.error('Error cleaning up client data:', e);
          // Continue execution to try and clean up other parts
        }

        // 2. Delete dependent relations acting as Freelancer
        try {
          await prisma.application.deleteMany({ where: { freelancerId: userId } });
          // Remove freelancer from jobs but keep the job
          await prisma.job.updateMany({
            where: { freelancerId: userId },
            data: { freelancerId: null }
          });

          const freelancerProfile = await prisma.freelancerProfile.findUnique({ where: { userId } });
          if (freelancerProfile) {
            await prisma.achievement.deleteMany({ where: { profileId: freelancerProfile.id } });
            await prisma.review.deleteMany({ where: { profileId: freelancerProfile.id } });
            await prisma.freelancerProfile.delete({ where: { id: freelancerProfile.id } });
          }
        } catch (e: any) {
          console.error('Error cleaning up freelancer data:', e);
        }

        // 3. Delete dependent relations acting as Service Provider
        try {
          const services = await prisma.service.findMany({ where: { providerId: userId }, select: { id: true } });
          const serviceIds = services.map(s => s.id);
          if (serviceIds.length > 0) {
            await prisma.booking.deleteMany({ where: { serviceId: { in: serviceIds } } });
            await prisma.service.deleteMany({ where: { id: { in: serviceIds } } });
          }
        } catch (e: any) {
          console.error('Error cleaning up service provider data:', e);
        }

        // 4. Conversations and Messages
        try {
          const conversations = await prisma.conversation.findMany({
            where: { OR: [{ clientId: userId }, { freelancerId: userId }] },
            select: { id: true }
          });
          const conversationIds = conversations.map(c => c.id);
          if (conversationIds.length > 0) {
            // Delete messages in these conversations first
            await prisma.message.deleteMany({ where: { conversationId: { in: conversationIds } } });
            await prisma.conversation.deleteMany({ where: { id: { in: conversationIds } } });
          }
        } catch (e: any) {
          console.error('Error cleaning up conversation data:', e);
        }

        // 5. Delete other dependent relations explicitly (Manual Cascade)
        try {
          await prisma.bankAccount.deleteMany({ where: { userId } });
          await prisma.promoUsage.deleteMany({ where: { userId } });
          await prisma.notification.deleteMany({ where: { userId } });

          // Support tickets - messages first, then tickets
          const supportTickets = await prisma.supportTicket.findMany({ where: { userId }, select: { id: true } });
          const ticketIds = supportTickets.map(t => t.id);
          if (ticketIds.length > 0) {
            await prisma.ticketMessage.deleteMany({ where: { ticketId: { in: ticketIds } } });
            await prisma.supportTicket.deleteMany({ where: { id: { in: ticketIds } } });
          }

          const wallet = await prisma.wallet.findUnique({ where: { userId } });
          if (wallet) {
            await prisma.transaction.deleteMany({ where: { walletId: wallet.id } });
            await prisma.wallet.delete({ where: { id: wallet.id } });
          }
        } catch (e: any) {
          console.error('Error cleaning up miscellaneous user data:', e);
        }

        // 6. Finally delete the user
        try {
          await prisma.user.delete({ where: { id: userId } });
        } catch (e: any) {
          console.error('Error deleting user record:', e);
          return NextResponse.json(
            { error: `Failed to delete user: ${e.message}` },
            { status: 500 }
          );
        }

        logActionType = 'DELETE';
        // Return immediately as there is no user object to return
        await logAdminAction({
          adminId: adminId,
          adminEmail: adminEmail,
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
      adminId: adminId,
      adminEmail: adminEmail,
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
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
      console.error('Error message details:', error.message);
    }
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
