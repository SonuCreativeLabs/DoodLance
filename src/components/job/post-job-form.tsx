"use client"

import { useState } from 'react'
import { MapPin, DollarSign, Calendar, Clock, Tag, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ServiceCategory = 'Playing' | 'Coaching' | 'Support' | 'Media' | 'Grounds'

interface BudgetSuggestion {
  min: number
  max: number
  avg: number
}

// Updated budget suggestions for cricket services
const budgetSuggestions: Record<ServiceCategory, BudgetSuggestion> = {
  'Playing': { min: 2000, max: 5000, avg: 3500 },
  'Coaching': { min: 1500, max: 4000, avg: 2500 },
  'Support': { min: 1000, max: 3000, avg: 1800 },
  'Media': { min: 3000, max: 8000, avg: 5000 },
  'Grounds': { min: 800, max: 2000, avg: 1200 },
}

export default function PostJobForm() {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | ''>('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [duration, setDuration] = useState('')
  const [title, setTitle] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Get current user session
      const sessionResponse = await fetch('/api/auth/session');
      if (!sessionResponse.ok) {
        throw new Error('Please log in to post a job');
      }
      const user = await sessionResponse.json();

      // Prepare job data
      const jobData = {
        title,
        description,
        category: selectedCategory,
        budget,
        location,
        coords: [], // You can add geolocation later
        skills: [], // Extract from description or add form field
        workMode: 'remote', // Default, can be enhanced
        type: 'freelance', // Default, can be enhanced
        duration,
        experience: 'Intermediate', // Default, can be enhanced
      };

      // Submit job
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to post job');
      }

      const job = await response.json();
      console.log('Job posted successfully:', job);

      // Reset form
      setSelectedCategory('');
      setDescription('');
      setBudget('');
      setLocation('');
      setStartDate('');
      setDuration('');
      setTitle('');

      alert('Job posted successfully!');
    } catch (error) {
      console.error('Error posting job:', error);
      alert(error instanceof Error ? error.message : 'An error occurred while posting the job');
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-8">
        {/* Form header */}
        <div className="border-b border-white/10 pb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Create a New Job Posting</h2>
          <p className="text-white/80 text-base mt-2">Fill in the details below to find the perfect cricket professional for your job</p>
        </div>
        
        {/* Category Selection */}
        <div>
          <Label htmlFor="category" className="text-white font-medium flex items-center gap-2">
            <Tag className="h-4 w-4 text-purple-400" />
            Service Category
          </Label>
          <div className="mt-2">
            <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as ServiceCategory)}>
              <SelectTrigger className="w-full rounded-lg border border-white/20 bg-black/50 backdrop-blur-sm text-white focus:ring-1 focus:ring-purple-400 focus:border-purple-300">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-[#111111] text-white border-white/20">
                <SelectItem value="Playing">Playing</SelectItem>
                <SelectItem value="Coaching">Coaching</SelectItem>
                <SelectItem value="Support">Support</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
                <SelectItem value="Grounds">Grounds</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Job Title */}
        <div>
          <Label htmlFor="title" className="text-white font-medium">Job Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Need a batting coach for weekend sessions"
            className="mt-2 border-white/20 focus:border-purple-300 focus:ring-1 focus:ring-purple-400 bg-black/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-white placeholder:text-white/50"
          />
        </div>

        {/* Description with AI Assist */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="description" className="text-white font-medium">Job Description</Label>
          </div>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the job requirements, timeline, and any specific needs..."
            className="min-h-[150px] border-white/20 focus:border-purple-300 focus:ring-1 focus:ring-purple-400 bg-black/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-white placeholder:text-white/50"
          />
        </div>

        {/* Budget */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="budget" className="text-white font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-400" />
              Budget
            </Label>
          </div>
          <div>
            <Input
              id="budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter your budget"
              className="border-white/20 focus:border-purple-300 focus:ring-1 focus:ring-purple-400 bg-black/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location" className="text-white font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4 text-purple-400" />
            Location
          </Label>
          <div className="mt-2">
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location or drop pin on map"
              className="border-white/20 focus:border-purple-300 focus:ring-1 focus:ring-purple-400 bg-black/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-[1.7fr_0.8fr] gap-3">
          <div>
            <Label htmlFor="startDate" className="text-white font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-400" />
              Date & Time
            </Label>
            <div className="mt-2 grid grid-cols-[1.2fr_1fr] gap-2">
              <div>
                <input
                  id="startDate"
                  type="date"
                  value={startDate ? startDate.split('T')[0] : ''}
                  onChange={(e) => setStartDate(e.target.value + (startDate ? 'T' + startDate.split('T')[1] : 'T12:00'))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full h-8 rounded-md border border-white/20 px-2 py-1 text-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-400 bg-[#1a1a1a] backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-white cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <div>
                <input
                  id="startTime"
                  type="time"
                  value={startDate ? startDate.split('T')[1] : ''}
                  onChange={(e) => setStartDate((startDate ? startDate.split('T')[0] : new Date().toISOString().split('T')[0]) + 'T' + e.target.value)}
                  className="w-full h-8 rounded-md border border-white/20 px-2 py-1 text-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-400 bg-[#1a1a1a] backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-white cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="duration" className="text-white font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-400" />
              Duration
            </Label>
            <div className="mt-2">
              <Input
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 2h"
                className="h-8 border-white/20 focus:border-purple-300 focus:ring-1 focus:ring-purple-400 bg-black/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-white placeholder:text-white/50 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-6 text-lg font-medium">
            Post Job
          </Button>
        </div>
    </form>
  )
} 