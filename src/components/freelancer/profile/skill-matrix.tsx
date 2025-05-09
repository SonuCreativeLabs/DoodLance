'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  experience: number; // 1-50 scale
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
      <section className="max-w-2xl mx-auto w-full px-2 md:px-0 text-neutral-100">
        <h2 className="text-xl font-semibold text-neutral-100 mb-6">Skills</h2>
        <div className="flex items-center gap-3 mb-6">
          <Input
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            placeholder="Add a new skill"
            className="flex-1 bg-neutral-900 border border-neutral-700 text-neutral-100 placeholder:text-neutral-400 focus:ring-purple-300"
          />
          <Button onClick={handleAddSkill} size="sm" className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm rounded-lg">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-3">
          {skills.map(skill => (
            <div key={skill.id} className="flex items-center justify-between border-b border-neutral-700 py-3">
              <div>
                <div className="font-medium text-neutral-100">{skill.name}</div>
                <div className="text-xs text-neutral-400">Experience: {skill.experience} {skill.experience === 1 ? 'year' : 'years'}+</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={skill.experience}
                    onChange={e => handleExperienceChange(skill.id, Number(e.target.value))}
                    className="w-16 bg-neutral-900 border border-neutral-700 text-neutral-100 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-sm"
                  />
                  <span className="text-xs text-neutral-300">years</span>
                </div>
                <Button onClick={() => handleRemoveSkill(skill.id)} size="sm" className="bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-neutral-300 rounded-full p-2">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 