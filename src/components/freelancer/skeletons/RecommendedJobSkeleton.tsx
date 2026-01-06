'use client';

export function RecommendedJobSkeleton() {
    return (
        <div className="bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-2xl p-6 shadow-xl w-full border border-white/5">
            <div className="space-y-2">
                {/* Job header */}
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-12 h-12 rounded-xl bg-white/5 animate-shimmer flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="h-5 w-3/4 bg-white/5 rounded mb-2 animate-shimmer" />
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-16 bg-white/5 rounded animate-shimmer" />
                            <div className="h-4 w-20 bg-white/5 rounded animate-shimmer" />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2 mb-1">
                    <div className="h-3 w-full bg-white/5 rounded animate-shimmer" />
                    <div className="h-3 w-5/6 bg-white/5 rounded animate-shimmer" />
                </div>

                {/* Location and Date */}
                <div className="flex items-center justify-between mb-2">
                    <div className="h-3 w-24 bg-white/5 rounded animate-shimmer" />
                    <div className="h-3 w-32 bg-white/5 rounded animate-shimmer" />
                </div>

                {/* Skills */}
                <div className="flex gap-2 mb-1">
                    <div className="h-6 w-16 bg-white/5 rounded-full animate-shimmer" />
                    <div className="h-6 w-20 bg-white/5 rounded-full animate-shimmer" />
                    <div className="h-6 w-12 bg-white/5 rounded-full animate-shimmer" />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-2">
                    <div className="h-5 w-20 bg-white/5 rounded animate-shimmer" />
                    <div className="h-8 w-24 bg-white/5 rounded-xl animate-shimmer" />
                </div>
            </div>
        </div>
    );
}
