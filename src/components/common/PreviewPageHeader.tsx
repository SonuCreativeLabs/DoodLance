import { ArrowLeft, Share2 } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';

interface PreviewPageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onShare?: () => void;
  className?: string;
}

export function PreviewPageHeader({
  title,
  subtitle,
  onBack,
  onShare,
  className = ''
}: PreviewPageHeaderProps) {
  return (
    <div className={`sticky top-0 z-50 px-4 py-2 border-b border-white/5 bg-[#0f0f0f]/95 backdrop-blur-sm ${className}`}>
      <div className="flex items-center">
        {onBack && (
          <IconButton
            icon={ArrowLeft}
            onClick={onBack}
            aria-label="Back"
          />
        )}

        <div className="ml-3">
          <h1 className="text-lg font-semibold text-white">{title}</h1>
          {subtitle && (
            <p className="text-white/50 text-xs">{subtitle}</p>
          )}
        </div>

        {onShare && (
          <IconButton
            icon={Share2}
            onClick={onShare}
            aria-label="Share"
          />
        )}
      </div>
    </div>
  );
}
