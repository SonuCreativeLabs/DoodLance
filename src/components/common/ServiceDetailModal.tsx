import { useState } from 'react';
import { ServiceVideoCarousel } from '@/components/common/ServiceVideoCarousel';
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock } from 'lucide-react';

interface ServiceItem {
    id: string;
    title: string;
    description: string;
    price: string | number;
    deliveryTime: string;
    category?: string;
    features?: string[];
    videoUrls?: string[];
}

interface ServiceDetailModalProps {
    service: ServiceItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ServiceDetailModal({ service, isOpen, onClose }: ServiceDetailModalProps) {
    if (!isOpen || !service) return null;

    return (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div
                className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl bg-[#0F0F0F] border border-white/10 relative hide-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    aria-label="Close service detail"
                    className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition shadow-md backdrop-blur-md"
                >
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 6L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M16 6L6 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Media Section */}
                <div className="relative w-full aspect-video bg-[#000]">
                    <ServiceVideoCarousel
                        videoUrls={service.videoUrls || []}
                        className="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent pointer-events-none" />

                    {/* Category Badge */}
                    {service.category && (
                        <div className="absolute bottom-4 left-4 z-20">
                            <Badge className="bg-white/10 text-white/90 border-white/20 px-3 py-1 text-xs backdrop-blur-md">
                                {service.category}
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8 space-y-6">
                    {/* Header with Title and Price */}
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                            {service.title}
                        </h2>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-2xl font-bold text-purple-400">
                                ₹{String(service.price).replace(/^₹/, '')}
                            </span>
                            <span className="text-lg text-white/50 font-medium">
                                / {service.deliveryTime}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3">About This Service</h3>
                        <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                            {service.description}
                        </p>
                    </div>

                    {/* Features */}
                    {service.features && service.features.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3">What's Included</h3>
                            <ul className="grid grid-cols-1 gap-3">
                                {service.features.map((feature, i) => (
                                    <li key={i} className="flex items-start bg-white/5 p-3 rounded-lg border border-white/5">
                                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-purple-400 mr-3 mt-0.5" />
                                        <span className="text-white/90 text-sm leading-relaxed">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
