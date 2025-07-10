'use client';

import { useState, memo } from 'react';
import { Plus, X, GripVertical, Pencil, Info, ChevronDown, Star, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SkillItemType {
  id: string;
  name: string;
  description?: string;
  experience?: string;
  level?: 'Beginner' | 'Intermediate' | 'Expert';
}

interface SkillItemProps {
  id: string;
  skill: string;
  description?: string;
  experience?: string;
  level?: string;
  onEdit: (id: string, newSkill: string, newDescription?: string, newExperience?: string, newLevel?: string) => void;
  onDelete: (id: string) => void;
}

const formatExperience = (value: string) => {
  if (!value) return '';
  const numValue = value.replace(/\D/g, '');
  if (!numValue) return '';
  const years = parseInt(numValue, 10);
  return years === 1 ? '1 year' : `${years} years`;
};

const SkillItem = memo(function SkillItem({ id, skill, description = '', experience = '', level = 'Intermediate', onEdit, onDelete }: SkillItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editedSkill, setEditedSkill] = useState(skill);
  const [editedDescription, setEditedDescription] = useState(description || '');
  const [editedExperience, setEditedExperience] = useState(experience ? experience.replace(' years', '').replace(' year', '') : '');
  const [editedLevel, setEditedLevel] = useState(level || 'Intermediate');
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  const openDetails = () => {
    console.log('Opening details dialog'); // Debug log
    setIsDetailsOpen(true);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Only open details if clicking on the main content, not on buttons or drag handle
    if (!(e.target as HTMLElement).closest('button, .drag-handle')) {
      openDetails();
    }
  };

  const handleSave = () => {
    if (editedSkill.trim()) {
      onEdit(id, editedSkill, editedDescription, editedExperience, editedLevel);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-4 bg-[#1E1E1E] p-4 rounded-xl border border-white/5 shadow-sm hover:border-white/10 transition-colors">
        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label htmlFor={`skill-${id}`} className="text-xs font-medium text-foreground/80 mb-1.5 block">
                Skill Name
              </Label>
              <Input
                id={`skill-${id}`}
                value={editedSkill}
                onChange={(e) => setEditedSkill(e.target.value)}
                className="h-10 bg-[#2A2A2A] border border-gray-700 text-white placeholder-gray-400"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
            </div>
            
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-2">
                <Label htmlFor={`experience-${id}`} className="text-xs font-medium text-foreground/80 mb-1.5 block">
                  Experience
                </Label>
                <div className="relative">
                  <Input
                    id={`experience-${id}`}
                    type="number"
                    min="0"
                    value={editedExperience}
                    onChange={(e) => setEditedExperience(e.target.value)}
                    onBlur={(e) => setEditedExperience(e.target.value ? formatExperience(e.target.value) : '')}
                    placeholder="e.g., 5"
                    className="h-10 bg-[#2A2A2A] border border-gray-700 text-white placeholder-gray-400 pr-12 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                    {editedExperience === '1' ? 'year' : 'years'}
                  </span>
                </div>
              </div>
              
              <div className="col-span-3">
                <Label htmlFor={`level-${id}`} className="text-xs font-medium text-foreground/80 mb-1.5 block">
                  Skill Level
                </Label>
                <div className="relative">
                  <select
                    id={`level-${id}`}
                    value={editedLevel}
                    onChange={(e) => setEditedLevel(e.target.value)}
                    className="flex h-10 w-full appearance-none rounded-md border border-gray-700 bg-[#2A2A2A] pl-9 pr-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <ChevronDown className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor={`description-${id}`} className="text-xs font-medium text-foreground/80 mb-1.5 block">
                Description <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id={`description-${id}`}
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="min-h-[80px] bg-[#2A2A2A] border border-gray-700 text-white placeholder-gray-400"
                placeholder="How can you help with this skill?"
              />
            </div>
          </div>
          
          <div className="flex justify-center gap-3 pt-2">
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="h-9 text-muted-foreground hover:bg-transparent hover:text-muted-foreground"
            >
              Cancel
            </Button>
            <Button 
              variant="default"
              size="sm"
              onClick={handleSave}
              className="h-9 rounded-lg !important"
              style={{ borderRadius: '0.5rem' }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="group relative flex flex-col w-full bg-gradient-to-r from-[#2A2A2A] to-[#252525] rounded-xl border border-white/5 hover:border-white/10 transition-all duration-200 hover:shadow-lg hover:shadow-black/10 overflow-hidden"
    >
      <div 
        className="flex items-center gap-3 p-3 w-full cursor-pointer"
        onClick={handleClick}
      >
        <div className="drag-handle" {...listeners}>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-muted-foreground cursor-grab active:cursor-grabbing hover:bg-white/5"
          >
            <GripVertical className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-semibold text-foreground">
                  {skill}
                </h3>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                {level && (
                  <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${
                    level === 'Expert' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                    level === 'Intermediate' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                    'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                    <span>{level}</span>
                  </span>
                )}
                {experience && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{experience}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 self-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-red-400 hover:bg-red-500/20 hover:text-red-400"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

        </div>
      </div>
      
      {/* Skill Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="w-[90vw] max-w-[400px] bg-[#1E1E1E] border border-white/10 rounded-xl overflow-hidden p-0">
          <div className="relative">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-[#2A2A2A] to-[#252525] p-6 pb-4">
              <div className="text-center">
                <DialogTitle className="text-2xl font-bold text-white">{skill}</DialogTitle>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 pt-4">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-400">SKILL DETAILS</h4>
                  <div className="bg-[#252525] rounded-lg p-4">
                    {description ? (
                      <p className="text-gray-200 leading-relaxed">{description}</p>
                    ) : (
                      <p className="text-gray-400 italic">No description provided</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-400">EXPERIENCE</h4>
                    <div className="bg-[#252525] rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-200">{experience || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-400">SKILL LEVEL</h4>
                    <div className="bg-[#252525] rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${
                          level === 'Expert' ? 'bg-yellow-400' :
                          level === 'Intermediate' ? 'bg-blue-400' : 'bg-green-400'
                        }`} />
                        <span className="text-gray-200">{level}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-xs text-gray-500">
                  Last updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

SkillItem.displayName = 'SkillItem';

const defaultSkills: SkillItemType[] = [
  {
    id: '1',
    name: "Batting",
    description: "Specialized in top-order batting with solid technique and aggressive stroke play.",
    experience: "5 years",
    level: "Intermediate"
  },
  {
    id: '2',
    name: "Off Spin",
    description: "Skilled off-spin bowler with excellent control and variation.",
    experience: "3 years",
    level: "Expert"
  },
  {
    id: '3',
    name: "AI Development",
    description: "Expert in developing machine learning models and AI solutions.",
    experience: "2 years",
    level: "Expert"
  }
];

export function SkillsSection({ 
  initialSkills = defaultSkills,
  className 
}: { initialSkills?: Array<string | SkillItemType>; className?: string }) {
  const [skills, setSkills] = useState<SkillItemType[]>(
    initialSkills.map(skill => ({
      id: Math.random().toString(36).substr(2, 9),
      name: typeof skill === 'string' ? skill : skill.name,
      description: typeof skill === 'object' ? skill.description : undefined,
      experience: typeof skill === 'object' ? skill.experience : undefined,
      level: (typeof skill === 'object' ? skill.level : 'Intermediate') as 'Beginner' | 'Intermediate' | 'Expert'
    }))
  );
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newExperience, setNewExperience] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLevel, setNewLevel] = useState<'Beginner' | 'Intermediate' | 'Expert'>('Intermediate');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.some(s => s.name.toLowerCase() === newSkill.toLowerCase())) {
      const formattedExp = newExperience ? formatExperience(newExperience) : '';
      setSkills(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: newSkill.trim(),
          description: newDescription.trim() || undefined,
          experience: formattedExp,
          level: newLevel
        }
      ]);
      setNewSkill('');
      setNewExperience('');
      setNewDescription('');
      setNewLevel('Intermediate');
      setIsDialogOpen(false);
    }
  };

  const handleEditSkill = (id: string, newName: string, newDescription?: string, newExperience?: string, newLevel?: string) => {
    const formattedExp = newExperience ? formatExperience(newExperience) : '';
    setSkills(prev => 
      prev.map(skill => 
        skill.id === id ? { 
          ...skill, 
          name: newName, 
          description: newDescription,
          experience: formattedExp,
          level: (newLevel || 'Intermediate') as 'Beginner' | 'Intermediate' | 'Expert'
        } : skill
      )
    );
  };

  const handleDeleteSkill = (id: string) => {
    setSkills(prev => prev.filter(skill => skill.id !== id));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setSkills((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id.toString());
        const newIndex = items.findIndex(item => item.id === over.id.toString());
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
            <Button 
              variant="default" 
              size="sm" 
              className="w-full h-10 gap-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center rounded-lg"
              style={{ borderRadius: '0.5rem' }}
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Add Skill</span>
            </Button>
        </DialogTrigger>
        <DialogContent className="w-[calc(100%-2rem)] max-w-2xl mx-auto bg-[#1E1E1E] border-white/5 rounded-xl p-0 overflow-hidden">
          <div className="p-6 space-y-6">
            <DialogHeader className="text-left">
              <DialogTitle className="text-xl font-bold text-foreground">Add New Skill</DialogTitle>
              <p className="text-sm mt-1.5 font-normal" style={{ opacity: 0.6 }}>
                Add the skills that best represent your expertise. Be specific to attract the right clients for your services.
              </p>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-skill" className="text-xs font-medium text-foreground/80 mb-1.5 block">
                  Skill Name
                </Label>
                <Input
                  id="new-skill"
                  placeholder="e.g., Pet Care"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="h-10 bg-[#2A2A2A] border border-gray-700 text-white placeholder-gray-400"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                />
              </div>
              
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="experience" className="text-xs font-medium text-foreground/80 mb-1.5 block">
                    Experience
                  </Label>
                  <div className="relative">
                    <Input
                      id="experience"
                      type="number"
                      min="0"
                      value={newExperience}
                      onChange={(e) => setNewExperience(e.target.value)}
                      onBlur={(e) => setNewExperience(e.target.value ? formatExperience(e.target.value) : '')}
                      placeholder="e.g., 3"
                      className="h-10 bg-[#2A2A2A] border border-gray-700 text-white placeholder-gray-400 pr-12 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                      {newExperience === '1' ? 'year' : 'years'}
                    </span>
                  </div>
                </div>
                
                <div className="col-span-3">
                  <Label htmlFor="level" className="text-xs font-medium text-foreground/80 mb-1.5 block">
                    Skill Level
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </div>
                    <select
                      id="level"
                      value={newLevel}
                      onChange={(e) => setNewLevel(e.target.value as 'Beginner' | 'Intermediate' | 'Expert')}
                      className="flex h-10 w-full rounded-md border border-gray-700 bg-[#2A2A2A] pl-10 pr-3 py-2 text-sm text-white ring-offset-background appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description" className="text-xs font-medium text-foreground/80 mb-1.5 block">
                  Description <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="min-h-[120px] bg-[#2A2A2A] border border-gray-700 text-white placeholder-gray-400"
                  placeholder="Describe your skills and experience (e.g., 'Certified pet care specialist with 5+ years of experience in dog walking, pet sitting, and basic grooming')"
                />
              </div>
            </div>
            
            <div className="flex justify-center gap-3 pt-2">
              <DialogClose asChild>
                <Button variant="ghost" size="sm" className="h-9 text-muted-foreground hover:bg-transparent hover:text-foreground">
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                variant="default"
                size="sm"
                onClick={handleAddSkill}
                className="h-9 px-6 rounded-lg !important"
                style={{ borderRadius: '0.5rem' }}
                disabled={!newSkill.trim()}
              >
                Add Skill
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {skills.length > 0 ? (
        <div className="space-y-3">
          <div className="mt-4 mb-2 text-xs text-muted-foreground text-center">
            <p>Drag <GripVertical className="h-3 w-3 inline-block mx-0.5" /> to reorder your skills - list your strongest skills first</p>
          </div>
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={skills.map(skill => skill.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {skills.map((skill) => (
                  <SkillItem
                    key={skill.id}
                    id={skill.id}
                    skill={skill.name}
                    description={skill.description}
                    experience={skill.experience}
                    level={skill.level}
                    onEdit={handleEditSkill}
                    onDelete={handleDeleteSkill}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
            <Plus className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="text-foreground font-medium mb-1">No skills added yet</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            Start by adding your top skills to highlight your expertise
          </p>
        </div>
      )}
    </div>
  );
}
