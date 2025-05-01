import { cn } from '@/lib/utils'

interface ServiceCategoryProps {
  name: string
  icon: string
  isSelected?: boolean
  onClick?: () => void
}

export function ServiceCategory({
  name,
  icon,
  isSelected,
  onClick,
}: ServiceCategoryProps) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-3 px-4 py-3 cursor-pointer transition-all",
        "hover:bg-purple-50 dark:hover:bg-purple-950/20",
        isSelected && "bg-purple-100 dark:bg-purple-950/30"
      )}
      onClick={onClick}
    >
      {/* Indicator Line */}
      {isSelected && (
        <div className="absolute left-0 top-0 h-full w-1 bg-purple-600" />
      )}

      {/* Icon */}
      <span className={cn(
        "text-xl",
        isSelected ? "text-purple-600" : "text-slate-600 dark:text-slate-400"
      )}>
        {icon}
      </span>

      {/* Text */}
      <span className={cn(
        "text-sm font-medium",
        isSelected 
          ? "text-purple-900 dark:text-white" 
          : "text-slate-700 dark:text-slate-300"
      )}>
        {name}
      </span>
    </div>
  )
} 