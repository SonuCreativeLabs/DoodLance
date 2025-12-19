"use client";

import React from "react";
import { User, Mail, Phone, MapPin, Calendar, Star, Edit, ShieldCheck, Bell } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useNavbar } from '@/contexts/NavbarContext';

export default function ClientProfile() {
  const { setNavbarVisibility } = useNavbar();

  // Mock data for now
  const user = {
    name: 'Sonu',
    email: 'sonu@email.com',
    phone: '+91 98765 43210',
    location: 'Chennai, TN',
    joined: 'Jan 2024',
    avatar: '/images/profile-sonu.jpg',
    verified: true,
  };

  React.useEffect(() => {
    setNavbarVisibility(false);
    return () => setNavbarVisibility(true);
  }, [setNavbarVisibility]);

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-30 bg-gradient-to-br from-[#6B46C1] via-[#4C1D95] to-[#2D1B69] border-b border-white/10 shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center relative">
          <Link href="/client" aria-label="Back to Dashboard" className="relative z-10">
            <button className="flex items-center justify-center text-white/80 hover:text-white/100 p-2 -ml-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400/40" aria-label="Back">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
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
                src={user.avatar}
                alt="Profile"
                width={100}
                height={100}
                className="rounded-full border-2 border-purple-400/50 object-cover shadow-lg"
              />
              {user.verified && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-[#18181b]">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">{user.name}</h1>

            {!user.verified && (
              <Link
                href="/client/profile/kyc"
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm font-medium transition-colors border border-green-500/20"
              >
                <ShieldCheck className="w-4 h-4" />
                Verify KYC
              </Link>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl border border-white/5">
              <Mail className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-white/60 text-xs">Email</p>
                <p className="text-white">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl border border-white/5">
              <Phone className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-white/60 text-xs">Phone</p>
                <p className="text-white">{user.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl border border-white/5">
              <MapPin className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-white/60 text-xs">Location</p>
                <p className="text-white">{user.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl border border-white/5">
              <Calendar className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-white/60 text-xs">Member since</p>
                <p className="text-white">{user.joined}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
