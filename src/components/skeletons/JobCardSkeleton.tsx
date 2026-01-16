import { Skeleton } from "@/components/ui/skeleton"

export function JobCardSkeleton() {
    return (
        <div className="p-5 rounded-xl bg-[#1E1E1E] border border-white/5 w-full shadow-lg">
            <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>

                {/* Action button */}
                <Skeleton className="h-9 w-full rounded-lg" />
            </div>
        </div>
    )
}
