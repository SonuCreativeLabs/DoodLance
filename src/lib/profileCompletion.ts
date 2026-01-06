/**
 * Profile Completion Utility
 * Checks if a user's profile is complete based on their role
 */

export interface ProfileCompletionResult {
    isComplete: boolean;
    missingFields: string[];
    completionPercentage: number;
}

export interface UserProfile {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    bio?: string;
    avatar?: string;
    role?: 'client' | 'freelancer' | 'admin';
    // Add other fields as needed
}

/**
 * Check if a client's profile is complete
 */
export function isClientProfileComplete(user: UserProfile): ProfileCompletionResult {
    const requiredFields = ['name', 'location'];
    const missingFields: string[] = [];

    requiredFields.forEach(field => {
        const value = user[field as keyof UserProfile];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            missingFields.push(field);
        }
    });

    return {
        isComplete: missingFields.length === 0,
        missingFields,
        completionPercentage: Math.round(((requiredFields.length - missingFields.length) / requiredFields.length) * 100)
    };
}

/**
 * Check if a freelancer's profile is complete
 */
export function isFreelancerProfileComplete(user: UserProfile): ProfileCompletionResult {
    const requiredFields = ['name', 'location', 'bio'];
    const missingFields: string[] = [];

    requiredFields.forEach(field => {
        const value = user[field as keyof UserProfile];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            missingFields.push(field);
        }
    });

    // Note: We should also check for skills, but that requires additional context data
    // For now, we'll just check basic fields

    return {
        isComplete: missingFields.length === 0,
        missingFields,
        completionPercentage: Math.round(((requiredFields.length - missingFields.length) / requiredFields.length) * 100)
    };
}

/**
 * Main function to check profile completion based on role
 */
export function checkProfileCompletion(user: UserProfile): ProfileCompletionResult {
    const role = user.role || 'client';

    if (role === 'freelancer') {
        return isFreelancerProfileComplete(user);
    }

    return isClientProfileComplete(user);
}

/**
 * Get the profile edit URL based on user role
 */
export function getProfileEditUrl(role: 'client' | 'freelancer' | 'admin'): string {
    if (role === 'freelancer') {
        return '/freelancer/profile/personal';
    }
    return '/client/profile/edit';
}

/**
 * Build a profile URL with return path
 */
export function buildProfileUrlWithReturn(role: 'client' | 'freelancer' | 'admin', returnTo?: string): string {
    const baseUrl = getProfileEditUrl(role);
    if (returnTo) {
        return `${baseUrl}?returnTo=${encodeURIComponent(returnTo)}`;
    }
    return baseUrl;
}
