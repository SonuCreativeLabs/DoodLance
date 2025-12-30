"use client"

import { MapPin, Star, Clock, Calendar, ChevronDown, ChevronRight, ArrowRight, Copy, Check, Zap, Shield, Users, Award, TrendingUp, Heart, MessageCircle, Filter, X, Wallet, Bell, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import ClientLayout from '@/components/layouts/client-layout'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ServiceCard from '@/components/client/services/service-card'
import { useState, useEffect } from 'react'
import { MapModal } from '@/components/freelancer/jobs/MapModal'
import { useNearbyProfessionals } from '@/contexts/NearbyProfessionalsContext'
import { usePopularServices } from '@/contexts/PopularServicesContext'

// Search functionality will be implemented with real data

export default function ClientHome() {
  const router = useRouter();
  const { professionals } = useNearbyProfessionals();
  const { popularServices } = usePopularServices();
  const [searchQuery, setSearchQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("Search for services...");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ city: "Getting location...", state: "" });
  const [showSidebar, setShowSidebar] = useState(false);
  const [userName, setUserName] = useState("Guest");
  const [userAvatar, setUserAvatar] = useState("/images/profile-placeholder.jpg"); // Fallback
  const [notificationCount, setNotificationCount] = useState(0);

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Dynamic import to avoid SSR issues if any, or just standard fetch
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Try to get profile if it exists, or just use metadata
          setUserName(user.user_metadata?.full_name || user.user_metadata?.name || "Client");
          setUserAvatar(user.user_metadata?.avatar_url || user.user_metadata?.picture || "/images/profile-placeholder.jpg");
          // For now, notification count is 0 as we don't have a real notification system yet
          setNotificationCount(0);
        }
      } catch (e) {
        console.error("Error fetching user", e);
      }
    };
    fetchUser();
  }, []);

  // Function to reverse geocode coordinates to address
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      // Added neighborhood and locality to types
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&types=neighborhood,locality,place,region`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        // Parse features
        const neighborhood = data.features.find((f: any) => f.place_type.includes('neighborhood'));
        const locality = data.features.find((f: any) => f.place_type.includes('locality'));
        const place = data.features.find((f: any) => f.place_type.includes('place'));
        const region = data.features.find((f: any) => f.place_type.includes('region'));

        // Prioritize: Neighborhood -> Locality -> Place (City)
        const areaName = neighborhood?.text || locality?.text || place?.text || "Unknown Location";
        // Use City (place) for the second part, fallback to Region (state) if city not found
        const cityName = place?.text || region?.text || "";

        return {
          city: areaName,
          state: cityName
        };
      }
      return { city: "Location not found", state: "" };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return { city: "Error", state: "" };
    }
  };

  useEffect(() => {
    const handleGeolocation = async () => {
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by your browser');
        setCurrentLocation({ city: "Anna Nagar", state: "Chennai" });
        return;
      }

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          });
        });

        const { latitude, longitude } = position.coords;
        const locationData = await reverseGeocode(latitude, longitude);
        setCurrentLocation(locationData);
      } catch (error) {
        console.warn('Geolocation error:', error);
        setCurrentLocation({ city: "Anna Nagar", state: "Chennai" });
      }
    };

    handleGeolocation();
  }, []);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (e) {
      console.error('Failed to copy coupon code', e);
    }
  };

  // Search placeholder text
  useEffect(() => {
    // Future implementation for dynamic search suggestions
  }, []);

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLocationPicker(false);
        setShowSidebar(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // ... (skipping unimplemented handlers)

  return (
    <ClientLayout>
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-30 bg-gradient-to-br from-[#6B46C1] via-[#4C1D95] to-[#2D1B69]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative group">
              <div className="relative flex items-center justify-center">
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors relative"
                  onClick={() => setShowSidebar(true)}
                  aria-label="Open profile menu"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <img
                    src={userAvatar}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover ring-2 ring-white/10 group-hover:ring-purple-400/50 transition-all duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest';
                    }}
                  />

                </button>
              </div>
              {/* Sidebar & Backdrop */}
              {/* Sidebar & Backdrop - always mounted for animation */}
              <div>
                {/* Backdrop */}
                <div
                  className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${showSidebar ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                  onClick={() => setShowSidebar(false)}
                  aria-label="Close sidebar"
                />
                {/* Sidebar */}
                <div className={`fixed top-0 left-0 z-50 h-full w-64 sm:w-72 bg-[#18181b] border-r border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <img src={userAvatar} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-purple-400"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest';
                        }}
                      />
                      <span className="text-white font-medium">{userName}</span>
                    </div>
                    <button
                      className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                      onClick={() => setShowSidebar(false)}
                      aria-label="Close sidebar"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {/* ... sidebar content ... */}
                  <div className="flex flex-col py-4 flex-1 gap-1">
                    {/* My Profile */}
                    <button
                      className="flex items-center gap-3 px-6 py-3 text-left text-white/90 hover:bg-white/10 hover:text-white transition-colors"
                      onClick={() => router.push('/client/profile')}
                    >
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" /><path d="M5.5 21a8.38 8.38 0 0 1 13 0" /></svg>
                      My Profile
                    </button>
                    {/* Skill Coins */}
                    <button
                      className="flex items-center gap-3 px-6 py-2 text-left text-white/90 hover:bg-white/10 hover:text-white transition-colors"
                      onClick={() => router.push('/client/wallet')}
                    >
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="7.5,4.27 12,6.11 16.5,4.27" /><polyline points="7.5,9.73 12,11.57 16.5,9.73" /><polyline points="12,2.27 12,11.57" /></svg>
                      <span className="text-white/90">Skill Coins</span>
                    </button>
                    {/* My Bookings */}
                    <button
                      className="flex items-center gap-3 px-6 py-3 text-left text-white/90 hover:bg-white/10 hover:text-white transition-colors"
                      onClick={() => router.push('/client/bookings')}
                    >
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></svg>
                      My Bookings
                    </button>
                    {/* My Referrals */}
                    <button
                      className="flex items-center gap-3 px-6 py-3 text-left text-white/90 hover:bg-white/10 hover:text-white transition-colors"
                      onClick={() => router.push('/client/referrals')}
                    >
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                      My Referrals
                    </button>
                    {/* Notifications */}
                    <button
                      className="flex items-center gap-3 px-6 py-3 text-left text-white/90 hover:bg-white/10 hover:text-white transition-colors"
                      onClick={() => router.push('/client/notifications')}
                    >
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                      Notifications
                    </button>
                    {/* Support */}
                    <button
                      className="flex items-center gap-3 px-6 py-3 text-left text-white/90 hover:bg-white/10 hover:text-white transition-colors"
                      onClick={() => router.push('/client/support')}
                    >
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 2" /></svg>
                      Support
                    </button>

                    <div className="border-t border-white/10 my-2" />
                    {/* Logout at the bottom */}
                    <button className="flex items-center gap-3 px-6 py-3 text-left text-red-400 hover:bg-white/10 hover:text-red-300 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7" /><path d="M3 21V3" /></svg>
                      Logout
                    </button>
                  </div>
                  {/* Hamburger icon at bottom - now darker for visibility */}
                  <div className="flex justify-center pb-6">
                    <div className="flex flex-col items-center gap-1">
                      <span className="block w-7 h-1 bg-white/60 rounded"></span>
                      <span className="block w-7 h-1 bg-white/60 rounded"></span>
                      <span className="block w-7 h-1 bg-white/60 rounded"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Welcome & Location - RESTORED */}
            <div className="flex flex-col">
              <span className="text-base sm:text-lg text-white/95 font-bold drop-shadow-sm">Good Morning, {userName}</span>
              <button
                onClick={() => setShowLocationPicker(true)}
                className="flex items-center gap-0.5 sm:gap-1 text-white font-semibold text-xs sm:text-sm hover:text-white/80 transition-colors"
                title="Change Location"
              >
                {currentLocation.city}{currentLocation.state ? `, ${currentLocation.state}` : ''}
                <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/80" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative">
              <Link href="/client/wallet" className="relative group" aria-label="Wallet">
                <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </span>
              </Link>
            </div>
            <div className="relative">
              <Link href="/client/notifications" className="relative group" aria-label="Notifications">
                <span className="relative inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  {notificationCount > 0 && (
                    <span className="pointer-events-none absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full flex items-center justify-center shadow-lg shadow-purple-600/20 z-10">
                      <span className="text-[9px] sm:text-[10px] font-medium text-white leading-none">{notificationCount}</span>
                    </span>
                  )}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with top padding for fixed header */}
      <div>
        {/* Hero Banner */}
        <div className="relative pb-4 h-auto overflow-hidden rounded-b-[2.5rem] shadow-xl" style={{ minHeight: 'auto' }}>
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6B46C1] via-[#4C1D95] to-[#2D1B69] rounded-b-[2.5rem] overflow-hidden">
            {/* Cover Image - Removed */}
          </div>

          {/* Hero Content */}
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Adjusted space for optimal position */}
            <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-28">
              <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-serif text-white mb-2 text-center drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
                  Practice like a pro, with a pro
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-white/90 mb-3 sm:mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                  Your shortcut to better cricket starts here
                </p>
              </div>

              {/* Modern Search Bar */}
              <div className="max-w-3xl mx-auto mb-4 sm:mb-6 px-2 sm:px-0">
                <div className="relative w-full">
                  <Input
                    type="text"
                    placeholder={searchQuery ? `Find services in Chennai...` : placeholder || `Find services in Chennai...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/20 border border-white/40 text-white placeholder-white/80 rounded-2xl py-3 sm:py-4 pl-10 sm:pl-12 pr-4 text-sm sm:text-base focus:outline-none focus:border-purple-400 transition-all shadow-lg drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
                    <Sparkles className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4 bg-[#111111] mb-8 relative z-0">
          {/* Service Categories */}
          <section className="mb-4 relative z-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white tracking-wide text-left">Popular Services in your area</h2>
              <Link href="/client/services" className="text-white/80 hover:text-white text-xs font-medium flex items-center transition-colors">
                View All
                <ChevronRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
            <div className="relative -mx-4">
              <div className="overflow-x-auto scrollbar-hide px-4 pr-8">
                <div className="flex space-x-4 pb-2">
                  {popularServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      id={service.id}
                      title={service.title}
                      image={service.image}
                      icon={service.icon}
                      providerCount={service.providerCount}
                      className="w-[140px] flex-shrink-0"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Add scrollbar-hide utility to tailwind config */}
          <style jsx global>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>

          {/* Top Rated Experts Section */}
          <section className="mb-4 relative z-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white tracking-wide text-left">
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-transparent bg-clip-text">Top Rated</span>
                {" "}Experts
              </h2>
              <Link href="/client/nearby" className="text-white/80 hover:text-white text-xs font-medium flex items-center transition-colors">
                View All
                <ChevronRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
            <div className="relative">
              <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 pr-8">
                <div className="flex gap-3 pb-2">
                  {professionals.length > 0 ? (
                    professionals
                      .sort((a, b) => {
                        // First sort by rating
                        if (b.rating !== a.rating) {
                          return b.rating - a.rating;
                        }
                        // If ratings are equal, sort by number of reviews
                        return b.reviews - a.reviews;
                      })
                      .slice(0, 5) // Only take top 5
                      .map((expert) => (
                        <button
                          key={expert.id}
                          onClick={() => router.push(`/client/freelancer/${expert.id}`)}
                          className="flex-shrink-0 w-[130px] cursor-pointer"
                        >
                          {/* Outer Layer Card */}
                          <div className="relative group">
                            {/* Card Background */}
                            <div className="absolute inset-0 rounded-2xl border border-purple-400/10 transition-all duration-300 group-hover:border-purple-400/20"></div>

                            {/* Rating Badge - positioned at top corner of card */}
                            <div className="absolute top-2 left-2 z-30 bg-gradient-to-r from-yellow-400 to-yellow-600 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                              <Star className="w-2.5 h-2.5 text-black fill-current" />
                              <span className="text-black text-[10px] font-bold">{expert.rating}</span>
                            </div>

                            {/* Card Content */}
                            <div className="relative p-2.5">
                              <div className="relative group">
                                {/* Rating Badge - moved to outer card */}

                                {/* Profile Picture */}
                                <div className="relative w-[80px] h-[80px] mx-auto">
                                  <img
                                    src={expert.image}
                                    alt={expert.name}
                                    className="w-full h-full rounded-full border-2 border-purple-200/50 relative z-10 object-cover"
                                  />
                                </div>

                                {/* Expert Info with Reduced Spacing */}
                                <div className="mt-1.5 text-center">
                                  <h3 className="font-semibold text-white text-xs leading-tight truncate">{expert.name}</h3>
                                  <p className="text-purple-400 text-[10px] font-medium truncate mt-0.5">{expert.cricketRole || expert.service}</p>
                                  <p className="text-white/70 text-[9px] mt-0.5 truncate">
                                    {expert.location}
                                  </p>
                                  <p className="text-white/50 text-[9px] font-medium mt-0.5 truncate">
                                    {expert.distance ? (
                                      <>
                                        {expert.distance < 1
                                          ? `${(expert.distance * 1000).toFixed(0)}m`
                                          : `${expert.distance.toFixed(1)}km`} away
                                      </>
                                    ) : ''}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))
                  ) : (
                    <div className="w-full py-8 text-center mx-auto col-span-full">
                      <p className="text-white/60 text-sm">No experts found nearby</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Why DoodLance Section */}
          <section className="mb-4 relative z-0">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-white tracking-wide text-left">Why DoodLance?</h2>
            </div>
            <div className="flex flex-row justify-center gap-2 md:gap-3 pb-4">
              {/* Local Delivery */}
              <div className="flex flex-col items-center w-24 md:w-28 py-2">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <MapPin className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm md:text-base text-white">Fast Service</div>
                  <div className="text-[10px] md:text-xs text-white/80 leading-tight">In Your<br />Neighborhood</div>
                </div>
              </div>
              {/* Smart Matching */}
              <div className="flex flex-col items-center w-24 md:w-28 py-2">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  {/* AI-related icon - Sparkles */}
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm md:text-base text-white">AI-Powered</div>
                  <div className="text-[10px] md:text-xs text-white/80 leading-tight">Find the<br />Right Expert</div>
                </div>
              </div>
              {/* Instant Booking */}
              <div className="flex flex-col items-center w-24 md:w-28 py-2">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm md:text-base text-white whitespace-nowrap">Book Instantly</div>
                  <div className="text-[10px] md:text-xs text-white/80 leading-tight whitespace-nowrap">Real-Time<br />Availability</div>
                </div>
              </div>
            </div>
          </section>

          {/* Coupon Banner */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-4 relative z-0"
          >
            <div className="mb-4">
              <h2 className="text-base font-semibold text-white tracking-wide text-left" data-component-name="ClientHome">Exclusive Offers</h2>
            </div>
            <div className="relative -mx-4">
              <div className="overflow-x-auto scrollbar-hide px-4 pr-8">
                <div className="flex gap-3">
                  {/* First Coupon */}
                  <div className="flex-shrink-0 w-[300px] min-h-[140px] rounded-2xl p-3 border border-dashed border-white/15 bg-white/5 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between">
                    {/* Accent stripe */}
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-purple-400/80 to-purple-600/80" />
                    <div className="flex items-start gap-3">
                      {/* Icon circle (subtle) */}
                      <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10">
                        <Calendar className="w-6 h-6 text-purple-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-full border border-white/15 text-white/80">Limited time</span>
                        </div>
                        <h3 className="text-white text-base font-semibold leading-snug">20% off first booking</h3>
                      </div>
                      {/* Discount badge */}
                      <div className="ml-2">
                        <div className="rounded-xl px-2.5 py-1 bg-purple-500/20 text-purple-200 border border-purple-300/30 text-sm font-bold">20%</div>
                      </div>
                    </div>
                    {/* Code and button section at bottom */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] px-2 py-1 rounded-md border border-white/15 bg-white/5 text-white/90">WELCOME20</span>
                        <button
                          onClick={() => handleCopyCode('WELCOME20')}
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-full border border-white/20 text-white/90 hover:bg-white/10 text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0"
                          aria-label="Copy coupon code WELCOME20"
                        >
                          {copiedCode === 'WELCOME20' ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <span className="text-[11px] text-white/50 whitespace-nowrap">Ends soon</span>
                    </div>
                    {/* Perforated divider at bottom */}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-[10px] w-[10px] rounded-full bg-[#111111] border border-white/10 -ml-5" />
                      <div className="flex-1 border-t border-dashed border-white/15" />
                      <div className="h-[10px] w-[10px] rounded-full bg-[#111111] border border-white/10 -mr-5" />
                    </div>
                  </div>

                  {/* Second Coupon */}
                  <div className="flex-shrink-0 w-[300px] min-h-[140px] rounded-2xl p-3 border border-dashed border-white/15 bg-white/5 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-400/80 to-blue-600/80" />
                    <div className="flex items-start gap-3">
                      <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10">
                        <Star className="w-6 h-6 text-blue-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-full border border-white/15 text-white/80">Weekend special</span>
                          <span className="text-[11px] text-white/50">• All services</span>
                        </div>
                        <h3 className="text-white text-base font-semibold leading-snug">15% off weekend bookings</h3>
                      </div>
                      <div className="ml-2">
                        <div className="rounded-xl px-2.5 py-1 bg-blue-500/20 text-blue-200 border border-blue-300/30 text-sm font-bold">15%</div>
                      </div>
                    </div>
                    {/* Code and button section at bottom */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] px-2 py-1 rounded-md border border-white/15 bg-white/5 text-white/90">WEEKEND15</span>
                        <button
                          onClick={() => handleCopyCode('WEEKEND15')}
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-full border border-white/20 text-white/90 hover:bg-white/10 text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0"
                          aria-label="Copy coupon code WEEKEND15"
                        >
                          {copiedCode === 'WEEKEND15' ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <span className="text-[11px] text-white/50 whitespace-nowrap">Valid Sat-Sun</span>
                    </div>
                    {/* Perforated divider at bottom */}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-[10px] w-[10px] rounded-full bg-[#111111] border border-white/10 -ml-5" />
                      <div className="flex-1 border-t border-dashed border-white/15" />
                      <div className="h-[10px] w-[10px] rounded-full bg-[#111111] border border-white/10 -mr-5" />
                    </div>
                  </div>

                  {/* Third Coupon */}
                  <div className="flex-shrink-0 w-[300px] min-h-[140px] rounded-2xl p-3 border border-dashed border-white/15 bg-white/5 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-400/80 to-emerald-600/80" />
                    <div className="flex items-start gap-3">
                      <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10">
                        <svg className="w-6 h-6 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18M3 12h18M3 17h18" /></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-full border border-white/15 text-white/80">Bulk booking</span>
                          <span className="text-[11px] text-white/50">• 3+ services</span>
                        </div>
                        <h3 className="text-white text-base font-semibold leading-snug">25% off bulk orders</h3>
                      </div>
                      <div className="ml-2">
                        <div className="rounded-xl px-2.5 py-1 bg-emerald-500/20 text-emerald-200 border border-emerald-300/30 text-sm font-bold">25%</div>
                      </div>
                    </div>
                    {/* Code and button section at bottom */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] px-2 py-1 rounded-md border border-white/15 bg-white/5 text-white/90">BULK25</span>
                        <button
                          onClick={() => handleCopyCode('BULK25')}
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-full border border-white/20 text-white/90 hover:bg-white/10 text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0"
                          aria-label="Copy coupon code BULK25"
                        >
                          {copiedCode === 'BULK25' ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <span className="text-[11px] text-white/50 whitespace-nowrap">Limited time</span>
                    </div>
                    {/* Perforated divider at bottom */}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-[10px] w-[10px] rounded-full bg-[#111111] border border-white/10 -ml-5" />
                      <div className="flex-1 border-t border-dashed border-white/15" />
                      <div className="h-[10px] w-[10px] rounded-full bg-[#111111] border border-white/10 -mr-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
      <MapModal
        isOpen={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        location={`${currentLocation.city}${currentLocation.state ? `, ${currentLocation.state}` : ''}`}
      />
    </ClientLayout>
  );
}