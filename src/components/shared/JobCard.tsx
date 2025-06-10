import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, Users, Bookmark, Star } from 'lucide-react';
import Image from 'next/image';
import { Job } from '@/app/freelancer/feed/types';

interface JobCardProps {
  job: Job;
  variant?: 'default' | 'professional';
  onSelect?: (job: Job) => void;
  onApply?: (jobId: string) => void;
}

export function JobCard({ 
  job, 
  variant = 'default',
  onSelect,
  onApply 
}: JobCardProps) {
  const handleClick = () => {
    onSelect?.(job);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group rounded-xl overflow-hidden ${
        variant === 'professional' 
          ? 'bg-white/5 hover:bg-white/10' 
          : 'bg-white/5 hover:bg-white/10'
      } transition-colors cursor-pointer`}
      onClick={handleClick}
    >
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-white/70">{job.client?.name || 'Anonymous'}</span>
              {job.client?.rating && (
                <span className="flex items-center gap-1 text-xs text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {job.client.rating}
                </span>
              )}
            </div>
          </div>
          
          {variant === 'default' && (
            <button className="text-white/40 hover:text-white/70 transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
          )}
        </div>

        <p className="text-sm text-white/70 line-clamp-2">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {job.skills?.slice(0, 3).map((skill, i) => (
            <span 
              key={i}
              className="px-2 py-1 text-xs rounded-full bg-white/5 text-white/70"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {job.postedAt}
            </span>
          </div>
          
          <span className="text-base font-medium text-white">
            ₹{job.budget}
          </span>
        </div>

        {variant === 'default' && (
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Users className="w-4 h-4" />
              <span>{job.proposals} proposals</span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onApply?.(job.id);
              }}
            >
              Apply Now
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
