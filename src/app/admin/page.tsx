'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse" />
            <div className="h-4 w-64 bg-white/5 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-white/5 rounded-lg animate-pulse" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#1a1a1a] border border-white/5 p-6 rounded-xl animate-pulse">
              <div className="flex justify-between items-start">
                <div className="space-y-4 flex-1">
                  <div className="h-3 w-24 bg-white/10 rounded" />
                  <div className="h-7 w-16 bg-white/10 rounded" />
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-12 bg-white/5 rounded" />
                    <div className="h-3 w-16 bg-white/5 rounded" />
                  </div>
                </div>
                <div className="h-10 w-10 bg-white/5 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#1a1a1a] border border-white/5 rounded-xl p-6 h-[400px] animate-pulse">
            <div className="flex items-center justify-between mb-8">
              <div className="h-5 w-32 bg-white/10 rounded" />
              <div className="h-8 w-24 bg-white/5 rounded" />
            </div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-8 w-full bg-white/5 rounded-lg" style={{ opacity: 1 - (i * 0.1) }} />
              ))}
            </div>
          </div>
          <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 h-[400px] animate-pulse">
            <div className="h-5 w-32 bg-white/10 rounded mb-8" />
            <div className="h-48 w-48 mx-auto bg-white/5 rounded-full" />
            <div className="mt-8 space-y-3">
              <div className="h-3 w-full bg-white/5 rounded" />
              <div className="h-3 w-3/4 bg-white/5 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
