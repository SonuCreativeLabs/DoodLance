'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function JobsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to bookings page which handles job bookings
    router.push('/admin/bookings');
  }, [router]);

  return null;
}
