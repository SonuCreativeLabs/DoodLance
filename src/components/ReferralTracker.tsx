'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function TrackerContent() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) {
            console.log('🔗 Referral Code Detected:', ref);
            localStorage.setItem('bails_referral_code', ref);
        }
    }, [searchParams]);

    return null;
}

export function ReferralTracker() {
    return (
        <Suspense fallback={null}>
            <TrackerContent />
        </Suspense>
    );
}
