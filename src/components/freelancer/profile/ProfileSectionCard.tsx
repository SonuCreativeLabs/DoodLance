import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProfileSectionCardProps {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
}

export function ProfileSectionCard({
  title,
  description,
  href,
  icon,
}: ProfileSectionCardProps) {
  return (
    <Link href={href} className="block h-full group">
      <div className="h-full bg-gradient-to-br from-[#1E1E1E] to-[#121212] border border-white/10 hover:border-purple-500/30 transition-all duration-200 rounded-xl overflow-hidden hover:shadow-md hover:shadow-purple-900/10 p-4">
        <div className="flex flex-col h-full">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-base font-medium text-white flex items-center gap-2">
              {icon && <span className="text-purple-400">{icon}</span>}
              {title}
            </h3>
            <ArrowRight className="h-3.5 w-3.5 text-white/40 group-hover:text-white/80 transition-colors flex-shrink-0" />
          </div>
          <p className="text-xs text-white/50 mt-1.5 line-clamp-2">{description}</p>
        </div>
      </div>
    </Link>
  );
}
