import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { FreelancerProfile } from '@/components/client/FreelancerProfile';

interface PageProps {
    params: {
        username: string;
    };
}

async function getFreelancerByUsername(username: string) {
    const user = await prisma.user.findFirst({
        where: {
            username: {
                equals: decodeURIComponent(username).trim(),
                mode: 'insensitive'
            }
        },
        include: {
            freelancerProfile: {
                include: {
                    achievements: true,
                    reviews: true,
                },
            },
        },
    });

    return user;
}

export async function generateMetadata({ params }: PageProps) {
    const user = await getFreelancerByUsername(params.username);

    if (!user || !user.freelancerProfile) {
        return {
            title: 'User Not Found | BAILS',
        };
    }

    return {
        title: `${user.name || user.username} - ${user.freelancerProfile.title || 'Freelancer'} | BAILS`,
        description: user.freelancerProfile.about || `Hire ${user.name} on BAILS`,
        openGraph: {
            title: user.name || user.username,
            description: user.freelancerProfile.about,
            images: user.avatar ? [user.avatar] : [],
        },
    };
}

export default async function PublicProfilePage({ params }: PageProps) {
    // Force lowercase URL
    if (params.username !== params.username.toLowerCase()) {
        const { redirect } = require('next/navigation');
        redirect(`/${params.username.toLowerCase()}`);
    }

    const user = await getFreelancerByUsername(params.username);

    if (!user || !user.freelancerProfile) {
        notFound();
    }

    return (
        <FreelancerProfile
            freelancerId={user.freelancerProfile.id}
            isPublicView={true}
        />
    );
}
