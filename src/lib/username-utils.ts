/**
 * Username Validation Utilities
 * 
 * Validates usernames for public profiles
 * Format: 3-30 characters, alphanumeric + hyphens/underscores
 */

// Reserved usernames that cannot be used
export const RESERVED_USERNAMES = [
    // System routes
    'admin',
    'api',
    'auth',
    'login',
    'signup',
    'register',
    'signin',
    // User routes
    'client',
    'freelancer',
    'user',
    'users',
    'profile',
    'profiles',
    'settings',
    'account',
    'dashboard',
    // Feature routes
    'jobs',
    'job',
    'services',
    'service',
    'bookings',
    'booking',
    'applications',
    'application',
    'messages',
    'message',
    'inbox',
    'chat',
    'notifications',
    'wallet',
    'payments',
    'transactions',
    'support',
    'help',
    'about',
    'contact',
    'terms',
    'privacy',
    'blog',
    'docs',
    'documentation',
    // Common
    'www',
    'mail',
    'test',
    'demo',
    'example',
    'null',
    'undefined',
    'bails',
];

/**
 * Validate username format
 * Rules:
 * - 3-30 characters
 * - Only letters, numbers, hyphens, underscores
 * - Cannot start or end with hyphen/underscore
 * - No consecutive hyphens/underscores
 */
export function isValidUsernameFormat(username: string): {
    valid: boolean;
    error?: string;
} {
    if (!username || typeof username !== 'string') {
        return { valid: false, error: 'Username is required' };
    }

    const trimmed = username.trim();

    // Length check
    if (trimmed.length < 3) {
        return { valid: false, error: 'Username must be at least 3 characters' };
    }

    if (trimmed.length > 30) {
        return { valid: false, error: 'Username must be 30 characters or less' };
    }

    // Character check: only letters, numbers, underscores
    const validCharsRegex = /^[a-zA-Z0-9_]+$/;
    if (!validCharsRegex.test(trimmed)) {
        return {
            valid: false,
            error: 'Username can only contain letters, numbers, and underscores',
        };
    }

    // Cannot start or end with underscore
    if (/^[_]|[_]$/.test(trimmed)) {
        return {
            valid: false,
            error: 'Username cannot start or end with an underscore',
        };
    }

    // No consecutive underscores
    if (/_{2,}/.test(trimmed)) {
        return {
            valid: false,
            error: 'Username cannot have consecutive underscores',
        };
    }

    return { valid: true };
}

/**
 * Check if username is reserved
 */
export function isReservedUsername(username: string): boolean {
    const normalized = username.toLowerCase().trim();
    return RESERVED_USERNAMES.includes(normalized);
}

/**
 * Format username (lowercase, trim)
 */
export function formatUsername(username: string): string {
    return username.toLowerCase().trim();
}

/**
 * Validate username (format + reserved check)
 */
export function validateUsername(username: string): {
    valid: boolean;
    error?: string;
} {
    // Format validation
    const formatCheck = isValidUsernameFormat(username);
    if (!formatCheck.valid) {
        return formatCheck;
    }

    // Reserved check
    if (isReservedUsername(username)) {
        return {
            valid: false,
            error: 'This username is reserved and cannot be used',
        };
    }

    return { valid: true };
}
