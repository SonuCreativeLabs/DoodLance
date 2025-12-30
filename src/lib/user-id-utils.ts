/**
 * User Display ID Generation
 * 
 * Format: {Type}{Sequence}
 * - Type: C (Client), F (Freelancer)
 * - Sequence: 5-digit number (00001, 00002, etc.)
 * 
 * Examples:
 * - C00001 (1st client)
 * - F00001 (1st freelancer)
 * - C00523 (523rd client)
 */

import prisma from '@/lib/db';

/**
 * Generate sequential display ID for new users
 * @param role - User role ('client' or 'freelancer')
 * @returns Display ID (e.g., 'C00001' or 'F00001')
 */
export async function generateUserDisplayId(role: 'client' | 'freelancer'): Promise<string> {
    const prefix = role === 'client' ? 'C' : 'F';

    // Count existing users with this role's display ID prefix
    const count = await prisma.user.count({
        where: {
            displayId: {
                startsWith: prefix,
            },
        },
    });

    // Generate sequential number (5 digits, zero-padded)
    const sequence = String(count + 1).padStart(5, '0');

    return `${prefix}${sequence}`;
}

/**
 * Parse display ID to extract type and sequence
 */
export function parseUserDisplayId(displayId: string): {
    type: 'Client' | 'Freelancer' | 'Unknown';
    sequence: number;
} {
    if (!displayId || displayId.length !== 6) {
        return { type: 'Unknown', sequence: 0 };
    }

    const typeChar = displayId.charAt(0);
    const type = typeChar === 'C' ? 'Client' : typeChar === 'F' ? 'Freelancer' : 'Unknown';
    const sequence = parseInt(displayId.substring(1), 10);

    return { type, sequence };
}

/**
 * Validate display ID format
 */
export function isValidUserDisplayId(displayId: string): boolean {
    if (!displayId || typeof displayId !== 'string') return false;

    // Check format: C00001 or F00001 (1 letter + 5 digits)
    const regex = /^[CF]\d{5}$/;
    return regex.test(displayId);
}
