import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Mail, Phone, Globe, MapPin, Briefcase, GraduationCap, Award, Languages } from 'lucide-react';

interface ProfileDetailsCardProps {
  email: string;
  phone: string;
  website: string;
  location: string;
  experience: string;
  education: string;
  languages: string[];
  certifications: string[];
  onEdit?: () => void;
}

export function ProfileDetailsCard({
  email,
  phone,
  website,
  location,
  experience,
  education,
  languages,
  certifications,
  onEdit
}: ProfileDetailsCardProps) {
  const DetailItem = ({ icon, text }: { icon: React.ReactNode, text: string | string[] }) => (
    <div className="flex items-start gap-3">
      <div className="text-purple-400 mt-0.5">{icon}</div>
      <div className="text-sm text-white/80">
        {Array.isArray(text) ? text.join(", ") : text}
      </div>
    </div>
  );

  return (
    <Card className="bg-[#1E1E1E] border-[#333333] text-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Personal Details</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onEdit}
            className="text-purple-400 hover:text-purple-300 h-8 w-8 p-0"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white/60 mb-2">Contact Information</h3>
          <div className="space-y-2">
            <DetailItem icon={<Mail className="h-4 w-4" />} text={email} />
            <DetailItem icon={<Phone className="h-4 w-4" />} text={phone} />
            <DetailItem icon={<Globe className="h-4 w-4" />} text={website} />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white/60 mb-2">Location</h3>
          <DetailItem icon={<MapPin className="h-4 w-4" />} text={location} />
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white/60 mb-2">Experience</h3>
          <DetailItem icon={<Briefcase className="h-4 w-4" />} text={experience} />
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white/60 mb-2">Education</h3>
          <DetailItem icon={<GraduationCap className="h-4 w-4" />} text={education} />
        </div>

        {languages.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white/60 mb-2">Languages</h3>
            <DetailItem icon={<Languages className="h-4 w-4" />} text={languages} />
          </div>
        )}

        {certifications.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white/60 mb-2">Certifications</h3>
            <div className="space-y-2">
              {certifications.map((cert, index) => (
                <DetailItem key={index} icon={<Award className="h-4 w-4" />} text={cert} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
