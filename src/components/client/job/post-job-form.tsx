"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Wand2, Tag, IndianRupee, MapPin, Clock } from "lucide-react";

interface JobFormData {
  title: string;
  description: string;
  location: string;
  budget: string;
  duration: string;
  category: string;
}

export default function PostJobForm() {
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    description: "",
    location: "",
    budget: "",
    duration: "",
    category: "",
  });

  const [suggestedCategory, setSuggestedCategory] = useState<string>("");
  const [suggestedRate, setSuggestedRate] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const analyzeJobDescription = () => {
    if (!formData.description) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis with a timeout
    setTimeout(() => {
      // This would be replaced with actual AI API calls
      const categories = ["Home Services", "Pet Care", "Tutoring", "Cleaning", "Repairs"];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      const rates = ["₹300-500/hr", "₹500-800/hr", "₹800-1200/hr"];
      const randomRate = rates[Math.floor(Math.random() * rates.length)];
      
      setSuggestedCategory(randomCategory);
      setSuggestedRate(randomRate);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Post a Job</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Job Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Need a dog walker in Velachery"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Job Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
              placeholder="Describe the job requirements, skills needed, and any other details..."
              required
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={analyzeJobDescription}
              disabled={!formData.description || isAnalyzing}
              className="flex items-center gap-2"
            >
              <Wand2 className="h-4 w-4" />
              {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
            </Button>
          </div>
          
          {(suggestedCategory || suggestedRate) && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 p-4 rounded-lg border border-blue-200"
            >
              <h3 className="font-medium text-blue-800 mb-2">AI Suggestions</h3>
              
              {suggestedCategory && (
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Suggested Category: <span className="font-medium">{suggestedCategory}</span></span>
                </div>
              )}
              
              {suggestedRate && (
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Suggested Rate: <span className="font-medium">{suggestedRate}</span></span>
                </div>
              )}
            </motion.div>
          )}
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a category</option>
              <option value="home-services">Home Services</option>
              <option value="pet-care">Pet Care</option>
              <option value="tutoring">Tutoring</option>
              <option value="cleaning">Cleaning</option>
              <option value="repairs">Repairs</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter location (e.g., Velachery, Chennai)"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="budget" className="block text-sm font-medium mb-1">
              Budget
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 500/hr or 2000/day"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="duration" className="block text-sm font-medium mb-1">
              Duration
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select duration</option>
                <option value="one-time">One-time</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" className="px-6 py-2">
            Post Job
          </Button>
        </div>
      </form>
    </div>
  );
} 