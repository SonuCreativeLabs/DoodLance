import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { captureMessage } from '@/lib/sentry';

export async function GET(request: NextRequest) {
  try {
    // Log health check to Sentry (only in production)
    if (process.env.NODE_ENV === 'production') {
      captureMessage('Health check performed', 'info', {
        timestamp: new Date().toISOString(),
        userAgent: request.headers.get('user-agent'),
      });
    }

    // Check database connection
    let dbStatus = 'unknown';
    try {
      // Attempt to import Prisma and check connection
      const { default: prisma } = await import('@/lib/db');
      if (prisma && prisma.$connect) {
        await prisma.$connect();
        dbStatus = 'connected';
      } else {
        dbStatus = 'mock';
      }
    } catch (error) {
      dbStatus = 'error';
      Sentry.captureException(error, {
        tags: { component: 'health-check' },
        extra: { service: 'database' },
      });
    }

    // Check AuthKit status
    let authStatus = 'unknown';
    try {
      authStatus = process.env.WORKOS_CLIENT_ID ? 'configured' : 'not-configured';
    } catch (error) {
      authStatus = 'error';
    }

    // Check Sentry status
    let sentryStatus = 'unknown';
    try {
      sentryStatus = process.env.NEXT_PUBLIC_SENTRY_DSN ? 'configured' : 'not-configured';
    } catch (error) {
      sentryStatus = 'error';
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: dbStatus,
        authentication: authStatus,
        monitoring: sentryStatus,
      },
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error) {
    // Log error to Sentry
    Sentry.captureException(error, {
      tags: { endpoint: 'health' },
    });

    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Test endpoint to trigger an error (development only)
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Test endpoint disabled in production' },
      { status: 403 }
    );
  }

  try {
    const { type } = await request.json();

    if (type === 'error') {
      throw new Error('Test error from health endpoint');
    }

    if (type === 'message') {
      captureMessage('Test message from health endpoint', 'warning', {
        testData: 'This is test data',
      });
      return NextResponse.json({ message: 'Test message sent to Sentry' });
    }

    return NextResponse.json({ message: 'No test performed' });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { test: true },
    });
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
