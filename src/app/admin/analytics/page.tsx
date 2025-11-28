'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AnalyticsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to reports page which has analytics
    router.push('/admin/reports');
  }, [router]);

  return null;
}
