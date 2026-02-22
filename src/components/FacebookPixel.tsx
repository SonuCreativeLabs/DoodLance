'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import * as fbq from '@/lib/fpixel';

const FacebookPixel = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // This is the initialize function
        fbq.pageview();
    }, [pathname, searchParams]);

    return null;
};

export default FacebookPixel;
