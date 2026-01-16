'use client';

import { Skeleton } from "@/components/ui/skeleton"

export function DashboardCardSkeleton() {
    return (
        <div className="bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-2xl p-6 border border-white/10 shadow-lg">
            <div className="space-y-4">
                {/* Header Skeleton */}
                <Skeleton className="h-5 w-32" />

                {/* Amount Skeleton */}
                <Skeleton className="h-8 w-24" />

                {/* Description Skeleton */}
                <Skeleton className="h-4 w-40" />
            </div>
        </div>
    );
}
