import * as Sentry from '@sentry/nextjs';

/**
 * Capture an exception and send it to Sentry
 */
export function captureException(error: Error | unknown, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'development') {
    console.error('Sentry Exception:', error, context);
  }
  
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Capture a message and send it to Sentry
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Sentry ${level}:`, message, context);
  }
  
  Sentry.withScope((scope) => {
    scope.setLevel(level);
    if (context) {
      scope.setExtras(context);
    }
    Sentry.captureMessage(message);
  });
}

/**
 * Set user context for Sentry
 */
export function setUser(user: { id: string; email?: string; username?: string } | null) {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  } else {
    Sentry.setUser(null);
  }
}

/**
 * Add breadcrumb for better error tracking
 */
export function addBreadcrumb(breadcrumb: {
  message: string;
  category?: string;
  level?: Sentry.SeverityLevel;
  data?: Record<string, any>;
}) {
  Sentry.addBreadcrumb({
    message: breadcrumb.message,
    category: breadcrumb.category || 'custom',
    level: breadcrumb.level || 'info',
    data: breadcrumb.data,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Wrap async functions with error tracking
 */
export function withSentry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: Record<string, any>
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      captureException(error, {
        ...context,
        functionName: fn.name,
        arguments: args,
      });
      throw error;
    }
  }) as T;
}

/**
 * Track API errors
 */
export function trackApiError(
  endpoint: string,
  error: any,
  requestData?: any,
  responseData?: any
) {
  captureException(error, {
    endpoint,
    requestData,
    responseData,
    errorMessage: error?.message || 'Unknown API error',
    statusCode: error?.response?.status,
  });
}

/**
 * Track user actions for better debugging
 */
export function trackUserAction(action: string, data?: Record<string, any>) {
  addBreadcrumb({
    message: action,
    category: 'user-action',
    level: 'info',
    data,
  });
}

/**
 * Performance monitoring - using startSpan for newer Sentry versions
 */
export function startSpanWrapper(name: string, op: string = 'navigation') {
  return Sentry.startSpan({ name, op }, () => {});
}

/**
 * Profile a function execution
 */
export async function profileFunction<T>(
  name: string,
  fn: () => Promise<T> | T
): Promise<T> {
  return Sentry.startSpan(
    { name, op: 'function' },
    async () => {
      try {
        return await fn();
      } catch (error) {
        captureException(error, { functionName: name });
        throw error;
      }
    }
  );
}
