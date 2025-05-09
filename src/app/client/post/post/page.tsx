"use client"

import { useState } from 'react'
import { MapPin, DollarSign, Calendar, Clock, Tag, Sparkles } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import ClientLayout from '@/components/layouts/client-layout'

// Define the type for budget suggestions
type ServiceCategory = 'Plumbing' | 'Tutoring' | 'Pet Care' | 'Cleaning';
type BudgetSuggestion = { min: number; max: number; avg: number };

// Mock data for budget suggestions
const budgetSuggestions: Record<ServiceCategory, BudgetSuggestion> = {
  'Plumbing': { min: 50, max: 200, avg: 120 },
  'Tutoring': { min: 20, max: 100, avg: 60 },
  'Pet Care': { min: 15, max: 50, avg: 30 },
  'Cleaning': { min: 25, max: 150, avg: 80 },
}

export default function PostJob() {
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
    // Only proceed if selectedCategory is not empty string
    if (selectedCategory !== '') {
      const suggestion = budgetSuggestions[selectedCategory]
      setBudget(suggestion.avg.toString())
    }
  }

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6">Post a Job</h1>
          
          <Tabs defaultValue="post" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="post">Post Job</TabsTrigger>
              <TabsTrigger value="direct">Direct Hire</TabsTrigger>
            </TabsList>

            {/* Post Job Tab */}
            <TabsContent value="post" className="mt-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="space-y-6">
                  {/* Category Selection */}
                  <div>
                    <Label htmlFor="category">Service Category</Label>
                    <div className="relative mt-2">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as ServiceCategory | '')}
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
              </div>
            </TabsContent>

            {/* Direct Hire Tab */}
            <TabsContent value="direct" className="mt-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="space-y-6">
                  <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Map View Coming Soon</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="searchLocation">Search Location</Label>
                      <div className="relative mt-2">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          id="searchLocation"
                          placeholder="Enter location"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="radius">Search Radius</Label>
                      <div className="relative mt-2">
                        <Input
                          id="radius"
                          type="range"
                          min="1"
                          max="10"
                          step="1"
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>1km</span>
                          <span>10km</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-[#FF8A3D] hover:bg-[#ff7a24]">
                    Search Professionals
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </ClientLayout>
  )
} 