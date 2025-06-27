'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Briefcase, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  isCurrent: boolean;
}

interface ExperienceSectionProps {
  experiences: Experience[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newExperience, setNewExperience] = useState<Omit<Experience, 'id'>>({
    role: '',
    company: '',
    location: 'Chennai',
    startDate: '',
    endDate: null,
    description: '',
    isCurrent: true
  });

  const handleAddExperience = () => {
    // In a real app, you would add the experience to your state management
    console.log('Adding new experience:', newExperience);
    // Reset form
    setNewExperience({
      role: '',
      company: '',
      location: 'Chennai',
      startDate: '',
      endDate: null,
      description: '',
      isCurrent: true
    });
    setIsDialogOpen(false);
  };

  return (
    <Card className="bg-[#1E1E1E] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Work Experience</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-3 bg-white/5 border-white/10 hover:bg-white/10"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          <span className="text-xs">Add</span>
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-[360px] translate-x-[-50%] translate-y-[-50%] gap-2 border border-white/10 bg-[#1E1E1E] p-0 shadow-lg duration-200 rounded-lg overflow-hidden">
            <div className="p-3 max-h-[80vh] overflow-y-auto">
              <DialogHeader className="relative">
                <DialogTitle className="text-lg font-bold text-white">
                  Add Work Experience
                </DialogTitle>
                <p className="text-xs text-white/60">
                  Add your professional background and experience
                </p>
              </DialogHeader>
              <div className="mt-2 space-y-2">
              <div className="space-y-1">
                <Label htmlFor="role" className="block text-sm font-medium text-white/80">
                  Role <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="role"
                  value={newExperience.role}
                  onChange={(e) => setNewExperience({...newExperience, role: e.target.value})}
                  className="col-span-3 bg-[#2D2D2D] border-white/10 text-white"
                  placeholder="e.g., Senior Developer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="block text-sm font-medium text-white/80">
                  Company <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company"
                  value={newExperience.company}
                  onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                  className="col-span-3 bg-[#2D2D2D] border-white/10 text-white"
                  placeholder="Company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="block text-sm font-medium text-white/80">
                  Location
                </Label>
                <Input
                  id="location"
                  value={newExperience.location}
                  onChange={(e) => setNewExperience({...newExperience, location: e.target.value})}
                  className="col-span-3 bg-[#2D2D2D] border-white/10 text-white"
                  placeholder="e.g., Chennai, India"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate" className="block text-sm font-medium text-white/80">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="startDate"
                    type="date"
                    value={newExperience.startDate}
                    onChange={(e) => setNewExperience({...newExperience, startDate: e.target.value})}
                    className="w-full bg-[#2D2D2D] border-white/10 text-white [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:text-white"
                  />
                </div>
              </div>
              {!newExperience.isCurrent && (
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="block text-sm font-medium text-white/80">
                    End Date <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="endDate"
                      type="date"
                      value={newExperience.endDate || ''}
                      onChange={(e) => setNewExperience({...newExperience, endDate: e.target.value})}
                      className="w-full bg-[#2D2D2D] border-white/10 text-white [&::-webkit-calendar-picker-indicator]:invert"
                    />
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="isCurrent" className="text-sm font-medium text-white/80">
                  I currently work here
                </Label>
                <div 
                  className={`relative inline-flex items-center h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${newExperience.isCurrent ? 'bg-green-500' : 'bg-[#2D2D2D]'}`}
                  onClick={() => setNewExperience({...newExperience, isCurrent: !newExperience.isCurrent})}
                  role="switch"
                  aria-checked={newExperience.isCurrent}
                >
                  <span 
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${newExperience.isCurrent ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="description" className="block text-sm font-medium text-white/80">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newExperience.description}
                  onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                  className="col-span-3 bg-[#2D2D2D] border-white/10 text-white min-h-[100px]"
                  placeholder="Describe your role and responsibilities"
                />
              </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 h-9 text-xs border-white/10 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddExperience}
                  className="px-4 h-9 text-xs bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:pointer-events-none transition-all"
                  disabled={!newExperience.role || !newExperience.company || !newExperience.startDate}
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-6">
        {experiences.length === 0 ? (
          <div className="text-center py-8">
            <Briefcase className="h-10 w-10 mx-auto text-white/30 mb-2" />
            <h3 className="text-white/70 font-medium">No work experience added yet</h3>
            <p className="text-sm text-white/50 mt-1">Add your work history to showcase your experience</p>
          </div>
        ) : (
          experiences.map((exp) => (
            <div key={exp.id} className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <div className="w-px h-full bg-white/10 my-2"></div>
              </div>
              <div className="flex-1 pb-6">
                <h3 className="font-medium text-white">{exp.role}</h3>
                <p className="text-white/70">{exp.company}</p>
                <div className="flex flex-col gap-1 mt-1 text-sm text-white/50">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                  </div>
                  {exp.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{exp.location.replace('India', 'Chennai')}</span>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm text-white/70">{exp.description}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
