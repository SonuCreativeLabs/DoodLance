
import { Skeleton } from "@/components/ui/skeleton"

export function TopRatedExpertSkeleton() {
    return (
        <div className="flex-shrink-0 w-[140px]">
            <div className="relative group h-full">
                {/* Card Background */}
                <div className="absolute inset-0 rounded-2xl border border-white/10 bg-[#161616]"></div>

                {/* Rating Badge Skeleton */}
                <div className="absolute top-2 left-2 z-30">
                    <Skeleton className="h-5 w-10 rounded-full" />
                </div>

                {/* Card Content */}
                <div className="relative p-3">
                    <div className="relative">
                        {/* Profile Picture */}
                        <div className="relative w-[100px] h-[100px] mx-auto mb-2">
                            <Skeleton className="w-full h-full rounded-full" />
                        </div>

                        {/* Expert Info */}
                        <div className="flex flex-col items-center gap-1.5 px-1">
                            <Skeleton className="h-4 w-24" /> {/* Name */}
                            <Skeleton className="h-3 w-20" /> {/* Role */}
                            <Skeleton className="h-3 w-16" /> {/* Location */}
                            <Skeleton className="h-2 w-12" /> {/* Distance */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
