"use client";

import React, { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Star, Edit, ShieldCheck, Bell } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useNavbar } from '@/contexts/NavbarContext';
import { useAuth } from '@/contexts/AuthContext';

export default function ClientProfile() {
  const { setNavbarVisibility } = useNavbar();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setNavbarVisibility(false);
    return () => setNavbarVisibility(true);
  }, [setNavbarVisibility]);

  useEffect(() => {
    // Simulate loading user data
    if (user) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-30 bg-gradient-to-br from-[#6B46C1] via-[#4C1D95] to-[#2D1B69] border-b border-white/10 shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center relative">
          <Link href="/client" aria-label="Back to Dashboard" className="relative z-10">
            <button className="flex items-center justify-center text-white/80 hover:text-white/100 p-2 -ml-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400/40" aria-label="Back">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
          </Link>

          {/* Absolute centered title */}
          <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
            <span className="text-lg font-bold text-white">My Profile</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-8 px-4 max-w-2xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-white/50 text-sm">Loading profile...</div>
          </div>
        ) : !user ? (
          <div className="flex flex-col items-center justify-center py-12">
            <User className="w-12 h-12 text-white/20 mb-4" />
            <div className="text-white/50 text-sm">Please log in to view your profile</div>
            <Link href="/auth/login" className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
              Log In
            </Link>
          </div>
        ) : (
          <>
            {/* Incomplete Profile Warning */}
            {((user.name && user.name.toLowerCase() === 'new user') || !user.phone || !user.avatar) && (
              <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-full">
                  <Edit className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-yellow-500 font-medium text-sm">Complete your profile</h3>
                  <p className="text-white/60 text-xs mt-0.5">Please update your name, phone, and profile picture to continue.</p>
                </div>
                <Link
                  href="/client/profile/edit"
                  className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 text-xs font-medium rounded-lg transition-colors"
                >
                  Edit Profile
                </Link>
              </div>
            )}

            {/* Profile Card */}
            <div className="bg-[#18181b] rounded-2xl p-6 border border-white/10 shadow-lg relative">
              {/* Edit Icon in Top Right */}
              <Link
                href="/client/profile/edit"
                className="absolute top-4 right-4 p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-full transition-colors"
              >
                <Edit className="w-4 h-4" />
              </Link>
              {/* Avatar Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <Image
                    src={user.avatar || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect width="120" height="120" fill="%23333"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="48" fill="%23999"%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E'}
                    alt="Profile"
                    width={100}
                    height={100}
                    className="rounded-full border-2 border-purple-400/50 object-cover shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect width="120" height="120" fill="%23333"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="48" fill="%23999"%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  {(user as any)?.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-[#18181b]">
                      <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <h1 className="text-2xl font-bold text-white mb-2">{user.name || 'Your Name'}</h1>


              </div>

              {/* Contact Information */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl border border-white/5">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white/60 text-xs">Email</p>
                    <p className="text-white">{user.email || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl border border-white/5">
                  <Phone className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white/60 text-xs">Phone</p>
                    <p className="text-white">{user.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl border border-white/5">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white/60 text-xs">Location</p>
                    <p className="text-white">{(user as any)?.location || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl border border-white/5">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white/60 text-xs">Member since</p>
                    <p className="text-white">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Not available'}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
