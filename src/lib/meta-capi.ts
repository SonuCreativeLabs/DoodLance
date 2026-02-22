import crypto from 'crypto';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;

interface MetaEvent {
    event_name: string;
    event_time: number;
    event_id: string;
    event_source_url: string;
    action_source: 'website' | 'app' | 'physical_store' | 'system_generated' | 'other';
    user_data: {
        em?: string[]; // hashed email
        ph?: string[]; // hashed phone
        client_ip_address?: string;
        client_user_agent?: string;
        fbc?: string;
        fbp?: string;
    };
    custom_data?: Record<string, any>;
}

export async function sendMetaEvent(event: Partial<MetaEvent>) {
    if (!PIXEL_ID || !ACCESS_TOKEN || PIXEL_ID === 'your_pixel_id_here') {
        console.warn('Meta Pixel ID or Access Token missing. Skipping CAPI event.');
        return;
    }

    const payload = {
        data: [
            {
                event_name: event.event_name,
                event_time: Math.floor(Date.now() / 1000),
                event_id: event.event_id,
                event_source_url: event.event_source_url,
                action_source: event.action_source || 'website',
                user_data: event.user_data,
                custom_data: event.custom_data,
            },
        ],
        ...(TEST_EVENT_CODE && TEST_EVENT_CODE !== 'your_test_event_code_here' && { test_event_code: TEST_EVENT_CODE }),
    };

    try {
        const response = await fetch(
            `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            }
        );

        const result = await response.json();
        if (!response.ok) {
            console.error('Meta CAPI Error:', result);
        }
        return result;
    } catch (error) {
        console.error('Meta CAPI Fetch Error:', error);
    }
}

// Helper to hash user data (SHA256)
export function hashData(data: string): string {
    return crypto
        .createHash('sha256')
        .update(data.trim().toLowerCase())
        .digest('hex');
}
