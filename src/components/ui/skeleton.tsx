import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-md bg-white/5",
                "before:absolute before:inset-0",
                "before:-translate-x-full",
                "before:animate-[shimmer_2s_infinite]",
                "before:bg-gradient-to-r",
                "before:from-transparent before:via-purple-500/10 before:to-transparent",
                className
            )}
            {...props}
        />
    )
}
