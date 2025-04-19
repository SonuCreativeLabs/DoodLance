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
      className="bg-white rounded-xl shadow-md p-6"
    >
      <div className="space-y-6">
        {/* Category Selection */}
        <div>
          <Label htmlFor="category">Service Category</Label>
          <div className="relative mt-2">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-transparent text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]"
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
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            placeholder="e.g., Need a plumber for bathroom repair"
            className="mt-2"
          />
        </div>

        {/* Description with AI Assist */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="description">Job Description</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateDescription}
              className="flex items-center gap-2"
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
            className="min-h-[150px]"
          />
        </div>

        {/* Budget */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="budget">Budget</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBudgetSuggestion}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Suggest Budget
            </Button>
          </div>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter your budget"
              className="pl-10"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location">Location</Label>
          <div className="relative mt-2">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location or drop pin on map"
              className="pl-10"
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <div className="relative mt-2">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="startDate"
                type="date"
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="duration">Duration</Label>
            <div className="relative mt-2">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="duration"
                placeholder="e.g., 2 hours"
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button className="w-full bg-[#FF8A3D] hover:bg-[#ff7a24]">
          Post Job
        </Button>
      </div>
    </motion.div>
  )
} 