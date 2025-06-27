'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, GripVertical, Pencil, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SkillItem {
  id: string;
  name: string;
  description?: string;
}

interface SkillItemProps {
  id: string;
  skill: string;
  description?: string;
  onEdit: (id: string, newSkill: string, newDescription?: string) => void;
  onDelete: (id: string) => void;
}

function SkillItem({ id, skill, description, onEdit, onDelete }: SkillItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSkill, setEditedSkill] = useState(skill);
  const [editedDescription, setEditedDescription] = useState(description || '');
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    if (editedSkill.trim()) {
      onEdit(id, editedSkill, editedDescription);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 bg-white/5 p-3 rounded-lg mb-2">
        <div className="space-y-2">
          <div>
            <Label htmlFor={`skill-${id}`} className="text-xs text-white/70 mb-1 block">Skill Name</Label>
            <Input
              id={`skill-${id}`}
              value={editedSkill}
              onChange={(e) => setEditedSkill(e.target.value)}
              className="h-9 bg-white/5 border-white/10 text-white"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
          <div>
            <Label htmlFor={`description-${id}`} className="text-xs text-white/70 mb-1 block">
              Description <span className="text-white/50">(optional)</span>
            </Label>
            <Textarea
              id={`description-${id}`}
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="min-h-[80px] bg-white/5 border-white/10 text-white"
              placeholder="How can you help with this skill? (e.g., 'I can teach car driving with my own car')"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(false)} 
            className="border-white/10"
          >
            Cancel
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Save Changes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="flex items-start gap-1 group">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-white/30 hover:bg-white/5 hover:text-white/60 cursor-grab active:cursor-grabbing mt-1.5"
        {...listeners}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </Button>
      <div className="flex-1">
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="group relative"
              onClick={() => {
                setEditedSkill(skill);
                setEditedDescription(description || '');
                setIsEditing(true);
              }}
            >
              <Badge 
                variant="secondary" 
                className="bg-white/5 text-white/90 border border-white/10 hover:bg-white/10 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors group-hover:border-white/20 pr-8"
              >
                <div className="flex items-center gap-1.5">
                  <span>{skill}</span>
                  {description && (
                    <TooltipProvider>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <div 
                            className="h-4 w-4 flex-shrink-0 flex items-center justify-center text-white/50 group-hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Info className="h-3 w-3" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent 
                          side="top" 
                          sideOffset={4}
                          className="max-w-xs bg-[var(--card-background)] text-[var(--card-foreground)] text-sm p-3 rounded-lg border border-[var(--border)] shadow-lg"
                        >
                          <p className="leading-relaxed">{description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </Badge>
              <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Pencil className="h-3 w-3 text-white/60" />
              </div>
            </button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full text-white/60 hover:text-red-400 hover:bg-red-400/10 ml-0.5"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SkillItemType {
  id: string;
  name: string;
  description?: string;
}

interface SkillsSectionProps {
  initialSkills?: Array<string | SkillItemType>;
  className?: string;
}

const defaultSkills: SkillItemType[] = [
  {
    id: 'batting',
    name: "Batting",
    description: "Specialized in top-order batting with a solid technique and aggressive stroke play. Strong in building innings and adapting to different match situations and bowling attacks."
  },
  {
    id: 'off-spin',
    name: "Off Spin",
    description: "Skilled off-spin bowler with excellent control and variation. Specialized in building pressure and taking crucial wickets in the middle overs of limited-overs cricket."
  },
  {
    id: 'ai-dev',
    name: "AI Development",
    description: "Expert in developing machine learning models and AI solutions using Python, TensorFlow, and PyTorch. Experience in building and deploying AI applications at scale."
  },
  {
    id: 'ai-agents',
    name: "AI Agents",
    description: "Design and implementation of autonomous AI agents using reinforcement learning and natural language processing. Specialized in creating agents that can reason, learn, and adapt."
  },
  {
    id: 'prompt-eng',
    name: "Prompt Engineering",
    description: "Expert in crafting effective prompts for large language models. Specialized in optimizing model outputs for various applications including content generation and data analysis."
  },
  {
    id: 'vibe-code',
    name: "Vibe Code",
    description: "Creating clean, efficient, and maintainable code with a focus on developer experience and code aesthetics. Strong advocate for clean architecture and best practices."
  }
] as SkillItemType[];

export function SkillsSection({ 
  initialSkills = defaultSkills,
  className 
}: SkillsSectionProps) {
  const [skills, setSkills] = useState<SkillItemType[]>(
    initialSkills.map(skill => ({
      id: Math.random().toString(36).substr(2, 9),
      name: typeof skill === 'string' ? skill : skill.name,
      description: typeof skill === 'object' ? skill.description : undefined
    } as SkillItemType))
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.some(s => s.name.toLowerCase() === newSkill.toLowerCase())) {
      setSkills(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: newSkill.trim()
        }
      ]);
      setNewSkill('');
      setIsDialogOpen(false);
    }
  };

  const handleEditSkill = (id: string, newName: string) => {
    setSkills(prev => 
      prev.map(skill => 
        skill.id === id ? { ...skill, name: newName } : skill
      )
    );
  };

  const handleDeleteSkill = (id: string) => {
    setSkills(prev => prev.filter(skill => skill.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
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
    <Card className={`bg-[#1E1E1E] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Skills & Expertise</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10">
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1E1E1E] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Skill</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter a skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              />
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline" className="border-white/10">Cancel</Button>
                </DialogClose>
                <Button 
                  onClick={handleAddSkill}
                  disabled={!newSkill.trim() || skills.some(s => s.name.toLowerCase() === newSkill.toLowerCase())}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Add Skill
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={skills.map(skill => skill.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {skills.map((skill) => (
                <SkillItem
                  key={skill.id}
                  id={skill.id}
                  skill={skill.name}
                  description={skill.description}
                  onEdit={handleEditSkill}
                  onDelete={handleDeleteSkill}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <div className="mt-4 text-sm text-white/60">
          <p>Drag to reorder your skills. Top skills are shown first to highlight your expertise.</p>
        </div>
      </CardContent>
    </Card>
  );
}
