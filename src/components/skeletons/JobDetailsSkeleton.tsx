import React from 'react';

export const JobDetailsSkeleton = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-6 pb-24">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header Section Skeleton */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                        <div className="h-6 w-20 bg-white/5 rounded-full animate-pulse" />
                    </div>
                    <div className="h-8 w-3/4 bg-white/10 rounded animate-pulse" />
                </div>

                {/* Client Card Skeleton */}
                <div className="bg-[#111111] border border-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
                            <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
                        </div>
                        <div className="h-8 w-8 bg-white/5 rounded-full animate-pulse" />
                    </div>
                </div>

                {/* Job Stats Grid Skeleton */}
                <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-[#111111] border border-white/5 rounded-xl p-4 space-y-2">
                            <div className="h-4 w-4 bg-white/10 rounded animate-pulse" />
                            <div className="space-y-1">
                                <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
                                <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Description Skeleton */}
                <div className="bg-[#111111] border border-white/5 rounded-xl p-5 space-y-4">
                    <div className="h-5 w-32 bg-white/10 rounded animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
                        <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
                        <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse" />
                    </div>
                </div>

                {/* Requirements/Skills Skeleton */}
                <div className="bg-[#111111] border border-white/5 rounded-xl p-5 space-y-4">
                    <div className="h-5 w-32 bg-white/10 rounded animate-pulse" />
                    <div className="flex flex-wrap gap-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-8 w-20 bg-white/5 rounded-lg animate-pulse" />
                        ))}
                    </div>
                </div>

                {/* Footer Actions Skeleton */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0a0a0a]/80 backdrop-blur-lg border-t border-white/5">
                    <div className="max-w-3xl mx-auto flex gap-3">
                        <div className="h-12 flex-1 bg-white/10 rounded-xl animate-pulse" />
                        <div className="h-12 flex-1 bg-white/10 rounded-xl animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
};
