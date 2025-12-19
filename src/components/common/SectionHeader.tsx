import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
  viewAllText?: string;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  showViewAll = false,
  onViewAll,
  viewAllText,
  className = ''
}: SectionHeaderProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">{title}</h2>
          {subtitle && (
            <p className="text-white/60 text-sm">{subtitle}</p>
          )}
        </div>
        {showViewAll && onViewAll && (
          <button
            onClick={onViewAll}
            className="w-full sm:w-auto mt-2 sm:mt-0 py-2.5 px-4 border border-white/30 hover:bg-white/5 transition-colors text-sm font-medium flex items-center justify-center gap-2 text-white rounded-[6px]"
          >
            {viewAllText || `View All ${title}`}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
