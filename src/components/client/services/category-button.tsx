"use client"

import { cn } from '@/lib/utils'

interface CategoryButtonProps {
  id: string
  name: string[]
  icon: string
  isSelected: boolean
  onClick: () => void
  buttonRef?: React.RefObject<HTMLButtonElement>
}

export default function CategoryButton({
  id,
  name,
  icon,
  isSelected,
  onClick,
  buttonRef
}: CategoryButtonProps) {
  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={cn(
        "w-full flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all duration-200 group relative",
        isSelected && "after:absolute after:top-1/2 after:-translate-y-1/2 after:left-0 after:w-[2px] after:h-6 after:bg-purple-500 after:rounded-r-full",
        !isSelected && "hover:bg-white/[0.02]"
      )}
    >
      <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200">
        <span className={cn(
          "text-[24px] transition-transform",
          isSelected
            ? "text-white scale-110 font-bold"
            : "text-white/60 group-hover:text-white/80 group-hover:scale-105"
        )}>
          {icon}
        </span>
      </div>
      <div className="flex flex-col items-center leading-none">
        {name.map((line, index) => (
          <span
            key={index}
            className={cn(
              "text-[9px] transition-colors",
              isSelected
                ? "text-white font-bold"
                : "text-white/40 font-medium group-hover:text-white/60"
            )}
          >
            {line}
          </span>
        ))}
      </div>
    </button>
  )
} 