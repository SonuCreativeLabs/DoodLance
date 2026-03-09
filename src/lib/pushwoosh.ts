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
 * Safely executes a pushwoosh command.
 * If Pushwoosh is not fully loaded, it pushes to the array queue natively.
 * We wrap this in a small timeout to let the main script hydrate first if called too early.
 */
const safePush = (command: any[]) => {
    const pw = getPushwoosh();
    if (pw) {
        try {
            pw.push(command);
        } catch (e) {
            console.warn(`[Pushwoosh] Queuing command failed (Script likely not ready):`, e);
            // Fallback: manually push to the raw array if the Pushwoosh override failed
            if (Array.isArray(window.Pushwoosh)) {
                window.Pushwoosh[window.Pushwoosh.length] = command;
            }
        }
    }
};

/**
 * Registers the user ID with Pushwoosh.
 * This links the device token to a specific user in your database.
 * @param userId - The unique identifier for the user (e.g., Supabase user.id)
 */
export const pwSetUserId = (userId: string) => {
    safePush(['setUserId', userId]);
    console.log(`[Pushwoosh] User ID set to: ${userId}`);
};

/**
 * Sets custom tags for the current user/device for marketing segmentation.
 * @param tags - An object of key-value pairs (e.g., { role: 'client', location: 'chennai', name: 'John' })
 */
export const pwSetTags = (tags: Record<string, string | number | boolean | string[]>) => {
    safePush(['setTags', tags]);
    console.log(`[Pushwoosh] Tags set:`, tags);
};

/**
 * Posts a custom event to Pushwoosh for behavioral tracking/triggered campaigns.
 * @param eventName - The name of the event (e.g., 'Job_Posted', 'Hire_Clicked')
 * @param attributes - Optional attributes associated with the event
 */
export const pwPostEvent = (eventName: string, attributes?: Record<string, string | number | boolean>) => {
    safePush(['postEvent', eventName, attributes || {}]);
    console.log(`[Pushwoosh] Event posted: ${eventName}`, attributes);
};

// Add global declaration so TypeScript knows about window.Pushwoosh
declare global {
    interface Window {
        Pushwoosh: any[];
    }
}
