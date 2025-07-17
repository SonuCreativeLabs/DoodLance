"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Cake, 
  Info,
  Pencil,
  Check,
  X,
  Map as MapIcon,
  Smartphone,
  Calendar,
  User as UserIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Briefcase,
  VenetianMask,
  Asterisk,
  CircleUser,
  Quote
} from 'lucide-react';
import Link from "next/link";
import { cn } from "@/lib/utils";

type PersonalInfo = {
  fullName: string;
  jobTitle: string;
  gender: string;
  dateOfBirth: string;
  bio: string;
};

type ContactInfo = {
  email: string;
  phone: string;
  website: string;
};

type LocationInfo = {
  address: string;
  city: string;
  country: string;
  postalCode: string;
};

interface SectionCardProps {
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode;
  onEdit?: () => void;
  isEditing?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  className?: string;
}

const SectionCard = ({ 
  title, 
  icon: Icon, 
  children,
  onEdit,
  isEditing,
  onSave,
  onCancel,
  className = ''
}: SectionCardProps) => (
  <div className="bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 shadow-lg shadow-purple-900/10 hover:shadow-purple-900/20">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="text-purple-400">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {onEdit && (
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={onSave}
                className="text-green-500 hover:bg-green-500/10 hover:text-green-400 h-8 px-3"
              >
                <Check className="h-4 w-4 mr-1" /> Save
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={onCancel}
                className="text-red-500 hover:bg-red-500/10 hover:text-red-400 h-8 px-3"
              >
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </>
          ) : (
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={onEdit}
              className="text-gray-400 hover:bg-gray-500/10 hover:text-gray-300 h-8 w-8"
              aria-label="Edit"
            >
              <Pencil className="h-4 w-4 text-current" />
            </Button>
          )}
        </div>
      )}
    </div>
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  </div>
);

const FormField = ({ 
  label, 
  icon: Icon, 
  children,
  className = ''
}: { 
  label: string; 
  icon?: React.ElementType; 
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-2", className)}>
    <Label className="text-sm font-medium text-white/70">
      {label}
    </Label>
    <div className="relative">
      {children}
    </div>
  </div>
);

type EditSection = 'personal' | 'contact' | 'location' | null;

export default function PersonalDetailsPage() {
  const [editingSection, setEditingSection] = useState<EditSection>(null);
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: "Sathish Sonu",
    jobTitle: "Cricketer & AI Engineer",
    gender: "Male",
    dateOfBirth: "1990-01-15",
    bio: "Professional Cricketer & AI Engineer with a passion for technology and sports."
  });
  
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "sathish.sonu@example.com",
    phone: "+91 98765 43210",
    website: "sathishsonu.com"
  });

  const [locationInfo, setLocationInfo] = useState<LocationInfo>({
    address: "123 Cricket Street",
    city: "Chennai",
    country: "India",
    postalCode: "600001"
  });

  const [editPersonalInfo, setEditPersonalInfo] = useState<PersonalInfo>({ ...personalInfo });
  const [editContact, setEditContact] = useState<ContactInfo>({ ...contactInfo });
  const [editLocation, setEditLocation] = useState<LocationInfo>({ ...locationInfo });

  const handleSave = (section: EditSection) => {
    if (section === 'personal') {
      setPersonalInfo({ ...editPersonalInfo });
    } else if (section === 'contact') {
      setContactInfo({ ...editContact });
    } else if (section === 'location') {
      setLocationInfo({ ...editLocation });
    }
    setEditingSection(null);
  };

  const handleCancel = (section: EditSection) => {
    if (section === 'personal') {
      setEditPersonalInfo({ ...personalInfo });
    } else if (section === 'contact') {
      setEditContact({ ...contactInfo });
    } else if (section === 'location') {
      setEditLocation({ ...locationInfo });
    }
    setEditingSection(null);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, section: 'personal' | 'contact' | 'location', field: string) => {
    const value = e.target.value;
    
    if (section === 'personal') {
      setEditPersonalInfo({
        ...editPersonalInfo,
        [field]: value
      });
    } else if (section === 'contact') {
      setEditContact({
        ...editContact,
        [field]: value
      });
    } else {
      setEditLocation({
        ...editLocation,
        [field]: value
      });
    }
  };

  const startEditing = (section: EditSection) => {
    setEditingSection(section);
    // Reset edit states when starting to edit
    setEditPersonalInfo({ ...personalInfo });
    setEditContact({ ...contactInfo });
    setEditLocation({ ...locationInfo });
  };

  const formatFullAddress = (loc: LocationInfo) => {
    return `${loc.address}, ${loc.city}, ${loc.country} ${loc.postalCode}`;
  };

  const renderSection = (section: EditSection) => {
    if (editingSection !== null && editingSection !== section) {
      return null; // Hide other sections when one is being edited
    }
    
    const isEditing = editingSection === section;
    
    if (section === 'personal') {
      return (
        <SectionCard 
          key="personal"
          title="Personal Information" 
          icon={User}
          onEdit={!isEditing ? () => startEditing('personal') : undefined}
          isEditing={isEditing}
          onSave={() => handleSave('personal')}
          onCancel={() => handleCancel('personal')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isEditing ? (
              <>
                <div className="space-y-4">
                  <FormField label="Full Name">
                    <Input
                      value={editPersonalInfo.fullName}
                      onChange={(e) => handleInputChange(e, 'personal', 'fullName')}
                      className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                    />
                  </FormField>
                  <FormField label="Job Title">
                    <Input
                      value={editPersonalInfo.jobTitle}
                      onChange={(e) => handleInputChange(e, 'personal', 'jobTitle')}
                      className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                      placeholder="e.g., Web Developer, Designer"
                    />
                  </FormField>
                  <FormField label="Gender">
                    <div className="relative">
                      <select
                        value={editPersonalInfo.gender}
                        onChange={(e) => handleInputChange(e, 'personal', 'gender')}
                        className="flex h-10 w-full rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E1E1E] transition-colors cursor-pointer appearance-none pr-10"
                      >
                      <option value="Male" className="bg-[#1E1E1E] text-white">Male</option>
                      <option value="Female" className="bg-[#1E1E1E] text-white">Female</option>
                      <option value="Other" className="bg-[#1E1E1E] text-white">Other</option>
                        <option value="Prefer not to say" className="bg-[#1E1E1E] text-white">Prefer not to say</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </div>
                  </FormField>
                </div>
                
                <div className="space-y-4">
                  <FormField label="Date of Birth">
                    <Input
                      type="date"
                      value={editPersonalInfo.dateOfBirth}
                      onChange={(e) => handleInputChange(e, 'personal', 'dateOfBirth')}
                      className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50 [&::-webkit-calendar-picker-indicator]:invert"
                    />
                  </FormField>
                  
                  <FormField label="Bio">
                    <Textarea
                      value={editPersonalInfo.bio}
                      onChange={(e) => handleInputChange(e, 'personal', 'bio')}
                      className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                    />
                  </FormField>
                  
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex justify-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleCancel('personal')}
                        className="h-10 px-8 rounded-xl border-white/10 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleSave('personal')}
                        className="h-10 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-purple-500/30 transition-all"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-1">
      <p className="text-sm font-medium text-white/70 mb-0.5">Full Name</p>
      <div className="flex items-center gap-2">
        <CircleUser className="h-4 w-4 text-white/60" />
        <span className="text-white/90 font-medium text-base">{personalInfo.fullName}</span>
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-sm font-medium text-white/70 mb-0.5">Job Title</p>
      <div className="flex items-center gap-2">
        <Briefcase className="h-4 w-4 text-white/60" />
        <span className="text-white/90 font-medium text-base">{personalInfo.jobTitle || <span className="text-white/40">Not set</span>}</span>
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-sm font-medium text-white/70 mb-0.5">Gender</p>
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-white/60" />
        <span className="text-white/90">{personalInfo.gender}</span>
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-sm font-medium text-white/70 mb-0.5">Date of Birth</p>
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-white/60" />
        <span className="text-white/90">
          {new Date(personalInfo.dateOfBirth).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
      </div>
    </div>
    <div className="space-y-1 md:col-span-2">
      <p className="text-sm font-medium text-white/70 mb-0.5">Bio</p>
      <div className="flex items-start gap-2">
        <Quote className="h-6 w-6 text-white/60" />
        <span className="text-white/80 whitespace-pre-line">{personalInfo.bio}</span>
      </div>
    </div>
  </div>
</>
            )}
          </div>
        </SectionCard>
      );
    } else if (section === 'contact') {
      return (
        <SectionCard 
          key="contact"
          title="Contact Information" 
          icon={MailIcon} className="text-white/60"
          onEdit={!isEditing ? () => startEditing('contact') : undefined}
          isEditing={isEditing}
          onSave={() => handleSave('contact')}
          onCancel={() => handleCancel('contact')}
        >
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Email" icon={MailIcon} className="text-white/60">
                  <Input
                    type="email"
                    value={editContact.email}
                    onChange={(e) => handleInputChange(e, 'contact', 'email')}
                    className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                  />
                </FormField>
                
                <FormField label="Phone" icon={PhoneIcon} className="text-white/60">
                  <Input
                    type="tel"
                    value={editContact.phone}
                    onChange={(e) => handleInputChange(e, 'contact', 'phone')}
                    className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                  />
                </FormField>
              </div>
              
              <FormField label="Website" icon={Globe} className="text-white/60">
                <Input
                  type="url"
                  value={editContact.website}
                  onChange={(e) => handleInputChange(e, 'contact', 'website')}
                  className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                  placeholder="https://example.com"
                />
              </FormField>

              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex justify-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleCancel('contact')}
                    className="px-4 py-2 text-sm font-medium text-white/90 border border-white/20 hover:border-white/30 rounded-md transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleSave('contact')}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-white/70 mb-1">Email</p>
                <div className="text-white/90 inline-flex items-center gap-1.5">
                  <MailIcon className="h-4 w-4 text-white/60" />
                  {contactInfo.email}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-white/70 mb-1">Phone</p>
                <div className="text-white/90 inline-flex items-center gap-1.5">
                  <PhoneIcon className="h-4 w-4 text-white/60" />
                  {contactInfo.phone}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-white/70 mb-1">Website</p>
                <div className="text-white/90 inline-flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-white/60" />
                  {contactInfo.website.replace(/^https?:\/\//, '')}
                </div>
              </div>
            </div>
          )}
        </SectionCard>
      );
    } else if (section === 'location') {
      return (
        <SectionCard 
          key="location"
          title="Location" 
          icon={MapPin}
          onEdit={!isEditing ? () => startEditing('location') : undefined}
          isEditing={isEditing}
          onSave={() => handleSave('location')}
          onCancel={() => handleCancel('location')}
          className="space-y-4"
        >
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Address">
                  <Input
                    value={editLocation.address}
                    onChange={(e) => handleInputChange(e, 'location', 'address')}
                    className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                  />
                </FormField>
                
                <FormField label="City">
                  <Input
                    value={editLocation.city}
                    onChange={(e) => handleInputChange(e, 'location', 'city')}
                    className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                  />
                </FormField>
                
                <FormField label="Country">
                  <Input
                    value={editLocation.country}
                    onChange={(e) => handleInputChange(e, 'location', 'country')}
                    className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                  />
                </FormField>
                
                <FormField label="Postal Code">
                  <Input
                    value={editLocation.postalCode}
                    onChange={(e) => handleInputChange(e, 'location', 'postalCode')}
                    className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                  />
                </FormField>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleCancel('location')}
                    className="h-10 px-8 rounded-xl border-white/10 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleSave('location')}
                    className="h-10 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-purple-500/30 transition-all"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-white/90 font-medium">{locationInfo.address}</p>
                <p className="text-white/70 text-sm mt-1">
                  {locationInfo.city}, {locationInfo.country} {locationInfo.postalCode}
                </p>
              </div>
              <div className="pt-1">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatFullAddress(locationInfo))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors group"
                >
                  <span className="inline-flex items-center px-3 py-1.5 bg-white/5 rounded-full border border-white/10 group-hover:border-purple-500/30 transition-colors">
                    <MapPinIcon className="h-3.5 w-3.5 mr-1.5" />
                    View on Map
                  </span>
                </a>
              </div>
            </div>
          )}
        </SectionCard>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="flex items-center space-x-4">
            <Link 
              href="/freelancer/profile" 
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 group"
              onClick={(e) => {
                if (editingSection !== null) {
                  e.preventDefault();
                  handleCancel(editingSection);
                }
              }}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors duration-200">
                <ArrowLeft className="h-4 w-4" />
              </div>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Personal Details</h1>
              <p className="text-white/60 text-sm mt-0.5">Manage your personal information and contact details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {editingSection === null ? (
          // Show all sections in view mode
          <>
            {renderSection('personal')}
            {renderSection('contact')}
            {renderSection('location')}
          </>
        ) : (
          // Show only the section being edited
          renderSection(editingSection)
        )}
      </div>
    </div>
  );
}
