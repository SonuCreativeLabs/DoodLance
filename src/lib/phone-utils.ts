import { parsePhoneNumber, isValidPhoneNumber, CountryCode } from 'libphonenumber-js';

/**
 * Validates and formats a phone number to E.164 format
 * @param phoneNumber - The phone number to validate and format
 * @param defaultCountry - Default country code (default: 'IN' for India)
 * @returns Formatted phone number in E.164 format or null if invalid
 */
export function formatPhoneNumber(
    phoneNumber: string,
    defaultCountry: CountryCode = 'IN'
): string | null {
    try {
        // Remove all non-numeric characters except +
        const cleaned = phoneNumber.replace(/[^\d+]/g, '');

        // Check if it's a valid phone number
        if (!isValidPhoneNumber(cleaned, defaultCountry)) {
            return null;
        }

        // Parse and format to E.164
        const parsed = parsePhoneNumber(cleaned, defaultCountry);
        return parsed.format('E.164');
    } catch (error) {
        console.error('Error formatting phone number:', error);
        return null;
    }
}

/**
 * Validates if a phone number is valid
 * @param phoneNumber - The phone number to validate
 * @param defaultCountry - Default country code (default: 'IN' for India)
 * @returns true if valid, false otherwise
 */
export function validatePhoneNumber(
    phoneNumber: string,
    defaultCountry: CountryCode = 'IN'
): boolean {
    try {
        const cleaned = phoneNumber.replace(/[^\d+]/g, '');
        return isValidPhoneNumber(cleaned, defaultCountry);
    } catch (error) {
        return false;
    }
}

/**
 * Masks a phone number for display purposes
 * Example: +919876543210 -> +91 98765****10
 * @param phoneNumber - The phone number to mask
 * @returns Masked phone number
 */
export function maskPhoneNumber(phoneNumber: string): string {
    try {
        const parsed = parsePhoneNumber(phoneNumber);
        const national = parsed.nationalNumber.toString();

        if (national.length <= 4) {
            return phoneNumber;
        }

        // Show first 5 digits and last 2 digits
        const visibleStart = national.slice(0, 5);
        const visibleEnd = national.slice(-2);
        const maskedMiddle = '*'.repeat(Math.max(0, national.length - 7));

        return `+${parsed.countryCallingCode} ${visibleStart}${maskedMiddle}${visibleEnd}`;
    } catch (error) {
        // Fallback masking if parsing fails
        const cleaned = phoneNumber.replace(/[^\d+]/g, '');
        if (cleaned.length <= 6) {
            return phoneNumber;
        }

        const start = cleaned.slice(0, 4);
        const end = cleaned.slice(-2);
        const middle = '*'.repeat(Math.max(0, cleaned.length - 6));

        return `${start}${middle}${end}`;
    }
}

/**
 * Extracts country code from a phone number
 * @param phoneNumber - The phone number
 * @returns Country code or null
 */
export function getCountryCode(phoneNumber: string): string | null {
    try {
        const parsed = parsePhoneNumber(phoneNumber);
        return parsed.country || null;
    } catch (error) {
        return null;
    }
}

/**
 * Formats phone number for display with country code
 * Example: +919876543210 -> +91 98765 43210
 * @param phoneNumber - The phone number to format
 * @returns Formatted phone number for display
 */
export function formatPhoneNumberForDisplay(phoneNumber: string): string {
    try {
        const parsed = parsePhoneNumber(phoneNumber);
        return parsed.formatInternational();
    } catch (error) {
        return phoneNumber;
    }
}
