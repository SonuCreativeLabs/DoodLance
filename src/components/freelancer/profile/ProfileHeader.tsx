'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import ProfilePreview from './ProfilePreview';
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
  isPreview?: boolean;
}

export function ProfileHeader({
  name = "Sathish Sonu",
  title = "Cricketer & AI Engineer",
  rating = 4.8,
  reviewCount = 42,
  location = "Chennai, India",
  online = true,
  skills = ["Top Order Batsman", "Sidearm Specialist", "Off Spin", "Analyst"],
  avatarUrl = "/images/profile-sonu.jpg",
  coverImageUrl = "/images/cover-pic.JPG",
  isPreview = false
}: ProfileHeaderProps) {
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  // Check for #preview or section hash in URL on component mount and after navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      
      if (hash) {
        // Check if it's a section hash (e.g., #services, #portfolio, #reviews)
        const section = hash.replace('#', '');
        const validSections = ['services', 'portfolio', 'reviews'];
        
        if (validSections.includes(section)) {
          // Open the preview modal
          setIsPreviewOpen(true);
          
          // Scroll to the section after a small delay to allow the modal to open
          setTimeout(() => {
            const element = document.getElementById(section);
            if (element) {
              element.scrollIntoView();
            }
          }, 0);
          
          // Clean up the URL
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        } else if (hash === '#preview') {
          // For backward compatibility
          setIsPreviewOpen(true);
          // Remove the hash without adding to history
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }
    };
    
    // Check on initial load
    handleHashChange();
    
    // Also check when the hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  // Handle preview modal close
  const handlePreviewClose = () => {
    setIsPreviewOpen(false);
    // If we're in a modal state, update the URL to remove the hash
    if (window.location.hash === '#preview') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

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
    <div className="relative w-full bg-[#0f0f0f] profile-header">
      {/* Cover Photo */}
      <div className="group relative h-48 md:h-64 w-full bg-gradient-to-r from-purple-900 to-purple-700">
        {/* Switch to Client Button - Top-right of cover */}
        {!isPreview && (
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
        )}
        <div className="absolute inset-0 w-full h-full">
          <CoverImage />
        </div>
        
        {/* Edit Cover Button - Only show in edit mode */}
        {!isPreview && (
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
        )}
      </div>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="flex flex-col items-center md:flex-row md:items-end md:justify-between -mt-16 mb-4">
          {/* Profile Picture */}
          <div className="relative group">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-[#1E1E1E] overflow-hidden bg-[#111111]">
              <Avatar className="w-full h-full">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              {!isPreview && (
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button 
                    variant="default" 
                    size="icon" 
                    className="h-10 w-10 rounded-full bg-white hover:bg-white/90"
                    onClick={(e) => {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }}
                  >
                    <Camera className="h-5 w-5 text-[#1E1E1E]" />
                  </Button>
                </div>
              )}
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
        <div className="flex flex-wrap justify-center gap-2 pb-2">
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
        
        {/* Preview Profile Button */}
        <div className="flex justify-center mt-3 mb-4">
          {!isPreview && (
            <Button 
              variant="ghost"
              onClick={() => setIsPreviewOpen(true)}
              className="group relative overflow-hidden px-4 py-1.5 h-8 bg-gradient-to-r from-[#6B46C1] via-[#4C1D95] to-[#2D1B69] text-white text-xs font-normal rounded-full shadow hover:shadow-md hover:shadow-[#4C1D95]/40 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-[#6B46C1]"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Preview Profile
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#4C1D95] via-[#6B46C1] to-[#4C1D95] opacity-0 group-hover:opacity-30 transition-opacity duration-200 rounded-full"></span>
              <span className="absolute inset-0 bg-white/5 backdrop-blur-sm opacity-0 group-hover:opacity-40 transition-opacity duration-200 rounded-full"></span>
            </Button>
          )}
        </div>
      </div>
      
      {/* Profile Preview Modal */}
      <ProfilePreview 
        isOpen={isPreviewOpen}
        onClose={handlePreviewClose}
        profileData={{
          name,
          title,
          rating: 4.9, // Average from reviews
          reviewCount: 6, // Total number of reviews
          location,
          online,
          skills,
          about: 'Professional Cricketer and AI Engineer with a passion for both sports and technology. I bring the same dedication and strategic thinking from the cricket field to developing intelligent AI solutions.',
          responseTime: '1-2 hours',
          deliveryTime: '1-2 weeks',
          completionRate: 100,
          completedJobs: 24, // Example number
          activeJobs: 3, // Example number
          experience: [
            {
              id: '1',
              role: 'Cricketer (All-Rounder)',
              company: 'Professional Cricket',
              location: 'India',
              startDate: '2015',
              endDate: undefined,
              isCurrent: true,
              description: 'Professional cricketer specializing in top-order batting and off-spin bowling. Experienced in high-pressure matches with a focus on building strong team performances.'
            },
            {
              id: '2',
              role: 'AI Engineer & Developer',
              company: 'Freelance',
              location: 'Remote',
              startDate: '2020',
              endDate: undefined,
              isCurrent: true,
              description: 'Developing AI solutions and applications with a focus on machine learning, natural language processing, and automation. Specializing in creating intelligent systems that solve complex problems.'
            },
            {
              id: '3',
              role: 'Cricket Coach',
              company: 'Local Academy',
              location: 'India',
              startDate: '2018',
              endDate: '2020',
              isCurrent: false,
              description: 'Coached young cricketers in batting techniques, bowling skills, and match strategies. Helped develop the next generation of cricket talent with a focus on both technical skills and mental toughness.'
            }
          ],
          services: [
            {
              id: '1',
              title: 'AI Development Consultation',
              description: 'Expert guidance on AI implementation for your business needs',
              price: '₹25,000',
              type: 'online',
              deliveryTime: '1 week',
              features: [
                '1-hour consultation session',
                'Technical requirements analysis',
                'Solution architecture design',
                'Implementation roadmap',
                'Follow-up email support for 1 week'
              ]
            },
            {
              id: '2',
              title: 'Custom AI Solution Development',
              description: 'Tailored AI application development for your specific needs',
              price: '₹1,50,000',
              type: 'online',
              deliveryTime: '4-6 weeks',
              features: [
                'Custom AI model development',
                'API integration',
                'Testing & deployment',
                'Documentation',
                '1 month of maintenance support'
              ]
            },
            {
              id: '3',
              title: 'Cricket Coaching (Batting)',
              description: 'Personalized batting coaching sessions',
              price: '₹2,000',
              type: 'in-person',
              deliveryTime: '2 hours',
              features: [
                'Technical skill assessment',
                'Personalized training plan',
                'Video analysis',
                'Match simulation drills',
                'Mental conditioning tips'
              ]
            },
            {
              id: '4',
              title: 'Cricket Coaching (Bowling)',
              description: 'Professional off-spin bowling coaching',
              price: '₹2,500',
              type: 'in-person',
              deliveryTime: '2 hours',
              features: [
                'Bowling action analysis',
                'Variations coaching',
                'Match situation practice',
                'Fitness & conditioning advice',
                'Video analysis session'
              ]
            }
          ],
          portfolio: [
            {
              id: '1',
              title: '3x Division Cricket Champion',
              category: 'Cricket Achievement',
              image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1784?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
            },
            {
              id: '2',
              title: 'State Level College Champion',
              category: 'Cricket Achievement',
              image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
            },
            {
              id: '3',
              title: 'Sports Quota Scholar',
              category: 'Academic Achievement',
              image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1784?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
            },
            {
              id: '4',
              title: 'AI-Powered Cricket Analytics',
              category: 'AI/ML Development',
              image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
            },
            {
              id: '5',
              title: 'Vibe Code Framework',
              category: 'Open Source AI',
              image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
            }
          ],
          reviews: [
            {
              id: '1',
              author: 'Rahul Sharma',
              role: 'U-19 Cricket Team Captain',
              rating: 5,
              comment: 'Sonu transformed my batting technique completely. His one-on-one sessions helped me improve my average by 35% in just 3 months. His knowledge of the game is exceptional!',
              date: '2024-05-10',
              isVerified: true
            },
            {
              id: '2',
              author: 'Neha Patel',
              role: 'Startup Founder',
              rating: 5,
              comment: 'The AI solution developed by Sonu automated our customer service, reducing response time by 80%. His technical expertise and problem-solving skills are top-notch!',
              date: '2024-04-18',
              isVerified: true
            },
            {
              id: '3',
              author: 'Vikram Singh',
              role: 'Cricket Academy Director',
              rating: 5,
              comment: 'As a coach, Sonu has a unique ability to identify and correct technical flaws. Our academy players have shown remarkable improvement under his guidance.',
              date: '2024-03-25',
              isVerified: true
            },
            {
              id: '4',
              author: 'Ananya Gupta',
              role: 'Tech Entrepreneur',
              rating: 4.5,
              comment: 'Worked with Sonu on a complex AI project. His understanding of machine learning models and their practical implementation is impressive. Delivered beyond expectations!',
              date: '2024-02-15',
              isVerified: true
            },
            {
              id: '5',
              author: 'Arjun Mehta',
              role: 'Professional Cricketer',
              rating: 5,
              comment: 'The best off-spin coach I\'ve worked with. His insights into bowling variations and game situations have taken my bowling to the next level.',
              date: '2024-01-30',
              isVerified: true
            },
            {
              id: '6',
              author: 'Priya Desai',
              role: 'Product Manager',
              rating: 5,
              comment: 'Sonu developed a custom AI tool that saved our team 20+ hours of work per week. His ability to understand business needs and translate them into technical solutions is remarkable.',
              date: '2023-12-10',
              isVerified: true
            }
          ],
          availability: [
            { day: 'Monday', available: true },
            { day: 'Tuesday', available: true },
            { day: 'Wednesday', available: true },
            { day: 'Thursday', available: true },
            { day: 'Friday', available: true },
            { day: 'Saturday', available: false },
            { day: 'Sunday', available: false }
          ]
        }}
      />
    </div>
  );
}
