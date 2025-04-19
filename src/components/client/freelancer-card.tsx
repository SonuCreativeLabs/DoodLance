import { MapPin, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FreelancerCardProps {
  id: number
  name: string
  service: string
  rating: number
  reviews: number
  image: string
  location: string
  className?: string
  onHire?: (id: number) => void
}

export function FreelancerCard({
  id,
  name,
  service,
  rating,
  reviews,
  image,
  location,
  className,
  onHire,
}: FreelancerCardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-start space-x-4">
        <img
          src={image}
          alt={name}
          className="w-16 h-16 rounded-full border-2 border-primary"
        />
        <div className="flex-1">
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{service}</p>
          <div className="flex items-center mt-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="ml-1 text-sm">{rating}</span>
            <span className="text-sm text-muted-foreground ml-2">
              ({reviews} reviews)
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {location}
          </div>
          {onHire && (
            <Button
              size="sm"
              className="mt-4 w-full"
              onClick={() => onHire(id)}
            >
              Hire Now
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 