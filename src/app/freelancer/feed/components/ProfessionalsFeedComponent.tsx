import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface Professional {
  id: number;
  name: string;
  service: string;
  rating: number;
  reviews: number;
  completedJobs: number;
  location: string;
  responseTime: string;
  image: string;
  distance: number;
  price: number;
  priceUnit: string;
}

interface ProfessionalsFeedProps {
  professionals: Professional[];
}

export default function ProfessionalsFeed({ professionals }: ProfessionalsFeedProps) {
  return (
    <div className="space-y-4 mt-4">
      {professionals.map((professional) => (
        <div
          key={professional.id}
          className="bg-white/5 rounded-xl p-4 space-y-4 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={professional.image}
                alt={professional.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">
                {professional.name}
              </h3>
              <p className="text-white/60 text-sm">{professional.service}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-white/80 text-sm">{professional.rating}</span>
                </div>
                <span className="text-white/40 text-sm">•</span>
                <span className="text-white/60 text-sm">{professional.reviews} reviews</span>
                <span className="text-white/40 text-sm">•</span>
                <span className="text-white/60 text-sm">{professional.completedJobs} jobs</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-white/5 rounded-md">
                <span className="text-white/80 text-sm">₹{professional.price}/{professional.priceUnit}</span>
              </div>
              <div className="px-2 py-1 bg-white/5 rounded-md">
                <span className="text-white/80 text-sm">{professional.distance} km away</span>
              </div>
            </div>
            <p className="text-white/40 text-sm">{professional.responseTime}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
