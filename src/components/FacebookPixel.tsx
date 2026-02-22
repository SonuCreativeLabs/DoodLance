'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import * as fbq from '@/lib/fpixel';

const FacebookPixelContent = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // This is the initialize function
        fbq.pageview();
    }, [pathname, searchParams]);

    return null;
};

const FacebookPixel = () => {
    return (
        <Suspense fallback={null}>
            <FacebookPixelContent />
        </Suspense>
    );
};

export default FacebookPixel;
