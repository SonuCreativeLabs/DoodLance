"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  id: string;
  title: string;
  icon: string;
  color: string;
}

export default function ServiceCard({ id, title, icon, color }: ServiceCardProps) {
  return (
    <Link href={`/services/${id}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "service-card p-4 rounded-xl flex flex-col items-center justify-center gap-3 aspect-square",
          "bg-white/90 dark:bg-slate-800/90 shadow-lg backdrop-blur-sm",
          "border border-slate-200 dark:border-slate-700"
        )}
        style={{
          backgroundColor: `${color}15`,
          boxShadow: `0 4px 6px -1px ${color}10, 0 2px 4px -1px ${color}20`
        }}
      >
        <div className="relative w-12 h-12">
          <Image
            src={icon}
            alt={title}
            fill
            className="object-contain drop-shadow-md"
          />
        </div>
        <span className="text-sm font-semibold text-center text-slate-900 dark:text-white drop-shadow-sm">
          {title}
        </span>
      </motion.div>
    </Link>
  );
} 