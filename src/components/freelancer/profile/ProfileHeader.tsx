import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Edit2, Camera } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  title: string;
  rating: number;
  reviewCount: number;
  location: string;
  online: boolean;
  skills: string[];
  avatarUrl?: string;
  coverImageUrl?: string;
}

export function ProfileHeader({
  name,
  title,
  rating,
  reviewCount,
  location,
  online,
  skills,
  avatarUrl = "/placeholder-user.jpg",
  coverImageUrl = "/placeholder-cover.jpg"
}: ProfileHeaderProps) {
  return (
    <div className="relative w-full rounded-xl overflow-hidden">
      {/* Cover Photo */}
      <div className="relative h-48 bg-gradient-to-r from-purple-900 to-purple-700">
        <Image
          src={coverImageUrl}
          alt="Cover photo"
          fill
          className="object-cover mix-blend-overlay opacity-70"
          priority
        />
        <div className="absolute bottom-4 right-4">
          <Button variant="outline" size="sm" className="bg-black/30 backdrop-blur-sm border-white/20 text-white hover:bg-black/40">
            <Camera className="h-4 w-4 mr-2" />
            Edit Cover
          </Button>
        </div>
      </div>
      
      {/* Profile Info */}
      <div className="relative px-6 pb-6 pt-16 bg-gradient-to-b from-transparent to-[#111111] -mt-16">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="relative -mt-16 group">
            <div className="relative w-32 h-32 rounded-full border-4 border-[#1E1E1E] overflow-hidden">
              <Avatar className="w-full h-full">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-600 to-purple-500">
                  {name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="default" size="icon" className="h-8 w-8 rounded-full bg-white hover:bg-white/90">
                  <Camera className="h-4 w-4 text-[#1E1E1E]" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Profile Details */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">{name}</h1>
                <p className="text-purple-400">{title}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-purple-400 text-purple-400' : 'text-gray-500'}`}
                  />
                ))}
                <span className="ml-1 text-white/70">
                  {rating.toFixed(1)} ({reviewCount} reviews)
                </span>
              </div>
              
              <div className="flex items-center text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></span>
                {online ? 'Online' : 'Offline'}
              </div>
              
              <div className="text-white/70">
                {location}
              </div>
            </div>
            
            {/* Skills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {skills.slice(0, 5).map((skill, i) => (
                <Badge key={i} variant="secondary" className="bg-white/5 text-white/80 border-white/10 hover:bg-white/10">
                  {skill}
                </Badge>
              ))}
              {skills.length > 5 && (
                <Badge variant="outline" className="text-white/60 border-white/10">
                  +{skills.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
