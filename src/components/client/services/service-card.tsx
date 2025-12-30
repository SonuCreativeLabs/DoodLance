"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Camera } from 'lucide-react';

interface ServiceCardProps {
  id: string;
  title: string;
  image: string;
  icon?: string;
  providerCount?: number;
  discount?: string;
  isMostBooked?: boolean;
  className?: string;
}

export default function ServiceCard({
  id,
  title,
  image,
  icon,
  providerCount,
  discount,
  isMostBooked,
  className
}: ServiceCardProps) {
  return (
    <Link href={`/services/${id}`}>
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={cn(
          "relative w-full aspect-[3/4] rounded-2xl overflow-hidden group",
          className
        )}
      >
        {/* Fallback/Loading State - brand icon instead of emoji */}
        <div className="absolute inset-0 flex items-center justify-center z-0 bg-[#161616]">
          <Camera className="w-12 h-12 text-white/30" />
        </div>

        {/* Background Image */}
        <img
          src={image}
          alt={title}
          className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out z-[1] ${title === 'Sidearm' ? 'object-right' : ''}`}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (target.src !== '/images/cover-placeholder.svg') {
              target.src = '/images/cover-placeholder.svg';
            }
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-[2]" />

        {/* Content */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between z-[3]">
          {/* Badges */}
          <div className="flex flex-wrap items-start gap-1">
            {discount && (
              <div className="bg-purple-500/80 backdrop-blur-[2px] text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full">
                {discount}
              </div>
            )}
            {isMostBooked && (
              <div className="bg-amber-500/80 backdrop-blur-[2px] text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full">
                Most Booked
              </div>
            )}
          </div>

          {/* Title and Provider Count */}
          <div className="space-y-1">
            <h3 className="font-semibold text-white leading-tight break-words"
              style={{
                fontSize: 'clamp(13px, 3vw, 16px)',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minHeight: '2.4em',
                maxHeight: '4.5em',
                lineHeight: '1.2'
              }}
            >
              {title}
            </h3>

          </div>
        </div>
      </motion.div>
    </Link>
  );
} 