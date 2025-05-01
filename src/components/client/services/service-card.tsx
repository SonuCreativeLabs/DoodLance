"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  id: string;
  title: string;
  image: string;
  discount?: number;
  isMostBooked?: boolean;
}

export default function ServiceCard({ id, title, image, discount, isMostBooked }: ServiceCardProps) {
  return (
    <Link href={`/services/${id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative w-full aspect-[3/4] rounded-xl overflow-hidden"
      >
        {/* Background Image */}
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {discount && (
            <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded">
              {discount}% OFF
            </span>
          )}
          {isMostBooked && (
            <span className="px-2 py-1 text-xs font-semibold bg-purple-500 text-white rounded">
              Most Booked
            </span>
          )}
        </div>
        
        {/* Title */}
        <div className="absolute bottom-0 w-full p-4">
          <h3 className="text-lg font-bold text-white drop-shadow-lg">
            {title}
          </h3>
        </div>
      </motion.div>
    </Link>
  );
} 