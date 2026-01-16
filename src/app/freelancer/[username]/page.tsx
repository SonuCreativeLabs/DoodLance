import { redirect } from 'next/navigation';

interface PageProps {
    params: {
        username: string;
    };
}

export default function FreelancerUsernameRedirect({ params }: PageProps) {
    redirect(`/${params.username}`);
}
