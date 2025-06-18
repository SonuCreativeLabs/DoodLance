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
      <Card className="h-full bg-[#1E1E1E] border border-white/5 hover:border-white/10 transition-all duration-300 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {icon && <span className="text-purple-400">{icon}</span>}
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {count !== undefined && (
              <span className="text-sm px-2 py-1 rounded-full bg-purple-500/10 text-purple-300">
                {count}
              </span>
            )}
            <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-white/80 transition-colors" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-white/60">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
