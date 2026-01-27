import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://bails.in';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/admin/',
                '/api/',
                '/auth/',
                '/freelancer/', // Freelancer dashboard
                '/client/bookings',
                '/client/profile',
                '/client/referrals',
                '/client/notifications',
                '/client/support',
                '/client/post', // Job posting likely requires auth
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
