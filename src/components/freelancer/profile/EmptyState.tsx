import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: ReactNode;
    className?: string;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className
}: EmptyStateProps) {
    return (
        <div className={cn("space-y-4", className)}>
            <div className="overflow-hidden">
                <div className="p-0">
                    <div className="p-4 sm:p-6 bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-2xl border border-white/5">
                        <div className="flex flex-col gap-4 items-center justify-center py-12 text-center">
                            <div className="bg-white/5 p-4 rounded-full mb-2">
                                <Icon className="h-8 w-8 text-white/40" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-white mb-1">{title}</h3>
                                <p className="text-white/40 text-sm max-w-xs mx-auto">
                                    {description}
                                </p>
                            </div>
                            {action && (
                                <div className="mt-2">
                                    {action}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
