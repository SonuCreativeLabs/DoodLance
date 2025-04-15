"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, MapPin, IndianRupee, Clock, MessageSquare, CheckCircle } from "lucide-react";

interface FreelancerCardProps {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  location: string;
  rate: string;
  rating: number;
  reviews: number;
  availability: string;
  description: string;
  isVerified: boolean;
}

export default function FreelancerCard({
  id,
  name,
  avatar,
  skills,
  location,
  rate,
  rating,
  reviews,
  availability,
  description,
  isVerified,
}: FreelancerCardProps) {
  const [isHiring, setIsHiring] = useState(false);
  
  const handleHire = () => {
    setIsHiring(true);
    // Simulate hiring process
    setTimeout(() => {
      setIsHiring(false);
      // This would be replaced with actual hiring logic
      console.log(`Hired freelancer: ${name}`);
    }, 1500);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            <Image 
              src={avatar} 
              alt={name} 
              fill 
              className="object-cover"
            />
            {isVerified && (
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-1">
                <CheckCircle className="h-4 w-4 text-blue-500" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{name}</h3>
              {isVerified && (
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                  Verified
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1 text-yellow-500 mt-1">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({reviews} reviews)</span>
            </div>
            
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
            
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              <IndianRupee className="h-4 w-4" />
              <span>{rate}</span>
              <span className="mx-1">•</span>
              <Clock className="h-4 w-4" />
              <span>{availability}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span 
              key={index} 
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
        
        <div className="mt-4 flex gap-2">
          <Button 
            onClick={handleHire} 
            disabled={isHiring}
            className="flex-1"
          >
            {isHiring ? "Hiring..." : "Hire Now"}
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Message</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
} 