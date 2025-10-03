'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // If this is not a direct page load (i.e., client-side navigation)
      if (window.performance && window.performance.navigation.type !== 0) {
        // Try to navigate to the current path
        const path = window.location.pathname + window.location.search;
        router.replace(path);
      }
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white p-4 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          404 - Page Not Found
        </h1>
        <p className="text-gray-400">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="pt-4">
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
