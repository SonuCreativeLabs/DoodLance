/**
 * Validates email format
 * @param email - Email address to validate
 * @returns true if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates phone number format
 * @param phone - Phone number to validate (can include country code)
 * @returns true if valid, false otherwise
 */
export function isValidPhone(phone: string): boolean {
    // Remove spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, '');

    // Check if it's a valid E.164 format or 10-digit number
    if (cleaned.startsWith('+')) {
        return /^\+[1-9]\d{1,14}$/.test(cleaned);
    }

    return /^[1-9]\d{9}$/.test(cleaned);
}
