'use client';

import { useState } from 'react';

import { Plus, Briefcase, Calendar, MapPin, Pencil, Trash2 } from "lucide-react";
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

export function ExperienceSection({ experiences: initialExperiences }: ExperienceSectionProps) {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<Experience | null>(null);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  
  const [newExperience, setNewExperience] = useState<Omit<Experience, 'id'>>({
    role: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    isCurrent: true
  });

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    
    // Format dates to YYYY-MM-DD format for consistency
    const formattedStartDate = new Date(newExperience.startDate).toISOString().split('T')[0];
    const formattedEndDate = !newExperience.isCurrent && newExperience.endDate 
      ? new Date(newExperience.endDate).toISOString().split('T')[0]
      : null;
    
    const experienceToSave = {
      ...newExperience,
      startDate: formattedStartDate,
      endDate: formattedEndDate
    };
    
    if (!experienceToSave.role || !experienceToSave.company || !experienceToSave.startDate) {
      return; // Don't proceed if required fields are empty
    }
    
    if (editingExperience) {
      // Update existing experience
      setExperiences(prev => 
        prev.map(exp => 
          exp.id === editingExperience.id 
            ? { ...newExperience, id: editingExperience.id } 
            : exp
        )
      );
    } else {
      // Add new experience
      const newExp: Experience = {
        ...newExperience,
        id: Date.now().toString(),
      };
      setExperiences(prev => [...prev, newExp]);
    }
    
    // Reset form
    setNewExperience({
      role: '',
      company: '',
      location: '',
      startDate: '',
      endDate: null,
      description: '',
      isCurrent: true
    });
    setEditingExperience(null);
    setIsDialogOpen(false);
  };

  const handleEditClick = (exp: Experience) => {
    setEditingExperience(exp);
    setNewExperience({
      role: exp.role,
      company: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      description: exp.description,
      isCurrent: exp.isCurrent
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (exp: Experience) => {
    setExperienceToDelete(exp);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (experienceToDelete) {
      setExperiences(prev => prev.filter(exp => exp.id !== experienceToDelete.id));
      setIsDeleteDialogOpen(false);
      setExperienceToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setExperienceToDelete(null);
  };

  return (
    <div className="space-y-3">
      <div className="w-full mb-6">
        <Button 
          variant="default" 
          size="sm" 
          className="w-full h-10 gap-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center rounded-lg"
          style={{ borderRadius: '0.5rem' }}
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Add Work Experience</span>
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A] border-white/10 max-w-2xl w-[95vw] p-0 rounded-2xl [&>button]:hidden">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-2xl font-bold text-white">
                {editingExperience ? 'Edit Work Experience' : 'Add Work Experience'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddExperience} className="p-6 pt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="role" className="text-sm font-medium text-white/80 mb-1.5 block">
                    Role <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="role"
                    value={newExperience.role}
                    onChange={(e) => setNewExperience({...newExperience, role: e.target.value})}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-purple-500"
                    placeholder="e.g., Senior Developer"
                  />
                </div>

                <div>
                  <Label htmlFor="company" className="text-sm font-medium text-white/80 mb-1.5 block">
                    Company <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="company"
                    value={newExperience.company}
                    onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-purple-500"
                    placeholder="Company name"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-white/80 mb-1.5 block">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newExperience.description}
                    onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-[100px] resize-none focus-visible:ring-1 focus-visible:ring-purple-500 overflow-y-auto"
                    placeholder="Describe your role and responsibilities"
                    style={{ scrollbarWidth: 'thin' }}
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-white/80 mb-1.5 block">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={newExperience.location}
                    onChange={(e) => setNewExperience({...newExperience, location: e.target.value})}
                    className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-purple-500"
                    placeholder="e.g., City, Country"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <Label htmlFor="startDate" className="text-sm font-medium text-white/80 mb-1.5 block">
                      Start Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newExperience.startDate}
                      onChange={(e) => setNewExperience({
                        ...newExperience, 
                        startDate: e.target.value,
                        // If end date is before start date, update it
                        endDate: (newExperience.endDate && new Date(e.target.value) > new Date(newExperience.endDate)) 
                          ? e.target.value 
                          : newExperience.endDate
                      })}
                      className="w-full bg-white/5 border-white/10 text-white [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:text-white focus-visible:ring-1 focus-visible:ring-purple-500"
                      required
                    />
                  </div>

                  <div className="col-span-1">
                    <Label htmlFor="endDate" className="text-sm font-medium text-white/80 mb-1.5 block">
                      End Date {!newExperience.isCurrent && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id="endDate"
                      type={newExperience.isCurrent ? 'text' : 'date'}
                      value={newExperience.isCurrent ? 'Present' : newExperience.endDate || ''}
                      min={newExperience.startDate}
                      onChange={(e) => !newExperience.isCurrent && setNewExperience({
                        ...newExperience, 
                        endDate: e.target.value
                      })}
                      className={`w-full bg-white/5 border-white/10 text-white ${newExperience.isCurrent ? 'text-white/60' : ''} [&::-webkit-calendar-picker-indicator]:invert focus-visible:ring-1 focus-visible:ring-purple-500`}
                      disabled={newExperience.isCurrent}
                      required={!newExperience.isCurrent}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Label htmlFor="isCurrent" className="text-sm font-medium text-white/80">
                    I currently work here
                  </Label>
                  <div 
                    className={`relative inline-flex items-center h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${newExperience.isCurrent ? 'bg-green-500' : 'bg-white/10'}`}
                    onClick={() => setNewExperience({...newExperience, isCurrent: !newExperience.isCurrent})}
                    role="switch"
                    aria-checked={newExperience.isCurrent}
                  >
                    <span 
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${newExperience.isCurrent ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-6 border-t border-white/10 mt-6">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="px-6 h-10 text-sm border-white/10 text-white/80 hover:bg-white/5 hover:text-white transition-colors rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="px-6 h-10 text-sm bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:pointer-events-none transition-all rounded-lg"
                    disabled={!newExperience.role.trim() || !newExperience.company.trim() || !newExperience.startDate || (!newExperience.isCurrent && !newExperience.endDate)}
                  >
                    {editingExperience ? 'Update Experience' : 'Save Work Experience'}
                  </Button>
                </div>
              </div>
            </form>


          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A] border-white/10 max-w-md w-[95vw] p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">Delete Experience</DialogTitle>
            </DialogHeader>
            <p className="text-white/80 mt-2">
              Are you sure you want to delete this work experience? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button 
                variant="outline"
                onClick={cancelDelete}
                className="px-4 h-9 text-sm border-white/10 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmDelete}
                className="px-4 h-9 text-sm bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-6">
        {experiences.length === 0 ? (
          <div className="text-center py-8">
            <Briefcase className="h-10 w-10 mx-auto text-white/30 mb-2" />
            <h3 className="text-white/70 font-medium">No work experience added yet</h3>
            <p className="text-sm text-white/50 mt-1">Add your work history to showcase your experience</p>
          </div>
        ) : (
          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id} className="flex gap-4 group relative">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <div className="w-px h-full bg-white/10 my-2"></div>
                </div>
                <div className="absolute right-0 top-0 flex gap-2">
                  <button 
                    onClick={() => handleEditClick(exp)}
                    className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-full"
                    aria-label="Edit experience"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(exp)}
                    className="p-1.5 text-red-400/80 hover:text-red-400 hover:bg-white/10 rounded-full"
                    aria-label="Delete experience"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 pb-6">
                  <h3 className="font-medium text-white">{exp.role}</h3>
                  <p className="text-white/70">{exp.company}</p>
                  <div className="flex items-center gap-2 text-sm text-white/60 mt-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{exp.location}</span>
                    <span className="mx-1">•</span>
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {exp.isCurrent ? 'Present' : new Date(exp.endDate || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="mt-2 text-sm text-white/80">{exp.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
