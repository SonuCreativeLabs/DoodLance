
import React, { useRef } from 'react';
import { cn } from "@/lib/utils";

interface FilterChipProps {
    label: string;
    count: number;
    isSelected: boolean;
    onClick: () => void;
}

export const FilterChip = ({ label, count, isSelected, onClick }: FilterChipProps) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
        <button
            ref={buttonRef}
            onClick={() => {
                onClick();
                buttonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }}
            className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5",
                isSelected
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
            )}
        >
            {label.charAt(0).toUpperCase() + label.slice(1)}
            <span className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-full min-w-[16px] text-center",
                isSelected
                    ? "bg-purple-500/30 text-purple-300"
                    : "bg-white/10 text-white/50"
            )}>
                {count}
            </span>
        </button>
    );
};
