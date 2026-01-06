'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  avatar: string;
}

import { useAuth } from "@/contexts/AuthContext";

export function ProfileEditor() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<ProfileData>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: "", // Bio not yet in basic Auth context
    location: "",
    avatar: user?.avatar || ""
  });

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="max-w-2xl mx-auto w-full px-2 md:px-0 text-neutral-100">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="relative">
          <span className="relative flex shrink-0 overflow-hidden rounded-full h-24 w-24 border-2 border-neutral-300 bg-neutral-800">
            <img className="aspect-square h-full w-full" alt={profile.name} src={profile.avatar} />
          </span>
          <button className="inline-flex items-center justify-center bg-neutral-900 border border-neutral-700 absolute bottom-1 right-1 rounded-full p-1.5 shadow-sm hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300">
            <Camera className="h-4 w-4 text-neutral-200" />
          </button>
        </div>
        <div className="flex-1 w-full">
          <input className="flex h-11 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-xl font-semibold text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-300 mb-2 shadow-sm" value={profile.name} onChange={e => handleChange('name', e.target.value)} placeholder="Your Name" />
          <input className="flex h-10 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-sm" value={profile.location} onChange={e => handleChange('location', e.target.value)} placeholder="Location" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="text-sm font-medium text-neutral-200 mb-1 block">Email</label>
          <Input value={profile.email} onChange={e => handleChange('email', e.target.value)} type="email" className="bg-neutral-900 border border-neutral-700 text-neutral-100 placeholder:text-neutral-400 focus:ring-purple-300" />
        </div>

        <div>
          <label className="text-sm font-medium text-neutral-200 mb-1 block">Phone</label>
          <Input value={profile.phone} onChange={e => handleChange('phone', e.target.value)} type="tel" className="bg-neutral-900 border border-neutral-700 text-neutral-100 placeholder:text-neutral-400 focus:ring-purple-300" />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-neutral-200 mb-1 block">Bio</label>
          <Textarea value={profile.bio} onChange={e => handleChange('bio', e.target.value)} rows={3} className="bg-neutral-900 border border-neutral-700 text-neutral-100 placeholder:text-neutral-400 focus:ring-purple-300" />
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg shadow-md transition-all">Save Changes</Button>
      </div>
    </section>
  );
} 