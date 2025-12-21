"use client"

import { useState, useEffect } from 'react'
import { MapPin, DollarSign, Calendar, Clock, Tag, Sparkles, User, X, Plus, Minus, Users } from 'lucide-react'
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

type ServiceCategory = 'Match Player' | 'Net Bowler' | 'Net Batsman' | 'Sidearm' | 'Coach' | 'Trainer' | 'Analyst' | 'Physio' | 'Scorer' | 'Umpire' | 'Commentator' | 'Cricket Content Creator' | 'Cricket Photo / Videography' | 'Other'

interface BudgetSuggestion {
  min: number
  max: number
  avg: number
}

// Experience-based budget suggestions
const experienceBudgets = {
  'Beginner': { min: 300, max: 500, avg: 400 },
  'Intermediate': { min: 500, max: 800, avg: 650 },
  'Expert': { min: 800, max: 5000, avg: 2000 },
}

export default function PostJobForm() {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | ''>('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [duration, setDuration] = useState('')
  const [title, setTitle] = useState('')
  const [workMode, setWorkMode] = useState<'remote' | 'onsite'>('onsite')
  const [experience, setExperience] = useState<'Beginner' | 'Intermediate' | 'Expert'>('Beginner')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [skills, setSkills] = useState<string[]>([])
  const [currentSkill, setCurrentSkill] = useState('')
  const [skillError, setSkillError] = useState('')
  const [peopleNeeded, setPeopleNeeded] = useState(1)

  // Check if all required fields are filled
  const isFormValid = title.trim() && description.trim() && selectedCategory && budget.trim() && location.trim() && startDate && duration.trim()

  // Update budget suggestions based on experience level
  useEffect(() => {
    if (!budget && experienceBudgets[experience]) {
      // Set suggested budget as placeholder when no budget is entered
      // This will be shown as helper text instead
    }
  }, [experience, budget])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!title.trim()) {
      alert('Job title is required');
      return;
    }
    if (!description.trim()) {
      alert('Job description is required');
      return;
    }
    if (!selectedCategory) {
      alert('Service category is required');
      return;
    }
    if (!budget.trim()) {
      alert('Budget is required');
      return;
    }
    if (!location.trim()) {
      alert('Location is required');
      return;
    }
    if (!startDate) {
      alert('Date & time is required');
      return;
    }
    if (!duration.trim()) {
      alert('Duration is required');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user session
      const sessionResponse = await fetch('/api/auth/session');
      if (!sessionResponse.ok) {
        throw new Error('Please log in to post a job');
      }
      const user = await sessionResponse.json();

      // Prepare job data
      const jobData = {
        title: title.trim(),
        description: description.trim(),
        category: selectedCategory,
        budget: budget.trim(),
        location: location.trim(),
        coords: [], // You can add geolocation later
        skills,
        workMode,
        type: 'freelance', // Default since not displayed in feed
        duration: duration.trim(),
        experience,
        startDate, // Add start date to job data
        peopleNeeded, // Number of people needed for the job
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
        console.error('API Error:', errorData);
        throw new Error(errorData.details || errorData.error || 'Failed to post job');
      }

      const job = await response.json();
      console.log('Job posted successfully:', job);

      // Dispatch event to refresh ForYouJobs context
      window.dispatchEvent(new CustomEvent('jobPosted', { detail: { jobId: job.id } }));

      // Show success modal
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Error posting job:', error);
      alert(error instanceof Error ? error.message : 'An error occurred while posting the job');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostAnother = () => {
    // Reset form
    setSelectedCategory('');
    setDescription('');
    setBudget('');
    setLocation('');
    setStartDate('');
    setDuration('');
    setTitle('');
    setWorkMode('onsite');
    setExperience('Beginner');
    setSkills([]);
    setCurrentSkill('');
    setSkillError('');
    setShowSuccessModal(false);
  };

  const handleClose = () => {
    // Close the modal and go back
    setShowSuccessModal(false);
    // You could navigate back to the previous page here
    window.history.back();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Category Selection */}
      <div>
        <Label htmlFor="category" className="text-white font-medium">
          Service Category <span className="text-red-500">*</span>
        </Label>
        <div className="mt-2">
          <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as ServiceCategory)}>
            <SelectTrigger className="w-full rounded-lg border border-white/20 bg-black/50 backdrop-blur-sm text-white focus:ring-1 focus:ring-purple-400 focus:border-purple-300">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-[#111111] text-white border-white/20">
              <SelectItem value="Match Player">Match Player</SelectItem>
              <SelectItem value="Net Bowler">Net Bowler</SelectItem>
              <SelectItem value="Net Batsman">Net Batsman</SelectItem>
              <SelectItem value="Sidearm">Sidearm</SelectItem>
              <SelectItem value="Coach">Coach</SelectItem>
              <SelectItem value="Trainer">Trainer</SelectItem>
              <SelectItem value="Analyst">Analyst</SelectItem>
              <SelectItem value="Physio">Physio</SelectItem>
              <SelectItem value="Scorer">Scorer</SelectItem>
              <SelectItem value="Umpire">Umpire</SelectItem>
              <SelectItem value="Commentator">Commentator</SelectItem>
              <SelectItem value="Cricket Content Creator">Cricket Content Creator</SelectItem>
              <SelectItem value="Cricket Photo / Videography">Cricket Photo / Videography</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Work Mode */}
      <div>
        <Label htmlFor="workMode" className="text-white font-medium">
          Work Mode <span className="text-red-500">*</span>
        </Label>
        <div className="mt-2">
          <Select value={workMode} onValueChange={(v) => setWorkMode(v as 'remote' | 'onsite')}>
            <SelectTrigger className="w-full rounded-lg border border-white/20 bg-black/50 backdrop-blur-sm text-white focus:ring-1 focus:ring-purple-400 focus:border-purple-300">
              <SelectValue placeholder="Select work mode" />
            </SelectTrigger>
            <SelectContent className="bg-[#111111] text-white border-white/20">
              <SelectItem value="onsite">On field (in-person)</SelectItem>
              <SelectItem value="remote">Online</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Job Title */}
      <div>
        <Label htmlFor="title" className="text-white font-medium">Job Title <span className="text-red-500">*</span></Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Need a sidearmer for weekend sessions"
          className="mt-2 border-white/20 focus:border-purple-300 focus:ring-1 focus:ring-purple-400 bg-black/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-white placeholder:text-white/50 break-words whitespace-normal"
        />
      </div>

      {/* Description with AI Assist */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="description" className="text-white font-medium">Job Description <span className="text-red-500">*</span></Label>
        </div>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your job requirements, session details, number of players, and any special instructions. Include venue preferences and equipment requirements."
          className="min-h-[150px] border-white/20 focus:border-purple-300 focus:ring-1 focus:ring-purple-400 bg-black/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-white placeholder:text-white/50 break-words whitespace-normal"
        />
      </div>

      {/* Experience Level */}
      <div>
        <Label htmlFor="experience" className="text-white font-medium">
          Experience Level Required <span className="text-red-500">*</span>
        </Label>
        <div className="mt-2">
          <Select value={experience} onValueChange={(v) => setExperience(v as 'Beginner' | 'Intermediate' | 'Expert')}>
            <SelectTrigger className="w-full rounded-lg border border-white/20 bg-black/50 backdrop-blur-sm text-white focus:ring-1 focus:ring-purple-400 focus:border-purple-300">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent className="bg-[#111111] text-white border-white/20">
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Budget and Duration Row */}
      <div className="grid grid-cols-[1fr_0.8fr] gap-3 items-end">
        <div>
          <div className="mb-2">
            <Label htmlFor="budget" className="text-white font-medium flex items-center gap-2">
              Budget <span className="text-red-500">*</span>
            </Label>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-lg font-medium z-10 pointer-events-none">₹</span>
            <Input
              id="budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="1200"
              className="pl-8 pr-3 border-white/20 focus:border-purple-300 focus:ring-1 focus:ring-purple-400 bg-black/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-white placeholder:text-white/50 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
          </div>
        </div>
        <div>
          <div className="mb-2">
            <Label htmlFor="duration" className="text-white font-medium">
              Duration <span className="text-red-500">*</span>
            </Label>
          </div>
          <Input
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="2 hours, 1 match, 1 day"
            className="h-10 border-white/20 focus:border-purple-300 focus:ring-1 focus:ring-purple-400 bg-black/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-white placeholder:text-white/50 break-words whitespace-normal"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <Label htmlFor="location" className="text-white font-medium">
          Location <span className="text-red-500">*</span>
        </Label>
        <div className="mt-2">
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Marina Cricket Ground, Chennai or specific address"
            className="border-white/20 focus:border-purple-300 focus:ring-1 focus:ring-purple-400 bg-black/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-white placeholder:text-white/50 break-words whitespace-normal"
          />
        </div>
      </div>

      {/* Required Skills */}
      <div>
        <Label htmlFor="skills" className="text-white font-medium">
          Required Skills
        </Label>
        <div className="mt-2">
          <div className="flex gap-2 mb-3">
            <Input
              id="currentSkill"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              placeholder={
                experience === 'Beginner' ? 'Basic batting, fielding, wicket keeping' :
                  experience === 'Intermediate' ? 'Slog hitting, Yorker expert, fast bowling' :
                    experience === 'Expert' ? 'Spin bowling, cover drive, leg spin' :
                      'Slog hitting, Yorker expert, FIELDOING COACH, fast bowler'
              }
              className="border-white/20 focus:border-purple-300 focus:ring-1 focus:ring-purple-400 bg-black/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-white placeholder:text-white/50 break-words whitespace-normal"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const trimmedSkill = currentSkill.trim();
                  if (trimmedSkill) {
                    if (skills.includes(trimmedSkill)) {
                      setSkillError('Skill already exists');
                      setTimeout(() => setSkillError(''), 3000);
                    } else {
                      setSkills([...skills, trimmedSkill]);
                      setCurrentSkill('');
                      setSkillError('');
                    }
                  }
                }
              }}
            />
            <Button
              type="button"
              onClick={() => {
                const trimmedSkill = currentSkill.trim();
                if (trimmedSkill) {
                  if (skills.includes(trimmedSkill)) {
                    setSkillError('Skill already exists');
                    setTimeout(() => setSkillError(''), 3000);
                  } else {
                    setSkills([...skills, trimmedSkill]);
                    setCurrentSkill('');
                    setSkillError('');
                  }
                }
              }}
              className="px-4 bg-purple-600 hover:bg-purple-700 text-white border border-purple-500/30"
              disabled={!currentSkill.trim()}
            >
              Add
            </Button>
          </div>
          {skillError && (
            <div className="text-red-400 text-sm mt-1">
              {skillError}
            </div>
          )}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 break-words whitespace-normal">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-200 border border-purple-300/30 break-words whitespace-normal"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                    className="ml-1 hover:text-purple-100 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* People Needed */}
      <div>
        <Label className="text-white font-medium">
          People Needed <span className="text-red-500">*</span>
        </Label>
        <div className="mt-2">
          <div className="flex items-center gap-3 bg-black/50 border border-white/20 rounded-xl px-3 py-1.5 w-full justify-between">
            <button
              type="button"
              onClick={() => setPeopleNeeded(Math.max(1, peopleNeeded - 1))}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={peopleNeeded <= 1}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-white font-semibold text-base">{peopleNeeded}</span>
              <span className="text-white/50 text-sm">person{peopleNeeded !== 1 ? 's' : ''}</span>
            </div>
            <button
              type="button"
              onClick={() => setPeopleNeeded(Math.min(50, peopleNeeded + 1))}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Date & Time */}
      <div>
        <Label htmlFor="startDate" className="text-white font-medium">
          Date & Time <span className="text-red-500">*</span>
        </Label>
        <div className="mt-2 grid grid-cols-[1.2fr_1fr] gap-2">
          <div>
            <input
              id="startDate"
              type="date"
              value={startDate ? startDate.split('T')[0] : ''}
              onChange={(e) => setStartDate(e.target.value + (startDate ? 'T' + startDate.split('T')[1] : 'T09:00'))}
              min={new Date().toISOString().split('T')[0]}
              className="w-full h-8 rounded-md border border-white/20 px-2 py-1 text-xs focus:border-purple-300 focus:ring-1 focus:ring-purple-400 bg-[#1a1a1a] backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-white cursor-pointer"
              style={{ colorScheme: 'dark' }}
            />
          </div>
          <div>
            <Select
              value={startDate ? (() => {
                const time = startDate.split('T')[1];
                const [hours, minutes] = time.split(':');
                const hour = parseInt(hours);
                const period = hour >= 12 ? 'PM' : 'AM';
                const hour12 = hour % 12 || 12;
                return `${hour12.toString().padStart(2, '0')}:${minutes} ${period}`;
              })() : '09:00 AM'}
              onValueChange={(value) => {
                const currentDate = startDate ? startDate.split('T')[0] : new Date().toISOString().split('T')[0];
                const [timePart, period] = value.split(' ');
                const [hour12, minutes] = timePart.split(':');
                let hour24 = parseInt(hour12);
                if (period === 'PM' && hour24 !== 12) hour24 += 12;
                if (period === 'AM' && hour24 === 12) hour24 = 0;
                setStartDate(`${currentDate}T${hour24.toString().padStart(2, '0')}:${minutes}`);
              }}
            >
              <SelectTrigger className="w-full h-8 rounded-md border border-white/20 bg-[#1a1a1a] text-white text-xs focus:ring-1 focus:ring-purple-400 focus:border-purple-300">
                <SelectValue placeholder="09:00 AM" />
              </SelectTrigger>
              <SelectContent className="bg-[#111111] text-white border-white/20 max-h-60">
                {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM'].map(time => (
                  <SelectItem key={time} value={time} className="text-xs">{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>


      {/* Submit Button - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-[#0F0F0F]/95 backdrop-blur-md border-t border-white/10 py-4">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 disabled:from-purple-400 disabled:to-purple-300 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-6 text-lg font-medium"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Posting Job...
                </div>
              ) : (
                'Post Job'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Job Posted Successfully!</h3>
              <p className="text-white/70">Your job is now visible to freelancers</p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handlePostAnother}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white py-3 font-medium transition-all duration-300"
              >
                Post Another Job
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="w-full border-white/30 text-white hover:bg-white/10 py-3 font-medium transition-all duration-300"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
} 