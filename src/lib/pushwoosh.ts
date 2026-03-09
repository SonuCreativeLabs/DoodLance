// src/lib/pushwoosh.ts

/**
 * Access the global Pushwoosh instance.
 * Because Pushwoosh loads asynchronously via a script tag, 
 * we use the push array format which Pushwoosh processes once loaded.
 */
const getPushwoosh = () => {
    if (typeof window !== 'undefined') {
        window.Pushwoosh = window.Pushwoosh || [];
        return window.Pushwoosh;
    }
    return null;
};

/**
 * Registers the user ID with Pushwoosh.
 * This links the device token to a specific user in your database.
 * @param userId - The unique identifier for the user (e.g., Supabase user.id)
 */
export const pwSetUserId = (userId: string) => {
    const pw = getPushwoosh();
    if (pw) {
        try {
            pw.push(['setUserId', userId]);
            console.log(`[Pushwoosh] User ID set to: ${userId}`);
        } catch (e) {
            console.error("[Pushwoosh] Error setting user ID:", e);
        }
    }
};

/**
 * Sets custom tags for the current user/device for marketing segmentation.
 * @param tags - An object of key-value pairs (e.g., { role: 'client', location: 'chennai', name: 'John' })
 */
export const pwSetTags = (tags: Record<string, string | number | boolean | string[]>) => {
    const pw = getPushwoosh();
    if (pw) {
        try {
            pw.push(['setTags', tags]);
            console.log(`[Pushwoosh] Tags set:`, tags);
        } catch (e) {
            console.error("[Pushwoosh] Error setting tags:", e);
        }
    }
};

/**
 * Posts a custom event to Pushwoosh for behavioral tracking/triggered campaigns.
 * @param eventName - The name of the event (e.g., 'Job_Posted', 'Hire_Clicked')
 * @param attributes - Optional attributes associated with the event
 */
export const pwPostEvent = (eventName: string, attributes?: Record<string, string | number | boolean>) => {
    const pw = getPushwoosh();
    if (pw) {
        try {
            pw.push(['postEvent', eventName, attributes || {}]);
            console.log(`[Pushwoosh] Event posted: ${eventName}`, attributes);
        } catch (e) {
            console.error(`[Pushwoosh] Error posting event ${eventName}:`, e);
        }
    }
};

// Add global declaration so TypeScript knows about window.Pushwoosh
declare global {
    interface Window {
        Pushwoosh: any[];
    }
}
