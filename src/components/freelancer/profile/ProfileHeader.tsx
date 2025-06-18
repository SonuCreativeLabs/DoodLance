'use client';

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
    <div className="relative w-full bg-[#111111]">
      {/* Cover Photo */}
      <div className="relative h-48 bg-gradient-to-r from-purple-900 to-purple-700">
        <Image
          src="/cricket-cover.jpg"
          alt="Cricket field cover photo"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Profile Info */}
      <div className="relative px-6 pb-6 bg-[#111111]">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="relative -mt-16 group sm:-mt-20">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-[#1E1E1E] overflow-hidden">
              <Avatar className="w-full h-full">
                <AvatarImage src="/images/profile-sonu.jpg" alt={name} />
                <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="default" size="icon" className="h-10 w-10 rounded-full bg-white hover:bg-white/90">
                  <Camera className="h-5 w-5 text-[#1E1E1E]" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Profile Details */}
          <div className="flex-1 mt-4 sm:mt-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Sathish Sonu</h1>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-white/60 hover:text-white hover:bg-white/10 -ml-1"
                  title="Edit profile"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <p className="text-lg text-purple-400">AI Engineer & Cricketer</p>
            </div>
            
            <div className="mt-4">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`}
                    />
                  ))}
                  <span className="ml-1 font-medium">{rating.toFixed(1)}</span>
                  <span className="mx-1">·</span>
                  <span className="text-white/60">{reviewCount} reviews</span>
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
                {['AI Engineering', 'Machine Learning', 'Off Spin', 'Batting', 'Bowling', 'Cricket Coaching']
                  .map((skill, i) => (
                    <Badge 
                      key={i} 
                      variant="secondary" 
                      className="bg-white/5 text-white/80 border-white/10 hover:bg-white/10 rounded-full"
                    >
                      {skill}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
