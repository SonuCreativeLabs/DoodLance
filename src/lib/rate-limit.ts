import { NextRequest, NextResponse } from 'next/server';

interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds
  max?: number; // Maximum requests per window
  message?: string; // Error message when limit is exceeded
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  keyGenerator?: (req: NextRequest) => string; // Function to generate key for rate limiting
}

interface RateLimitStore {
  hits: number;
  resetTime: number;
}

// In-memory store for rate limiting (use Redis in production)
const store = new Map<string, RateLimitStore>();

// Clean up expired entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (value.resetTime < now) {
      store.delete(key);
    }
  }
}, 60000);

/**
 * Rate limiting middleware for Next.js API routes
 */
export function rateLimit(options: RateLimitOptions = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes default
    max = 100, // 100 requests per window default
    message = 'Too many requests, please try again later.',
    skipSuccessfulRequests = false,
    keyGenerator = (req) => {
      // Default: use IP address as key
      const forwarded = req.headers.get('x-forwarded-for');
      const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
      return ip;
    },
  } = options;

  return async function rateLimitMiddleware(
    req: NextRequest,
    handler: (req: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> {
    const key = keyGenerator(req);
    const now = Date.now();
    const resetTime = now + windowMs;

    // Get or create rate limit entry
    let entry = store.get(key);
    
    if (!entry || entry.resetTime < now) {
      // Create new entry or reset expired one
      entry = { hits: 0, resetTime };
      store.set(key, entry);
    }

    // Check if limit exceeded
    if (entry.hits >= max) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      
      return NextResponse.json(
        { error: message },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': max.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(entry.resetTime).toISOString(),
          },
        }
      );
    }

    // Increment counter before processing request
    if (!skipSuccessfulRequests) {
      entry.hits++;
    }

    // Process request
    const response = await handler(req);

    // Increment counter after successful request if skipSuccessfulRequests is true
    if (skipSuccessfulRequests && response.status < 400) {
      entry.hits++;
    }

    // Add rate limit headers to response
    const remaining = Math.max(0, max - entry.hits);
    response.headers.set('X-RateLimit-Limit', max.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());

    return response;
  };
}

// Pre-configured rate limiters for different use cases
export const rateLimiters = {
  // Strict rate limit for authentication endpoints
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: 'Too many authentication attempts, please try again later.',
  }),

  // Standard rate limit for API endpoints
  api: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
  }),

  // Relaxed rate limit for search endpoints
  search: rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // 30 searches per minute
    message: 'Too many search requests, please wait a moment.',
  }),

  // Strict rate limit for file uploads
  upload: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 uploads per hour
    message: 'Upload limit exceeded, please try again later.',
  }),

  // Rate limit for payment endpoints
  payment: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 payment attempts per hour
    message: 'Too many payment attempts, please contact support if this persists.',
  }),
};

// Helper function to apply rate limiting to API route handlers
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  limiter = rateLimiters.api
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    return limiter(req, handler);
  };
}
