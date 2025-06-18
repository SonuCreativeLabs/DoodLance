import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SkillsSectionProps {
  skills: string[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <Card className="bg-[#1E1E1E] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Skills & Expertise</CardTitle>
        <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10">
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="bg-white/5 text-white/90 border border-white/10 hover:bg-white/10 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              {skill}
            </Badge>
          ))}
        </div>
        <div className="mt-4 text-sm text-white/60">
          <p>Top skills are shown first. Reorder your skills to highlight your expertise.</p>
        </div>
      </CardContent>
    </Card>
  );
}
