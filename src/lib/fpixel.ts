export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export const pageview = () => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'PageView');
    }
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name: string, options = {}, eventId?: string) => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', name, options, eventId ? { eventID: eventId } : undefined);
    }
};
