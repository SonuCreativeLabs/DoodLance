'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Edit2, Camera, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  coverImageUrl = "/images/cover-sonu.jpg"
}: ProfileHeaderProps) {
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Using the new cover image without shadow
  const CoverImage = () => (
    <div className="relative w-full h-full">
      <img
        src="/images/cover-pic.JPG"
        alt="Profile Cover"
        className="w-full h-full object-cover"
        onError={(e) => {
          console.error('Failed to load cover image');
          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDEyMDAgMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNkI0NkMxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5Dcmlja2V0IENvdmVyPC90ZXh0Pjwvc3ZnPg=='
        }}
      />
    </div>
  );

  const handleCoverImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    
    // Here you would typically upload the file to your server
    // For now, we'll just create a local URL for preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImage(reader.result as string);
      setIsUploading(false);
      toast.success('Cover photo updated successfully');
    };
    reader.readAsDataURL(file);
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className="relative w-full bg-[#111111] px-4">
      {/* Cover Photo */}
      <div className="max-w-6xl mx-auto mt-4">
        <div className="relative group h-48 md:h-64 bg-gradient-to-r from-purple-900 to-purple-700 rounded-t-xl overflow-hidden">
          {/* Main Image */}
          <div className="absolute inset-0 w-full h-full">
            <div className="relative w-full h-full">
              <CoverImage />
            </div>
          </div>
          
          {/* Edit Button */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleEditClick}
              disabled={isUploading}
              className="bg-black/70 hover:bg-black/80 text-white backdrop-blur-sm"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  Change Cover
                </>
              )}
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCoverImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          {/* No gradient overlay */}
        </div>
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
              <p className="text-lg text-purple-400">Cricketer & AI Engineer</p>
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
                  Chennai, India
                </div>
              </div>
              
              {/* Skills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {['Off Spin', 'Batting', 'Bowling', 'Cricket Coaching', 'AI Engineering', 'AI Agent Builder']
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
