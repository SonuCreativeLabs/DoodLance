import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Briefcase, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  return (
    <Card className="bg-[#1E1E1E] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Work Experience</CardTitle>
        <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10">
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
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
                <div className="flex items-center gap-4 mt-1 text-sm text-white/50">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {exp.location}
                  </span>
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
