import { Skeleton } from "@/components/ui/skeleton"

export function ExpertCardSkeleton() {
    return (
        <div className="bg-[#111111] shadow-lg rounded-xl p-3 border border-white/10 backdrop-blur-xl">
            <div className="flex items-start gap-4">
                {/* Left Column: Avatar & Rating */}
                <div className="flex flex-col items-center w-20 gap-2">
                    <Skeleton className="w-14 h-14 rounded-full" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                </div>

                {/* Right Column: Details */}
                <div className="flex-1 space-y-2.5 py-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="space-y-1.5 pt-1">
                        <Skeleton className="h-3.5 w-1/3" />
                        <Skeleton className="h-3.5 w-1/4" />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-3">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
        </div>
    )
}
