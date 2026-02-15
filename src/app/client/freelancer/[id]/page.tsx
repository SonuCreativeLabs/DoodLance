"use client";

import { FreelancerProfile } from '@/components/client/FreelancerProfile';

export default function FreelancerDetailPage({ params }: { params: { id: string } }) {
    return <FreelancerProfile freelancerId={params.id} />;
}
