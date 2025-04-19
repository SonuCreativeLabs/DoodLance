"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, CheckCircle } from "lucide-react"

interface FreelancerCardProps {
  id: string
  name: string
  avatar: string
  skills: string[]
  location: string
  rate: string
  rating: number
  reviews: number
  availability: string
  description: string
  isVerified: boolean
}

export default function FreelancerCard({
  id,
  name,
  avatar,
  skills,
  location,
  rate,
  rating,
  reviews,
  availability,
  description,
  isVerified,
}: FreelancerCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar and Basic Info */}
          <div className="relative">
            <img
              src={avatar}
              alt={name}
              className="w-16 h-16 rounded-full object-cover"
            />
            {isVerified && (
              <CheckCircle className="absolute -bottom-1 -right-1 w-5 h-5 text-green-500 bg-white rounded-full" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{name}</h3>
              <span className="text-[#FF8A3D] font-semibold">{rate}</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{rating}</span>
              <span>({reviews} reviews)</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
          {description}
        </p>
        
        {/* Location and Availability */}
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-muted-foreground">{location}</span>
          <Badge variant={availability.includes("Now") ? "success" : "secondary"}>
            {availability}
          </Badge>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <Button className="flex-1" variant="outline">
            Message
          </Button>
          <Button className="flex-1 bg-[#FF8A3D] hover:bg-[#ff7a24]">
            Hire Now
          </Button>
        </div>
      </div>
    </Card>
  )
} 