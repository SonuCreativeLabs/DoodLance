"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostJobForm from "@/components/job/post-job-form";
import FreelancerCard from "@/components/freelancer/freelancer-card";
import { Search, Filter, MapPin, IndianRupee, Star } from "lucide-react";

// Mock data for freelancers
const mockFreelancers = [
  {
    id: "1",
    name: "Priya Sharma",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    skills: ["Dog Walking", "Pet Sitting", "Pet Grooming"],
    location: "Velachery, Chennai",
    rate: "₹500/hr",
    rating: 4.8,
    reviews: 24,
    availability: "Available Now",
    description: "Professional pet care provider with 3 years of experience. I love animals and provide the best care for your pets.",
    isVerified: true,
  },
  {
    id: "2",
    name: "Rajesh Kumar",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    skills: ["Plumbing", "Electrical", "Home Repairs"],
    location: "Anna Nagar, Chennai",
    rate: "₹600/hr",
    rating: 4.6,
    reviews: 18,
    availability: "Available Today",
    description: "Licensed plumber and electrician with 5 years of experience. Quick and reliable service for all your home repair needs.",
    isVerified: true,
  },
  {
    id: "3",
    name: "Anjali Patel",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    skills: ["Math Tutoring", "Science", "English"],
    location: "T Nagar, Chennai",
    rate: "₹800/hr",
    rating: 4.9,
    reviews: 32,
    availability: "Available This Week",
    description: "Certified teacher with 7 years of experience in tutoring. Specializing in mathematics and science for high school students.",
    isVerified: true,
  },
  {
    id: "4",
    name: "Suresh Menon",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    skills: ["House Cleaning", "Deep Cleaning", "Window Cleaning"],
    location: "Adyar, Chennai",
    rate: "₹400/hr",
    rating: 4.5,
    reviews: 15,
    availability: "Available Tomorrow",
    description: "Professional cleaner with attention to detail. I ensure your home is spotless and hygienic.",
    isVerified: false,
  },
  {
    id: "5",
    name: "Meera Reddy",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    skills: ["Cooking", "Meal Prep", "Diet Planning"],
    location: "Mylapore, Chennai",
    rate: "₹700/hr",
    rating: 4.7,
    reviews: 21,
    availability: "Available Now",
    description: "Experienced cook specializing in healthy and nutritious meals. I can prepare meals according to your dietary requirements.",
    isVerified: true,
  },
];

export default function PostPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [rating, setRating] = useState("");
  
  // Filter freelancers based on search criteria
  const filteredFreelancers = mockFreelancers.filter(freelancer => {
    const matchesSearch = searchQuery === "" || 
      freelancer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freelancer.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = location === "" || 
      freelancer.location.toLowerCase().includes(location.toLowerCase());
    
    const matchesPrice = priceRange === "" || 
      (priceRange === "low" && parseInt(freelancer.rate.replace(/[^0-9]/g, "")) < 500) ||
      (priceRange === "medium" && parseInt(freelancer.rate.replace(/[^0-9]/g, "")) >= 500 && parseInt(freelancer.rate.replace(/[^0-9]/g, "")) < 800) ||
      (priceRange === "high" && parseInt(freelancer.rate.replace(/[^0-9]/g, "")) >= 800);
    
    const matchesRating = rating === "" || 
      (rating === "4+" && freelancer.rating >= 4) ||
      (rating === "4.5+" && freelancer.rating >= 4.5);
    
    return matchesSearch && matchesLocation && matchesPrice && matchesRating;
  });
  
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Hire Local Talent</h1>
      
      <Tabs defaultValue="post-job" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="post-job">Post a Job</TabsTrigger>
          <TabsTrigger value="direct-hire">Direct Hire</TabsTrigger>
        </TabsList>
        
        <TabsContent value="post-job">
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Post a Job</h2>
            <p className="text-blue-700">
              Describe your task and let skilled professionals apply to help you. Our AI will help categorize your job and suggest fair rates.
            </p>
          </div>
          
          <PostJobForm />
        </TabsContent>
        
        <TabsContent value="direct-hire">
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Direct Hire</h2>
            <p className="text-green-700">
              Browse through verified freelancer profiles and hire them directly. Filter by skills, location, and price to find the perfect match.
            </p>
          </div>
          
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search skills or names"
                  className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option value="">Price Range</option>
                  <option value="low">Under ₹500/hr</option>
                  <option value="medium">₹500-800/hr</option>
                  <option value="high">Above ₹800/hr</option>
                </select>
              </div>
              
              <div className="relative">
                <Star className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Rating</option>
                  <option value="4+">4+ Stars</option>
                  <option value="4.5+">4.5+ Stars</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFreelancers.map((freelancer) => (
              <FreelancerCard
                key={freelancer.id}
                {...freelancer}
              />
            ))}
            
            {filteredFreelancers.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No freelancers found matching your criteria.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 