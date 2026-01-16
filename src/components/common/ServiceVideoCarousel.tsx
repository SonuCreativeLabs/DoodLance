import React, { useState, useRef, useEffect } from 'react';
import { Play, ArrowLeft, ArrowRight, Briefcase } from 'lucide-react';
import { VideoEmbed } from '@/components/common/VideoEmbed';

interface ServiceVideoCarouselProps {
    videoUrls: string[];
    onVideoClick?: (url: string) => void;
    className?: string;
}

export function ServiceVideoCarousel({ videoUrls, onVideoClick, className = '' }: ServiceVideoCarouselProps) {
    if (videoUrls?.length) console.log('Carousel Rendering for:', videoUrls); // Debug
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const hasVideos = videoUrls && videoUrls.length > 0 && videoUrls[0];
    const totalVideos = hasVideos ? videoUrls.length : 0;

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollLeft, clientWidth } = scrollContainerRef.current;
        // Calculate index based on scroll position
        const index = Math.round(scrollLeft / clientWidth);
        if (index !== currentIndex && index >= 0 && index < totalVideos) {
            setCurrentIndex(index);
        }
    };

    const scrollToIndex = (index: number) => {
        if (!scrollContainerRef.current) return;
        const width = scrollContainerRef.current.clientWidth;
        scrollContainerRef.current.scrollTo({
            left: width * index,
            behavior: 'smooth'
        });
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        const nextIndex = (currentIndex + 1) % totalVideos;
        scrollToIndex(nextIndex);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        const prevIndex = (currentIndex - 1 + totalVideos) % totalVideos;
        scrollToIndex(prevIndex);
    };

    const handleVideoClick = (url: string) => {
        if (onVideoClick) {
            onVideoClick(url);
        } else {
            window.open(url, '_blank');
        }
    };

    if (!hasVideos) {
        return (
            <div className={`relative w-full aspect-video bg-gradient-to-br from-purple-900/20 to-black flex items-center justify-center ${className}`}>
                <Briefcase className="h-10 w-10 text-white/20" />
            </div>
        );
    }

    return (
        <div className={`relative w-full aspect-video bg-[#1E1E1E] group/carousel ${className}`} dir="ltr">
            {/* Scroll Container */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {videoUrls.map((url, idx) => (
                    <div
                        key={`${url}-${idx}`}
                        className="min-w-full w-full h-full snap-center relative flex-shrink-0"
                    >
                        {/* Video Embed Background */}
                        <div className="absolute inset-0 opacity-60">
                            <VideoEmbed
                                url={url}
                                className="pointer-events-none w-full h-full"
                                preview={true}
                            />
                        </div>

                        {/* Click Overlay */}
                        <div
                            className="absolute inset-0 bg-transparent group-hover/carousel:bg-black/30 transition-all duration-300 flex items-center justify-center cursor-pointer z-10"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card click if nested
                                handleVideoClick(url);
                            }}
                        >
                            <div className="w-12 h-12 rounded-full bg-purple-600/80 group-hover/carousel:bg-purple-500 group-hover/carousel:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg">
                                <Play className="h-6 w-6 text-white ml-1" fill="currentColor" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation and Controls - Flex Overlay */}
            {totalVideos > 1 && (
                <>
                    <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-between px-3">
                        {/* Prev Button */}
                        <button
                            onClick={handlePrev}
                            className="pointer-events-auto w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-black/60 hover:scale-105"
                            title="Previous video"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>

                        {/* Next Button */}
                        <button
                            onClick={handleNext}
                            className="pointer-events-auto w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-black/60 hover:scale-105"
                            title="Next video"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Counter Badge */}
                    <div className="absolute bottom-3 right-3 z-30 pointer-events-none">
                        <div className="bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/10 shadow-sm">
                            {currentIndex + 1} / {totalVideos}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
