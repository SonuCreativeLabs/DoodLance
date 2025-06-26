import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProfileSectionCardProps {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  count?: number;
}

export function ProfileSectionCard({
  title,
  description,
  href,
  icon,
  count,
}: ProfileSectionCardProps) {
  return (
    <Link href={href} className="block h-full group">
      <div className="h-full bg-gradient-to-br from-[#1E1E1E] to-[#121212] border border-white/10 hover:border-purple-500/30 transition-all duration-300 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-purple-900/20 p-6">
        <div className="flex flex-col h-full">
          <div className="flex flex-row items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              {icon && <span className="text-purple-400">{icon}</span>}
              {title}
            </h3>
            <div className="flex items-center gap-2">
              {count !== undefined && (
                <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                  {count}
                </span>
              )}
              <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-white/80 transition-colors" />
            </div>
          </div>
          <p className="text-sm text-white/60 mt-2">{description}</p>
        </div>
      </div>
    </Link>
  );
}
