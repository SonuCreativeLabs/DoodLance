import { cn } from '@/lib/utils'

interface ServiceCategoryProps {
  name: string
  icon: string
  color: string
  className?: string
  onClick?: () => void
}

export function ServiceCategory({
  name,
  icon,
  color,
  className,
  onClick,
}: ServiceCategoryProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center p-4 rounded-lg min-w-[100px] cursor-pointer transition-transform hover:scale-105",
        color,
        className
      )}
      onClick={onClick}
    >
      <span className="text-2xl mb-2">{icon}</span>
      <span className="text-sm font-medium">{name}</span>
    </div>
  )
} 