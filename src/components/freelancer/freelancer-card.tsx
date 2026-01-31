"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, CheckCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

import { useRouter } from 'next/navigation'

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
  const router = useRouter()

  const handleHireClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/client/freelancer/${id}`);
  };
  return (
    <Card className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-200 border border-purple-100/50 hover:border-purple-300 relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-purple-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="p-6 relative">
        <div className="flex items-start gap-4">
          {/* Avatar and Basic Info */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20 blur-md group-hover:opacity-30 transition-opacity duration-300"></div>
            <Avatar className="relative z-10 border-2 border-purple-200 w-12 h-12 group-hover:border-purple-300 transition-colors duration-300">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600">{name.charAt(0)}</AvatarFallback>
            </Avatar>
            {isVerified && (
              <CheckCircle className="absolute -bottom-1 -right-1 w-5 h-5 text-purple-500 bg-white rounded-full shadow-md" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-gray-900 group-hover:text-purple-900 transition-colors duration-300">{name}</h3>
              <span className="font-semibold bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 bg-clip-text text-transparent">{rate}</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-purple-600 mt-1">
              <Star className="w-4 h-4 fill-purple-500 text-purple-500" />
              <span className="font-medium">{rating}</span>
              <span className="text-gray-600">({reviews} reviews)</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="text-xs bg-gradient-to-r from-purple-50 to-purple-100/80 text-purple-700 border border-purple-200 group-hover:border-purple-300 transition-colors duration-300"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 mt-4 line-clamp-2 group-hover:text-gray-800 transition-colors duration-300">
          {description}
        </p>

        {/* Location and Availability */}
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{location}</span>
          <Badge
            variant={availability.includes("Now") ? "success" : "secondary"}
            className={cn(
              availability.includes("Now")
                ? "bg-gradient-to-r from-green-50 to-green-100/80 text-green-700 border border-green-200 group-hover:border-green-300"
                : "bg-gradient-to-r from-purple-50 to-purple-100/80 text-purple-700 border border-purple-200 group-hover:border-purple-300",
              "transition-colors duration-300"
            )}
          >
            {availability}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <Button
            className="flex-1 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-600 border border-purple-200"
            variant="outline"
          >
            Message
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleHireClick}
          >
            Hire Now
          </Button>
        </div>
      </div>
    </Card>
  )
}