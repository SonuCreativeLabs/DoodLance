'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Edit2, Camera, Upload, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

// CoverImage component defined outside the ProfileHeader component
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
  name = "Sathish Sonu",
  title = "Cricketer & AI Engineer",
  rating = 4.8,
  reviewCount = 42,
  location = "Chennai, India",
  online = true,
  skills = ["Cricket", "Cycling", "Off Spin", "Batting", "Vibe Coder", "Prompt Engg", "AI Agent Builder"],
  avatarUrl = "/images/profile-sonu.jpg",
  coverImageUrl = "/images/cover-pic.JPG"
}: ProfileHeaderProps) {
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
    <div className="relative w-full bg-[#111111]">
      {/* Cover Photo */}
      <div className="group relative h-48 md:h-64 w-full bg-gradient-to-r from-purple-900 to-purple-700">
        {/* Switch to Client Button - Top-right of cover */}
        <div className="absolute top-4 right-4 z-10">
          <Button 
            variant="default"
            size="sm"
            onClick={() => router.push('/client')}
            className="group relative h-8 px-3 text-xs rounded-full overflow-hidden bg-gradient-to-r from-[#1A1A1A] via-[#0F0F0F] to-[#1A1A1A] text-white flex items-center gap-1.5 font-medium transition-all duration-300 border border-white/10 hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:scale-[1.02]"
          >
            <RefreshCw className="h-3.5 w-3.5 text-purple-400 transition-transform duration-300 group-hover:rotate-180" />
            <span>Switch to Client</span>
          </Button>
        </div>
        <div className="absolute inset-0 w-full h-full">
          <CoverImage />
        </div>
        
        {/* Edit Cover Button */}
        <div className="absolute bottom-4 right-4">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleEditClick}
              disabled={isUploading}
              className="h-10 w-10 rounded-full bg-white hover:bg-white/90 p-0 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
            >
              {isUploading ? (
                <Loader2 className="h-5 w-5 animate-spin text-[#1E1E1E]" />
              ) : (
                <Camera className="h-5 w-5 text-[#1E1E1E]" />
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
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="flex flex-col items-center md:flex-row md:items-end md:justify-between -mt-16 mb-4">
          {/* Profile Picture */}
          <div className="relative group">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-[#1E1E1E] overflow-hidden bg-[#111111]">
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
          

        </div>

        {/* Profile Info */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-white">{name}</h1>
          <p className="text-purple-400 mt-0.5">{title}</p>
          
          <div className="mt-2 flex flex-col items-center gap-0.5 text-sm text-white/70">
            <div>{location}</div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`}
                />
              ))}
              <span className="ml-1 font-medium text-white">{rating.toFixed(1)}</span>
              <span className="mx-1">·</span>
              <span>{reviewCount} reviews</span>
              <span className="mx-1">·</span>
              <span className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
                {online ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap justify-center gap-2 pb-6">
          {skills.map((skill, i) => (
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
  );
}
