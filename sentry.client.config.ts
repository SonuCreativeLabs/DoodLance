// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

// Only initialize Sentry if a valid DSN is provided
if (SENTRY_DSN && !SENTRY_DSN.includes('your-dsn') && !SENTRY_DSN.includes('your-project-id')) {
  Sentry.init({
    dsn: SENTRY_DSN,
    
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
    
    // You can remove this option if you're not planning to use the Sentry Session Replay feature:
    replaysOnErrorSampleRate: 1.0,
    
    // This sets the sample rate to be 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // You can exclude specific URLs from being traced
    ignoreTransactions: ['/api/health', '/api/ping'],
    
    // Capture unhandled promise rejections
    integrations: [
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    
    // Set environment
    environment: process.env.NODE_ENV || 'development',
    
    // Filter out sensitive data
    beforeSend(event, hint) {
      // Filter out sensitive data
      if (event.request?.cookies) {
        delete event.request.cookies;
      }
      
      // Don't send events in development unless explicitly enabled
      if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_SENTRY_DEBUG) {
        return null;
      }
      
      return event;
    },
  });
}
