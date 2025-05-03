"use client";

import { User, Mail, Phone, MapPin, Calendar, Star, LogOut, Edit, ShieldCheck, Bell, Wallet, Users, Gift } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ClientProfile() {
  // Mock data for now
  const user = {
    name: 'Sonu',
    email: 'sonu@email.com',
    phone: '+91 98765 43210',
    location: 'Chennai, TN',
    joined: 'Jan 2024',
    avatar: '/images/profile-sonu.jpg',
    skillCoins: 2500,
    wallet: 1300,
    referrals: 8,
    bookings: 12,
    notifications: 4,
    verified: true,
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#18192A] to-[#23243a]">
      {/* App Bar Header */}
      <header className="fixed top-0 left-0 w-full z-30 bg-gradient-to-br from-[#2D1B69] via-[#18181b] to-[#23243a] border-b border-white/10 shadow-sm">
        <div className="container mx-auto px-4 flex items-center h-16 md:h-20">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#23243a]/70 text-purple-400 text-base font-semibold transition-colors"
            onClick={() => window.history.back()}
            aria-label="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="ml-3 text-2xl md:text-3xl font-bold text-white tracking-tight select-none">My Profile</span>
        </div>
      </header>
      <div className="h-16 md:h-20" /> {/* Spacer for fixed header */}

      {/* Floating Profile Card (Glassy Bottom Sheet Style) */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-2">
        <div className="relative w-full max-w-xl mx-auto mt-8 md:mt-16">
          <div className="relative z-10 rounded-3xl bg-[#1a1a2a]/90 border border-white/10 shadow-2xl backdrop-blur-xl px-6 py-8 md:px-10 md:py-10 flex flex-col items-center gap-6">
            {/* Avatar and Verified Badge */}
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-md" />
              <Image src={user.avatar} alt="Profile" width={104} height={104} className="rounded-full border-4 border-white/20 object-cover shadow-lg" />
              {user.verified && (
                <span className="absolute bottom-2 right-2 bg-green-600 text-white rounded-full p-1 shadow-lg border-2 border-[#1a1a2a]">
                  <ShieldCheck className="w-5 h-5" />
                </span>
              )}
            </div>
            {/* Name and Edit */}
            <div className="flex flex-col items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{user.name}</h1>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link 
                  href="/client/profile/edit"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 text-sm font-medium transition-colors flex items-center gap-2 border border-white/10"
                >
                  <Edit className="w-4 h-4" /> Edit Profile
                </Link>
                <Link 
                  href="/client/profile/kyc"
                  className="px-4 py-2 rounded-xl bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm font-medium transition-colors flex items-center gap-2 border border-green-500/20"
                >
                  <ShieldCheck className="w-4 h-4" /> Verify KYC
                </Link>
              </div>
            </div>
            {/* Email, Phone, Location, Joined */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-white/60 text-sm mb-2">
              <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {user.email}</span>
              <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> {user.phone}</span>
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {user.location}</span>
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Joined {user.joined}</span>
            </div>
            {/* Quick Stats Row */}
            <div className="w-full flex flex-col md:flex-row gap-4 mt-2">
              <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-[#23243a] to-[#1a1a2a]/80 border border-yellow-900/30 rounded-2xl py-6 shadow">
                <Star className="w-7 h-7 text-yellow-400 mb-1" />
                <div className="text-xl font-bold text-yellow-200">{user.skillCoins}</div>
                <div className="text-xs text-yellow-400 tracking-wide">Skill Coins</div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-[#23243a] to-[#1a1a2a]/80 border border-purple-900/30 rounded-2xl py-6 shadow">
                <Wallet className="w-7 h-7 text-purple-400 mb-1" />
                <div className="text-xl font-bold text-purple-200">₹{user.wallet}</div>
                <div className="text-xs text-purple-400 tracking-wide">Wallet</div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-[#23243a] to-[#1a1a2a]/80 border border-blue-900/30 rounded-2xl py-6 shadow">
                <Users className="w-7 h-7 text-blue-400 mb-1" />
                <div className="text-xl font-bold text-blue-200">{user.referrals}</div>
                <div className="text-xs text-blue-400 tracking-wide">Referrals</div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-[#23243a] to-[#1a1a2a]/80 border border-green-900/30 rounded-2xl py-6 shadow">
                <Gift className="w-7 h-7 text-green-400 mb-1" />
                <div className="text-xl font-bold text-green-200">{user.bookings}</div>
                <div className="text-xs text-green-400 tracking-wide">Bookings</div>
              </div>
            </div>
          </div>
        </div>
      </main>


    </div>
  );
}
