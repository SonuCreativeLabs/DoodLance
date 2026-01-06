import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { FreelancerProfile } from '@/components/client/FreelancerProfile';

interface PageProps {
    params: {
        username: string;
    };
}

async function getFreelancerByUsername(username: string) {
    const user = await prisma.user.findUnique({
        where: { username: username.toLowerCase() },
        include: {
            freelancerProfile: {
                include: {
                    experiences: true,
                    portfolios: true,
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
            title: 'User Not Found | DoodLance',
        };
    }

    return {
        title: `${user.name || user.username} - ${user.freelancerProfile.title || 'Freelancer'} | DoodLance`,
        description: user.freelancerProfile.bio || `Hire ${user.name} on DoodLance`,
        openGraph: {
            title: user.name || user.username,
            description: user.freelancerProfile.bio,
            images: user.avatar ? [user.avatar] : [],
        },
    };
}

export default async function PublicProfilePage({ params }: PageProps) {
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
