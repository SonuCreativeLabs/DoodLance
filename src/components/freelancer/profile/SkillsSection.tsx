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
          <Badge 
            variant="secondary" 
            className="bg-white/5 text-white/90 border border-white/10 hover:bg-white/10 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 group-hover:border-white/20"
          >
            {skill}
            {description && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 ml-1 -mr-1 text-white/50 hover:text-white hover:bg-transparent"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Info className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs bg-gray-800 text-white border border-white/10">
                    <p className="text-sm">{description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 ml-0.5 text-white/50 hover:text-white hover:bg-transparent"
              onClick={() => {
                setEditedSkill(skill);
                setEditedDescription(description || '');
                setIsEditing(true);
              }}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 text-white/50 hover:text-red-400 hover:bg-transparent"
              onClick={() => onDelete(id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
        {!description && (
          <p className="text-xs text-white/40 mt-1 ml-1">
            <button 
              className="hover:text-white/60 underline underline-offset-2"
              onClick={() => {
                setEditedSkill(skill);
                setEditedDescription('');
                setIsEditing(true);
              }}
            >
              Add description
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

interface SkillsSectionProps {
  initialSkills?: string[];
  className?: string;
}

export function SkillsSection({ 
  initialSkills = [
    "Cricket (Top Order Bat & Off Spin)",
    "AI Development",
    "AI Agents",
    "Prompt Engineering",
    "Vibe Code"
  ],
  className 
}: SkillsSectionProps) {
  const [skills, setSkills] = useState<{id: string; name: string}[]>(
    initialSkills.map(skill => ({
      id: Math.random().toString(36).substr(2, 9),
      name: skill
    }))
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
