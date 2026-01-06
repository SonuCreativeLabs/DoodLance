import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSkeleton() {
    return (
        <div className="fixed inset-0 z-[9999] bg-[#0F0F0F] flex flex-col h-screen w-screen overflow-hidden">
            <div className="flex-1 overflow-y-auto">
                {/* Cover Photo Skeleton */}
                <div className="relative h-48 md:h-64 w-full">
                    <Skeleton className="w-full h-full rounded-none" />
                </div>

                {/* Profile Content */}
                <div className="max-w-6xl mx-auto px-4 relative z-20">
                    <div className="flex flex-col items-center -mt-16 mb-4">
                        {/* Profile Picture Skeleton */}
                        <Skeleton className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-[#1E1E1E]" />
                    </div>

                    {/* Name and Role Skeletons */}
                    <div className="text-center mb-4 space-y-2">
                        <Skeleton className="h-6 w-32 mx-auto" />
                        <Skeleton className="h-4 w-24 mx-auto" />

                        {/* Location and Rating Skeletons */}
                        <div className="mt-2 space-y-1.5">
                            <Skeleton className="h-3 w-40 mx-auto" />
                            <Skeleton className="h-3 w-36 mx-auto" />
                        </div>
                    </div>

                    {/* Skills Skeleton */}
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-6 w-16 rounded-full" />
                        ))}
                    </div>
                </div>

                {/* Tabs Skeleton */}
                <div className="sticky top-0 z-[100] bg-[#0f0f0f] border-b border-white/5">
                    <div className="flex gap-4 px-4 py-3">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-4 w-16" />
                        ))}
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="w-full max-w-4xl mx-auto px-6 py-6 space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />

                    <div className="pt-4 space-y-3">
                        <Skeleton className="h-32 w-full rounded-xl" />
                        <Skeleton className="h-32 w-full rounded-xl" />
                        <Skeleton className="h-32 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    )
}
