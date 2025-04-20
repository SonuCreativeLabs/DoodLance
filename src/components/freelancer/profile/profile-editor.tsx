'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  avatar: string;
}

export function ProfileEditor() {
  const [profile, setProfile] = useState<ProfileData>({
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    bio: "Experienced freelancer with 5+ years in plumbing and electrical work.",
    location: "Mumbai, India",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
  });

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-0 right-0 rounded-full"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1">
          <Input
            value={profile.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="text-xl font-semibold mb-2"
          />
          <Input
            value={profile.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="text-gray-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <Input
            value={profile.email}
            onChange={(e) => handleChange('email', e.target.value)}
            type="email"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <Input
            value={profile.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            type="tel"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Bio</label>
          <Textarea
            value={profile.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
} 