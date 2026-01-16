import { Skeleton } from "@/components/ui/skeleton"

export function BookingCardSkeleton() {
    return (
        <div className="p-5 rounded-xl bg-[#1E1E1E] border border-white/5 w-full shadow-lg">
            <div className="space-y-4">
                {/* Status and ID */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-12 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                </div>

                {/* Service name and code */}
                <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-5 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-32" />
                </div>

                {/* Date and time grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                    <div className="space-y-1.5">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <Skeleton className="h-9 flex-1 rounded-lg" />
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <Skeleton className="h-9 w-9 rounded-lg" />
                </div>
            </div>
        </div>
    )
}
