import { Skeleton } from "@/components/ui/skeleton"

export function ExpertCardSkeleton() {
    return (
        <div className="flex-shrink-0 w-[130px]">
            {/* Outer Card */}
            <div className="relative">
                {/* Card Background */}
                <div className="rounded-2xl border border-purple-400/10">
                    {/* Card Content */}
                    <div className="relative p-2.5">
                        {/* Rating Badge Skeleton */}
                        <div className="absolute top-2 left-2 z-30">
                            <Skeleton className="h-5 w-12 rounded-full" />
                        </div>

                        {/* Profile Picture Skeleton */}
                        <div className="relative w-[80px] h-[80px] mx-auto">
                            <Skeleton className="w-full h-full rounded-full" />
                        </div>

                        {/* Expert Info Skeletons */}
                        <div className="mt-1.5 space-y-1.5">
                            {/* Name */}
                            <Skeleton className="h-3 w-20 mx-auto" />
                            {/* Role */}
                            <Skeleton className="h-2.5 w-16 mx-auto" />
                            {/* Location */}
                            <Skeleton className="h-2 w-14 mx-auto" />
                            {/* Distance */}
                            <Skeleton className="h-2 w-12 mx-auto" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
