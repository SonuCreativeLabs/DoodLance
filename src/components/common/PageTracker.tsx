'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pwPostEvent } from '@/lib/pushwoosh';
import { useAuth } from '@/contexts/AuthContext';

export function PageTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    useEffect(() => {
        if (pathname) {
            // Create a clean URL representation
            let url = pathname;
            if (searchParams?.toString()) {
                url = `${url}?${searchParams.toString()}`;
            }

            // Track the general page view
            pwPostEvent('Page_Viewed', {
                path: pathname,
                full_url: url,
                user_role: user?.role || 'guest'
            });

            // Special tracking for key Client/Discovery paths
            if (pathname === '/client/nearby/hirefeed') {
                const view = searchParams?.get('view') || 'map';
                pwPostEvent('Viewed_Nearby_Discovery', { view_type: view });
            } else if (pathname.startsWith('/freelancer/profile/')) {
                // Attempt to extract username/ID from the URL segment after profile/
                const segments = pathname.split('/');
                const profileId = segments[segments.length - 1];
                // Only track if we actually have an ID and we're not just on the base /profile page
                if (profileId && profileId !== 'profile') {
                    pwPostEvent('Viewed_Freelancer_Profile', { profile_id: profileId });
                }
            } else if (pathname === '/freelancer/dashboard') {
                pwPostEvent('Viewed_Freelancer_Dashboard');
            } else if (pathname === '/client/post') {
                pwPostEvent('Viewed_Post_Job_Form');
            }
        }
    }, [pathname, searchParams, user?.role]);

    return null; // This component doesn't render anything
}
