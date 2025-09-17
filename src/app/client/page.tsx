"use client"

import { Search, MapPin, Star, Clock, Calendar, User, Briefcase, GraduationCap, ChevronRight, Bell, X, Brain, Cpu, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import ClientLayout from '@/components/layouts/client-layout'
import { FreelancerCard } from '@/components/client/freelancer-card'
import { ServiceCategory } from '@/components/client/service-category'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation' // Ensure correct import for Next.js 13+ app directory
import { professionals } from './nearby/mockData'
import Image from 'next/image'
import ServiceCard from '@/components/client/services/service-card'
import { popularServices } from '@/data/services'

const AnimatedCard = ({ icon, delay }: { icon: React.ReactNode; delay: number }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{
      duration: 0.5,
      delay,
      repeat: Infinity,
      repeatType: "reverse",
      repeatDelay: 2
    }}
    className="bg-white rounded-xl p-4 shadow-lg"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-600">
        {icon}
      </div>
      <div className="space-y-2">
        <div className="h-2 w-20 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-2 w-16 bg-gray-100 rounded animate-pulse"></div>
      </div>
    </div>
  </motion.div>
)

import { useState, useEffect, useRef } from "react";

const mockSearches = [
  { id: 1, text: "Plumber near me", count: 2450 },
  { id: 2, text: "Math tutor", count: 1830 },
  { id: 3, text: "House cleaning service", count: 1560 },
  { id: 4, text: "AC repair and service", count: 1240 },
  { id: 5, text: "Pet grooming", count: 980 },
];

const searchExamples = [
  "Bowler for cricket practice in Chepauk",
  "Sidearm specialist for batting practice in T Nagar",
  "Cricket coach for beginners in Mylapore",
  "Batsman training sessions in Adyar",
  "Personal cricket coach in Royapettah",
  "Cricket physio for injury recovery in Nungambakkam",
  "Sidearm thrower for net practice in Kodambakkam",
  "Cricket analyst for match analysis in West Mambalam",
  "Sports conditioning trainer in Alwarpet",
  "Cricket umpire for local matches in Besant Nagar",
  "Cricket content creator in Velachery",
  "Cricket scorer for tournaments in Chennai",
  "Cricket photo videography for matches in ECR",
  "Sidearm thrower specialist for cricket practice"
];

const mockLocations = [
  { city: "Chennai", state: "TN" },
  { city: "Bangalore", state: "KA" },
  { city: "Mumbai", state: "MH" },
  { city: "Delhi", state: "DL" },
];

const mockNotifications = [
  { id: 1, message: "Your booking with Priya Lakshmi is confirmed.", time: "2 min ago" },
  { id: 2, message: "Rajesh Kumar has sent you a new message.", time: "15 min ago" },
  { id: 3, message: "Your payment for Home Cleaning is complete.", time: "1 hour ago" },
  { id: 4, message: "Reminder: AC Repair appointment tomorrow at 10:00 AM.", time: "3 hours ago" },
];

export default function ClientHome() {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(mockLocations[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentExample, setCurrentExample] = useState(0);
  const [placeholder, setPlaceholder] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle rotating search examples
  useEffect(() => {
    const typeWriter = () => {
      const currentText = searchExamples[currentExample];
      
      if (isDeleting) {
        // Deleting text
        setPlaceholder(currentText.substring(0, placeholderIndex - 1));
        setPlaceholderIndex(prev => prev - 1);
        setTypingSpeed(50);
        
        if (placeholderIndex === 0) {
          setIsDeleting(false);
          setCurrentExample((currentExample + 1) % searchExamples.length);
        }
      } else {
        // Typing text
        setPlaceholder(currentText.substring(0, placeholderIndex + 1));
        setPlaceholderIndex(prev => prev + 1);
        setTypingSpeed(100);
        
        if (placeholderIndex === currentText.length) {
          // Pause at the end of typing before starting to delete
          setTypingSpeed(2000);
          setIsDeleting(true);
        }
      }
    };
    
    const timer = setTimeout(typeWriter, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentExample, isDeleting, placeholderIndex, typingSpeed]);

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSuggestions(false);
        setShowLocationPicker(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSuggestions(true);
  };

  const handleSearchSelect = (text: string) => {
    setSearchQuery(text);
    setShowSuggestions(false);
    // TODO: Implement actual search
    console.log('Searching for:', text);
  };
  const handleHire = (id: number) => {
    // TODO: Implement hire functionality
    console.log('Hiring freelancer:', id)
  }

  const handleCategoryClick = (name: string) => {
    // TODO: Implement category filtering
    console.log('Selected category:', name)
  }

  return (
    <ClientLayout>
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-30 bg-gradient-to-br from-[#6B46C1] via-[#4C1D95] to-[#2D1B69]">
        <div className="container mx-auto px-4 flex items-center justify-between pt-4 pb-2">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="relative flex items-center justify-center">
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors relative"
                  onClick={() => setShowSidebar(true)}
                  aria-label="Open profile menu"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <img
                    src="/images/profile-sonu.jpg"
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover ring-2 ring-white/10 group-hover:ring-purple-400/50 transition-all duration-300"
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
                <div className={`fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-neutral-200 shadow-2xl flex flex-col transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
                  <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
                    <div className="flex items-center gap-3">
                      <img src="/images/profile-sonu.jpg" alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-purple-400" />
                      <span className="text-neutral-900 font-medium">Sonu</span>
                    </div>
                    <button
                      className="p-2 rounded-full hover:bg-neutral-100 text-neutral-700"
                      onClick={() => setShowSidebar(false)}
                      aria-label="Close sidebar"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-col py-4 flex-1 gap-1">
                    {/* My Profile */}
                    <button
                      className="flex items-center gap-3 px-6 py-3 text-left text-neutral-800 hover:bg-neutral-100 transition-colors"
                      onClick={() => router.push('/client/profile')}
                    >
                      <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a8.38 8.38 0 0 1 13 0"/></svg>
                      My Profile
                    </button>
                    {/* Skill Coins */}
                    <div className="flex items-center gap-3 px-6 py-2 text-left">
                      <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 2"/></svg>
                      <span className="text-neutral-800">Skill Coins</span>
                      <span className="ml-auto text-xs text-yellow-600 font-semibold">2,500</span>
                    </div>
                    {/* My Bookings */}
                    <button
                      className="flex items-center gap-3 px-6 py-3 text-left text-neutral-800 hover:bg-neutral-100 transition-colors"
                      onClick={() => router.push('/client/bookings')}
                    >
                      <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
                      My Bookings
                    </button>
                    {/* My Referrals */}
                    <button
                      className="flex items-center gap-3 px-6 py-3 text-left text-neutral-800 hover:bg-neutral-100 transition-colors"
                      onClick={() => router.push('/client/referrals')}
                    >
                      <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      My Referrals
                    </button>
                    {/* Notifications */}
                    <button
                      className="flex items-center gap-3 px-6 py-3 text-left text-neutral-800 hover:bg-neutral-100 transition-colors"
                      onClick={() => router.push('/client/notifications')}
                    >
                      <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                      Notifications
                      <span className="ml-auto inline-flex items-center justify-center w-5 h-5 text-xs bg-purple-500 text-white rounded-full text-center font-semibold">
                        4
                      </span>
                    </button>
                    {/* Support */}
                    <button
                      className="flex items-center gap-3 px-6 py-3 text-left text-neutral-800 hover:bg-neutral-100 transition-colors"
                      onClick={() => router.push('/client/support')}
                    >
                      <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 2"/></svg>
                      Support
                    </button>

                    <div className="border-t border-neutral-200 my-2" />
                    {/* Logout at the bottom */}
                    <button className="flex items-center gap-3 px-6 py-3 text-left text-red-500 hover:bg-neutral-100 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7"/><path d="M3 21V3"/></svg>
                      Logout
                    </button>
                  </div>
                  {/* Hamburger icon at bottom - now darker for visibility */}
                  <div className="flex justify-center pb-6">
                    <div className="flex flex-col items-center gap-1">
                      <span className="block w-7 h-1 bg-neutral-700 rounded"></span>
                      <span className="block w-7 h-1 bg-neutral-700 rounded"></span>
                      <span className="block w-7 h-1 bg-neutral-700 rounded"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-lg font-medium text-white">Welcome back, Sonu!</span>
              <div className="relative group">
                <button 
                  className="flex items-center text-white/70 hover:text-white/90 transition-colors"
                  onClick={() => setShowLocationPicker(prev => !prev)}
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="text-xs">{currentLocation.city}, {currentLocation.state}</span>
                  <ChevronRight className="w-3 h-3 ml-0.5 group-hover:rotate-90 transition-transform duration-200" />
                </button>
                {showLocationPicker && (
                  <div className="absolute top-6 left-0 bg-white/10 rounded-lg py-2 w-36 border border-white/20">
                    {mockLocations.map((loc) => (
                      <button
                        key={`${loc.city}-${loc.state}`}
                        className="w-full px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 text-left flex items-center gap-2"
                        onClick={() => {
                          setCurrentLocation(loc);
                          setShowLocationPicker(false);
                        }}
                      >
                        <MapPin className="w-3 h-3" />
                        {loc.city}, {loc.state}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Link href="/client/notifications" className="relative group" aria-label="Notifications">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <Bell className="w-5 h-5 text-white" />
                  {mockNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-medium text-white">{mockNotifications.length}</span>
                    </span>
                  )}
                </span>
              </Link>
            </div>
            <div className="relative">
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
            {/* Cover Image */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src="/images/Purple ground.png"
                alt="Cover"
                className="w-full h-full object-cover opacity-[12%] transform translate-y-[10%]"
              />
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative container mx-auto px-4">
            {/* Adjusted space for optimal position */}
            <div className="pt-24 md:pt-28">
              <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-xl md:text-3xl font-bold text-white mb-2 text-center drop-shadow-lg">
                  Practice like a pro, with a pro
                </h1>
                <p className="text-base md:text-lg text-white/90 mb-4 drop-shadow-md">
                  Your shortcut to better cricket starts here
                </p>
              </div>

              {/* Modern Search Bar */}
              <div className="max-w-3xl mx-auto">
                <div className="relative w-full">
                  <Input
                    type="text"
                    placeholder={searchQuery ? `Find services in ${currentLocation.city}...` : placeholder || `Find services in ${currentLocation.city}...`}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full bg-white/20 border border-white/40 text-white placeholder-white/80 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-purple-400 transition-all shadow-lg"
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
                    <Sparkles className="w-5 h-5" />
                  </span>
                      {showSuggestions && (
                        <div className="absolute left-0 top-full mt-1 w-full bg-[#18181b]/95 rounded-lg border border-white/10 shadow-xl z-20">
                          <div className="p-2">
                            <div className="text-xs font-medium text-white/80 px-2 py-1 flex justify-between items-center">
                              <span>Popular Searches</span>
                              <button 
                                onClick={() => setShowSuggestions(false)}
                                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                aria-label="Close suggestions"
                              >
                                <X className="w-4 h-4 text-white/50" />
                              </button>
                            </div>
                            <div className="space-y-1">
                              {mockSearches.map((search) => (
                                <button 
                                  key={search.id}
                                  onClick={() => handleSearchSelect(search.text)}
                                  className="w-full px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg flex items-center justify-between group/item"
                                >
                                  <div className="flex items-center">
                                    <Search className="w-4 h-4 mr-2 text-purple-400" />
                                    <span className="text-white">{search.text}</span>
                                  </div>
                                  <span className="text-xs text-white/50 group-hover/item:text-white/80">{search.count.toLocaleString()}+ searches</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                </div>
              </div>

              {/* Why DoodLance Section */}
              <div className="mt-4 max-w-3xl mx-auto">
                <div className="mb-1">
                  <h2 className="text-sm font-semibold text-white tracking-wide text-left" data-component-name="ClientHome">WHY DOODLANCE?</h2>
                </div>
                <div className="flex flex-row justify-center gap-2 md:gap-4">
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
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4 bg-[#111111] mb-20 relative z-0">
          {/* Service Categories */}
          <section className="mb-4 relative z-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-medium text-white/90">Popular Services in your area</h2>
              <Link href="/client/services" className="text-white/80 hover:text-white text-sm font-medium flex items-center transition-colors">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="relative -mx-4">
              <div className="overflow-x-auto scrollbar-hide px-4">
                <div className="flex space-x-4 pb-4">
                  {popularServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      id={service.id}
                      title={service.title}
                      image={service.image}
                      icon={service.icon}
                      providerCount={service.providerCount}
                      className="w-[150px] flex-shrink-0"
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
          <section className="mb-8 relative z-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-transparent bg-clip-text">Top Rated</span>
                {" "}Experts
              </h2>
              <Link href="/client/nearby" className="text-white/80 hover:text-white text-sm font-medium flex items-center transition-colors">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="relative">
              <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                <div className="flex gap-3 pb-4">
                  {professionals
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
                    <div
                      key={expert.id}
                      className="flex-shrink-0 w-[160px]"
                    >
                      {/* Outer Layer Card */}
                      <div className="relative group">
                        {/* Card Background */}
                        <div className="absolute inset-0 rounded-2xl border border-purple-400/10 transition-all duration-300 group-hover:border-purple-400/20"></div>
                        
                        {/* Card Content */}
                        <div className="relative p-3">
                          <div className="relative group">
                            {/* Rating Badge */}
                            <div className="absolute top-2 left-2 z-20 bg-gradient-to-r from-yellow-400 to-yellow-600 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                              <Star className="w-2.5 h-2.5 text-black fill-current" />
                              <span className="text-black text-[10px] font-bold">{expert.rating}</span>
                            </div>
                            
                            {/* Profile Picture */}
                            <div className="relative w-[100px] h-[100px] mx-auto">
                              <img
                                src={expert.image}
                                alt={expert.name}
                                className="w-full h-full rounded-full border-2 border-purple-200/50 relative z-10 object-cover"
                              />
                            </div>
                            
                            {/* Expert Info with Reduced Spacing */}
                            <div className="mt-2 text-center">
                              <h3 className="font-semibold text-white text-sm leading-tight truncate">{expert.name}</h3>
                              <p className="text-purple-400 text-xs font-medium truncate mt-0.5">{expert.service}</p>
                              <div className="flex items-center justify-center gap-1 mt-1">
                                <p className="text-white/70 text-[10px]">{expert.reviews} reviews</p>
                                <span className="text-white/30">•</span>
                                <p className="text-white/70 text-[10px]">{expert.completedJobs} jobs</p>
                              </div>
                              <p className="text-white/50 text-[10px] font-medium mt-0.5">{expert.location}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Coupon Banner */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 mb-2 relative z-0"
          >
            <div className="relative -mx-4">
              <div className="overflow-x-auto scrollbar-hide px-4">
                <div className="flex gap-4">
                  {/* First Coupon */}
                  <div className="flex-shrink-0 w-[300px] bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="inline-block bg-white/20 text-white/90 text-xs px-2 py-0.5 rounded-full mb-2">
                          Limited Time
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">20% Off First Booking</h3>
                        <p className="text-white/90 text-sm mb-2">
                          Use code: <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded text-xs">WELCOME20</span>
                        </p>
                        <button className="bg-white text-purple-600 hover:bg-white/90 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300">
                          Book Now
                        </button>
                      </div>
                      <div className="relative ml-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                          <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-3 -right-3 bg-white text-purple-600 rounded-full w-10 h-10 flex items-center justify-center text-base font-bold shadow-md border-2 border-white">
                          20%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Second Coupon */}
                  <div className="flex-shrink-0 w-[300px] bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="inline-block bg-white/20 text-white/90 text-xs px-2 py-0.5 rounded-full mb-2">
                          Weekend Special
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">15% Off Weekend</h3>
                        <p className="text-white/90 text-sm mb-2">
                          Use code: <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded text-xs">WEEKEND15</span>
                        </p>
                        <button className="bg-white text-blue-600 hover:bg-white/90 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300">
                          Book Now
                        </button>
                      </div>
                      <div className="relative ml-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                          <Star className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-3 -right-3 bg-white text-blue-600 rounded-full w-10 h-10 flex items-center justify-center text-base font-bold shadow-md border-2 border-white">
                          15%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Third Coupon */}
                  <div className="flex-shrink-0 w-[300px] bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="inline-block bg-white/20 text-white/90 text-xs px-2 py-0.5 rounded-full mb-2">
                          Bulk Booking
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">25% Off 3+ Services</h3>
                        <p className="text-white/90 text-sm mb-2">
                          Use code: <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded text-xs">BULK25</span>
                        </p>
                        <button className="bg-white text-emerald-600 hover:bg-white/90 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </ClientLayout>
  )
} 