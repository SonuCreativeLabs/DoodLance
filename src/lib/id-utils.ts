/**
 * ID Generation Utilities
 * 
 * Format: {Type}{Category}{City}{Area}{Sequence}
 * - Type: J (Job), A (Application), B (Booking)
 * - Category: PL, CO, SU, ME (2 letters)
 * - City: CH, BA, MU, etc. (2 letters)
 * - Area: First 2 letters of area name
 * - Sequence: 3-digit number (001, 002, etc.)
 * 
 * Examples:
 * - JPLCHVE001 (Job, Playing, Chennai, Velachery, #1)
 * - APLCHVE001012 (Application for job JPLCHVE001, applicant #12)
 * - BCOBAPA045 (Booking, Coaching, Bangalore, Pallikaranai, #45)
 */

import prisma from '@/lib/db';
import {
    getCategoryCode,
    getCityCode,
    getAreaCode,
    parseLocation,
} from './id-generator';

interface GenerateJobIdParams {
    category: string;
    location: string;
}

interface GenerateApplicationIdParams {
    jobId: string;
}

interface GenerateBookingIdParams {
    category: string;
    location: string;
}

/**
 * Generate Job ID
 * Format: J{Category}{City}{Area}{Sequence}
 * Example: JPLCHVE001
 */
export async function generateJobId(params: GenerateJobIdParams): Promise<string> {
    const { category, location } = params;

    // Get codes
    const categoryCode = getCategoryCode(category);
    const { city, area } = parseLocation(location);
    const cityCode = getCityCode(city);
    const areaCode = getAreaCode(area);

    // Get sequence number (per category for better organization)
    const count = await prisma.job.count({
        where: {
            // Match jobs with same category code (extract from existing IDs)
            id: {
                startsWith: `J${categoryCode}`,
            },
        },
    });

    const sequence = String(count + 1).padStart(3, '0');

    // Construct ID: J + PL + CH + VE + 001
    return `J${categoryCode}${cityCode}${areaCode}${sequence}`;
}

/**
 * Generate Application ID
 * Format: A{Category}{City}{Area}{JobSeq}{AppSeq}
 * Example: APLCHVE001012 (12th application for job JPLCHVE001)
 */
export async function generateApplicationId(
    params: GenerateApplicationIdParams
): Promise<string> {
    const { jobId } = params;

    // Extract job details from job ID
    // Job ID format: JPLCHVE001
    // J = type (1 char)
    // PL = category (2 chars)
    // CH = city (2 chars)
    // VE = area (2 chars)
    // 001 = sequence (3 chars)

    if (!jobId || jobId.length < 10) {
        throw new Error(`Invalid job ID format: ${jobId}`);
    }

    const categoryCode = jobId.substring(1, 3); // PL
    const cityCode = jobId.substring(3, 5); // CH
    const areaCode = jobId.substring(5, 7); // VE
    const jobSequence = jobId.substring(7, 10); // 001

    // Count applications for this specific job
    const count = await prisma.application.count({
        where: { jobId },
    });

    const appSequence = String(count + 1).padStart(3, '0');

    // Construct ID: A + PL + CH + VE + 001 + 012
    return `A${categoryCode}${cityCode}${areaCode}${jobSequence}${appSequence}`;
}

/**
 * Generate Booking ID
 * Format: B{Category}{City}{Area}{Sequence}
 * Example: BPLCHVE001
 */
export async function generateBookingId(
    params: GenerateBookingIdParams
): Promise<string> {
    const { category, location } = params;

    // Get codes
    const categoryCode = getCategoryCode(category);
    const { city, area } = parseLocation(location);
    const cityCode = getCityCode(city);
    const areaCode = getAreaCode(area);

    // Get sequence number (per category)
    const count = await prisma.booking.count({
        where: {
            // Match bookings with same category code
            id: {
                startsWith: `B${categoryCode}`,
            },
        },
    });

    const sequence = String(count + 1).padStart(3, '0');

    // Construct ID: B + PL + CH + VE + 001
    return `B${categoryCode}${cityCode}${areaCode}${sequence}`;
}

/**
 * Parse an ID to extract its components
 */
export function parseId(id: string): {
    type: 'Job' | 'Application' | 'Booking' | 'Unknown';
    categoryCode: string;
    cityCode: string;
    areaCode: string;
    sequence: string;
    jobSequence?: string; // Only for applications
    appSequence?: string; // Only for applications
} {
    if (!id || id.length < 10) {
        return {
            type: 'Unknown',
            categoryCode: '',
            cityCode: '',
            areaCode: '',
            sequence: '',
        };
    }

    const typeChar = id.charAt(0);
    const type =
        typeChar === 'J'
            ? 'Job'
            : typeChar === 'A'
                ? 'Application'
                : typeChar === 'B'
                    ? 'Booking'
                    : 'Unknown';

    const categoryCode = id.substring(1, 3);
    const cityCode = id.substring(3, 5);
    const areaCode = id.substring(5, 7);

    if (type === 'Application' && id.length >= 13) {
        // Application: APLCHVE001012
        const jobSequence = id.substring(7, 10);
        const appSequence = id.substring(10, 13);
        return {
            type,
            categoryCode,
            cityCode,
            areaCode,
            sequence: jobSequence,
            jobSequence,
            appSequence,
        };
    }

    const sequence = id.substring(7, 10);

    return {
        type,
        categoryCode,
        cityCode,
        areaCode,
        sequence,
    };
}

/**
 * Validate ID format
 */
export function isValidId(id: string): boolean {
    if (!id || typeof id !== 'string') return false;

    // Check type
    const typeChar = id.charAt(0);
    if (!['J', 'A', 'B'].includes(typeChar)) return false;

    // Check minimum length
    if (typeChar === 'A') {
        // Application IDs are longer: APLCHVE001012 (13 chars)
        return id.length === 13;
    } else {
        // Job and Booking IDs: JPLCHVE001 (10 chars)
        return id.length === 10;
    }
}

/**
 * Get the parent job ID from an application ID
 */
export function getParentJobId(applicationId: string): string | null {
    if (!applicationId || applicationId.charAt(0) !== 'A') {
        return null;
    }

    // Application: APLCHVE001012
    // Parent Job:  JPLCHVE001
    const jobId = `J${applicationId.substring(1, 10)}`;

    return jobId;
}
