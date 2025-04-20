'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Plus, X } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  experience: number; // 1-5 scale
}

export function SkillMatrix() {
  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: 'Plumbing', experience: 4 },
    { id: '2', name: 'Electrical', experience: 3 },
    { id: '3', name: 'Carpentry', experience: 2 }
  ]);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    setSkills(prev => [...prev, {
      id: Date.now().toString(),
      name: newSkill.trim(),
      experience: 1
    }]);
    setNewSkill('');
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(prev => prev.filter(skill => skill.id !== id));
  };

  const handleExperienceChange = (id: string, value: number) => {
    setSkills(prev => prev.map(skill => 
      skill.id === id ? { ...skill, experience: value } : skill
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add new skill"
          className="flex-1"
        />
        <Button onClick={handleAddSkill}>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="space-y-4">
        {skills.map(skill => (
          <div key={skill.id} className="bg-white p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{skill.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveSkill(skill.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Experience Level</span>
                <span>{skill.experience} {skill.experience === 1 ? 'year' : 'years'}+</span>
              </div>
              <Slider
                value={[skill.experience]}
                onValueChange={([value]) => handleExperienceChange(skill.id, value)}
                min={1}
                max={5}
                step={1}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 