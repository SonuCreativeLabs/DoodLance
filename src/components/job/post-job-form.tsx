"use client"

import { useState, ChangeEvent } from 'react'
import { MapPin, DollarSign, Calendar, Clock, Tag, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'

type ServiceCategory = 'Plumbing' | 'Tutoring' | 'Pet Care' | 'Cleaning'

interface BudgetSuggestion {
  min: number
  max: number
  avg: number
}

// Mock data for budget suggestions
const budgetSuggestions: Record<ServiceCategory, BudgetSuggestion> = {
  'Plumbing': { min: 50, max: 200, avg: 120 },
  'Tutoring': { min: 20, max: 100, avg: 60 },
  'Pet Care': { min: 15, max: 50, avg: 30 },
  'Cleaning': { min: 25, max: 150, avg: 80 },
}

export default function PostJobForm() {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | ''>('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [location, setLocation] = useState('')

  const handleGenerateDescription = () => {
    // TODO: Implement AI description generation
    const generatedDescription = `Looking for a professional ${selectedCategory} service. The job requires attention to detail and quality work. Please provide your availability and estimated completion time.`
    setDescription(generatedDescription)
  }

  const handleBudgetSuggestion = () => {
    if (selectedCategory && budgetSuggestions[selectedCategory]) {
      const suggestion = budgetSuggestions[selectedCategory]
      setBudget(suggestion.avg.toString())
    }
  }

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value as ServiceCategory)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-purple-100/50 p-8 relative overflow-hidden group"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-purple-300/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-200/20 to-purple-300/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-purple-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="space-y-8 relative">
        {/* Form header */}
        <div className="border-b border-purple-100 pb-4">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">Create a New Job Posting</h2>
          <p className="text-purple-600/80 text-sm mt-1">Fill in the details below to find the perfect freelancer for your job</p>
        </div>
        
        {/* Category Selection */}
        <div>
          <Label htmlFor="category" className="text-purple-900 font-medium flex items-center gap-2">
            <Tag className="h-4 w-4 text-purple-500" />
            Service Category
          </Label>
          <div className="relative mt-2">
            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-purple-200 bg-white/90 backdrop-blur-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-300 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <option value="">Select a category</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Tutoring">Tutoring</option>
              <option value="Pet Care">Pet Care</option>
              <option value="Cleaning">Cleaning</option>
            </select>
          </div>
        </div>

        {/* Job Title */}
        <div>
          <Label htmlFor="title" className="text-purple-900 font-medium">Job Title</Label>
          <Input
            id="title"
            placeholder="e.g., Need a plumber for bathroom repair"
            className="mt-2 border-purple-200 focus:border-purple-300 focus:ring-1 focus:ring-purple-400 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-gray-900 placeholder:text-gray-500"
          />
        </div>

        {/* Description with AI Assist */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="description" className="text-purple-900 font-medium">Job Description</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateDescription}
              className="flex items-center gap-2 border-purple-200 hover:bg-purple-50 text-purple-600 hover:text-purple-700 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Sparkles className="w-4 h-4" />
              Generate with AI
            </Button>
          </div>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the job requirements, timeline, and any specific needs..."
            className="min-h-[150px] border-purple-200 focus:border-purple-300 focus:ring-1 focus:ring-purple-400 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-gray-900 placeholder:text-gray-500"
          />
        </div>

        {/* Budget */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="budget" className="text-purple-900 font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-500" />
              Budget
            </Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBudgetSuggestion}
              className="flex items-center gap-2 border-purple-200 hover:bg-purple-50 text-purple-600 hover:text-purple-700 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Sparkles className="w-4 h-4" />
              Suggest Budget
            </Button>
          </div>
          <div className="relative">
            <Input
              id="budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter your budget"
              className="pl-10 border-purple-200 focus:border-purple-300 focus:ring-1 focus:ring-purple-400 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-gray-900 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location" className="text-purple-900 font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4 text-purple-500" />
            Location
          </Label>
          <div className="relative mt-2">
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location or drop pin on map"
              className="pl-10 border-purple-200 focus:border-purple-300 focus:ring-1 focus:ring-purple-400 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-gray-900 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate" className="text-purple-900 font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              Start Date
            </Label>
            <div className="relative mt-2">
              <Input
                id="startDate"
                type="date"
                className="pl-10 border-purple-200 focus:border-purple-300 focus:ring-1 focus:ring-purple-400 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-gray-900"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="duration" className="text-purple-900 font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              Duration
            </Label>
            <div className="relative mt-2">
              <Input
                id="duration"
                placeholder="e.g., 2 hours"
                className="pl-10 border-purple-200 focus:border-purple-300 focus:ring-1 focus:ring-purple-400 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-gray-900 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-6 text-lg font-medium">
            Post Job
          </Button>
        </div>
      </div>
    </motion.div>
  )
} 