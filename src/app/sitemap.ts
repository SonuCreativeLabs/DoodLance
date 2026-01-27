import { MetadataRoute } from 'next';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://bails.in';

    // Static routes
    const staticRoutes = [
        '',
        '/auth/login',
        '/client',
        '/client/nearby',
        '/client/services',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.9,
    }));

    // Fetch freelancers with profiles
    // We only want to index profiles that are "public" or complete enough
    // For now, checks existence of freelancerProfile and username
    const freelancers = await prisma.user.findMany({
        where: {
            freelancerProfile: {
                isNot: null,
            },
            username: {
                not: null,
            },
            // You might want to check isVerified or isProfilePublic if those fields exist on FreelancerProfile
            // Looking at the schema, FreelancerProfile has isProfilePublic default true.
            // But query user relation to filter...
        },
        include: {
            freelancerProfile: {
                select: {
                    isProfilePublic: true,
                    updatedAt: true
                }
            }
        }
    });

    const freelancerRoutes = freelancers
        .filter(f => f.username && f.freelancerProfile?.isProfilePublic)
        .map((freelancer) => ({
            url: `${baseUrl}/${freelancer.username!.toLowerCase()}`,
            lastModified: freelancer.freelancerProfile?.updatedAt || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

    return [...staticRoutes, ...freelancerRoutes];
}
