"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  DollarSign, 
  Calendar, 
  Clock, 
  Lightbulb,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categorizeJob } from '@/lib/services/job-categorization';

interface JobPostingFormProps {
  onSubmit: (data: JobPostingData) => void;
}

interface JobPostingData {
  title: string;
  description: string;
  budget: {
    min: number;
    max: number;
  };
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  urgency: 'low' | 'medium' | 'high';
  category: string;
}

export default function JobPostingForm({ onSubmit }: JobPostingFormProps) {
  const [formData, setFormData] = useState<JobPostingData>({
    title: '',
    description: '',
    budget: {
      min: 0,
      max: 0
    },
    location: {
      address: '',
      lat: 0,
      lng: 0
    },
    urgency: 'medium',
    category: ''
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Get AI suggestions when title or description changes
    if (name === 'title' || name === 'description') {
      setIsLoading(true);
      try {
        const categories = await categorizeJob(formData.title, formData.description);
        setSuggestions(categories.map(cat => cat.label));
      } catch (error) {
        console.error('Error getting suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-4 bg-white rounded-lg shadow"
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Job Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="e.g., Bathroom Renovation"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="Describe the job in detail..."
          />
        </div>

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="w-5 h-5 text-blue-500" />
              <h3 className="font-medium text-blue-700">AI Suggestions</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: suggestion }))}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Budget */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Min Budget</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="budget.min"
                value={formData.budget.min}
                onChange={handleInputChange}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Budget</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="budget.max"
                value={formData.budget.max}
                onChange={handleInputChange}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="location.address"
              value={formData.location.address}
              onChange={handleInputChange}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="Enter address"
            />
          </div>
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Urgency</label>
          <div className="mt-2 flex space-x-4">
            {['low', 'medium', 'high'].map((level) => (
              <label key={level} className="inline-flex items-center">
                <input
                  type="radio"
                  name="urgency"
                  value={level}
                  checked={formData.urgency === level}
                  onChange={handleInputChange}
                  className="form-radio text-primary focus:ring-primary"
                />
                <span className="ml-2 capitalize">{level}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">
          Post Job
        </Button>
      </div>
    </motion.form>
  );
} 