'use client';

import { Skeleton } from "@/components/ui/skeleton"

export function ProfileCardSkeleton() {
    return (
        <div className="bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-2xl p-6 border border-white/10 shadow-lg">
            <div className="flex items-start gap-4 mb-6">
                {/* Avatar Skeleton */}
                <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />

                <div className="flex-1 space-y-3">
                    {/* Name Skeleton */}
                    <Skeleton className="h-6 w-40" />

                    {/* Title Skeleton */}
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex gap-3">
                <Skeleton className="h-10 flex-1 rounded-lg" />
                <Skeleton className="h-10 flex-1 rounded-lg" />
            </div>
        </div>
    );
}
