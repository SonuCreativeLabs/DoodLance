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
  MapPin as MapPinIcon
} from 'lucide-react';
import Link from "next/link";
import { cn } from "@/lib/utils";

type PersonalInfo = {
  fullName: string;
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

const SectionCard = ({ 
  title, 
  icon: Icon, 
  children,
  onEdit,
  isEditing,
  onSave,
  onCancel
}: { 
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode;
  onEdit?: () => void;
  isEditing?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}) => (
  <div className="bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 shadow-lg shadow-purple-900/10 hover:shadow-purple-900/20">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-purple-900/20 text-purple-400">
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
              className="text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 h-8 w-8"
              aria-label="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
    <div className="space-y-4">
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
  icon: React.ElementType; 
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-2", className)}>
    <Label className="flex items-center gap-2 text-sm font-medium text-white/70">
      <Icon className="h-4 w-4 text-purple-400" />
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
                  <FormField label="Full Name" icon={UserIcon}>
                    <Input
                      value={editPersonalInfo.fullName}
                      onChange={(e) => handleInputChange(e, 'personal', 'fullName')}
                      className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                    />
                  </FormField>
                  
                  <FormField label="Gender" icon={User}>
                    <select
                      value={editPersonalInfo.gender}
                      onChange={(e) => handleInputChange(e, 'personal', 'gender')}
                      className="flex h-10 w-full rounded-md border border-input bg-white/5 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </FormField>
                </div>
                
                <div className="space-y-4">
                  <FormField label="Date of Birth" icon={Calendar}>
                    <Input
                      type="date"
                      value={editPersonalInfo.dateOfBirth}
                      onChange={(e) => handleInputChange(e, 'personal', 'dateOfBirth')}
                      className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                    />
                  </FormField>
                  
                  <FormField label="Bio" icon={Info}>
                    <Textarea
                      value={editPersonalInfo.bio}
                      onChange={(e) => handleInputChange(e, 'personal', 'bio')}
                      className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                    />
                  </FormField>
                  
                  <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-white/10">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleCancel('personal')}
                      className="px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/5 border border-white/20 hover:border-white/30 transition-colors"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleSave('personal')}
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors rounded-md shadow-sm"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-white/70 mb-1">Full Name</p>
                    <p className="text-white">{personalInfo.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/70 mb-1">Gender</p>
                    <p className="text-white/90">{personalInfo.gender}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-white/70 mb-1">Date of Birth</p>
                    <p className="text-white/90">
                      {new Date(personalInfo.dateOfBirth).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/70 mb-1">Bio</p>
                    <p className="text-white/80 whitespace-pre-line">{personalInfo.bio}</p>
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
          icon={Mail}
          onEdit={!isEditing ? () => startEditing('contact') : undefined}
          isEditing={isEditing}
          onSave={() => handleSave('contact')}
          onCancel={() => handleCancel('contact')}
        >
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Email" icon={MailIcon}>
                  <Input
                    type="email"
                    value={editContact.email}
                    onChange={(e) => handleInputChange(e, 'contact', 'email')}
                    className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                  />
                </FormField>
                
                <FormField label="Phone" icon={PhoneIcon}>
                  <Input
                    type="tel"
                    value={editContact.phone}
                    onChange={(e) => handleInputChange(e, 'contact', 'phone')}
                    className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                  />
                </FormField>
              </div>
              
              <FormField label="Website" icon={Globe}>
                <Input
                  type="url"
                  value={editContact.website}
                  onChange={(e) => handleInputChange(e, 'contact', 'website')}
                  className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                  placeholder="https://example.com"
                />
              </FormField>

              <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleCancel('contact')}
                  className="px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/5 border border-white/20 hover:border-white/30 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => handleSave('contact')}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors rounded-md shadow-sm"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-white/70 mb-1">Email</p>
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="text-purple-300 hover:text-purple-200 hover:underline inline-flex items-center gap-1.5"
                >
                  <MailIcon className="h-4 w-4" />
                  {contactInfo.email}
                </a>
              </div>
              
              <div>
                <p className="text-sm font-medium text-white/70 mb-1">Phone</p>
                <a 
                  href={`tel:${contactInfo.phone.replace(/\D/g, '')}`}
                  className="text-white/90 hover:text-white hover:underline inline-flex items-center gap-1.5"
                >
                  <PhoneIcon className="h-4 w-4" />
                  {contactInfo.phone}
                </a>
              </div>
              
              <div>
                <p className="text-sm font-medium text-white/70 mb-1">Website</p>
                <a 
                  href={contactInfo.website.startsWith('http') ? contactInfo.website : `https://${contactInfo.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1.5"
                >
                  <Globe className="h-4 w-4" />
                  {contactInfo.website.replace(/^https?:\/\//, '')}
                </a>
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
        >
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Address" icon={MapPinIcon}>
                <Input
                  value={editLocation.address}
                  onChange={(e) => handleInputChange(e, 'location', 'address')}
                  className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                />
              </FormField>
              
              <FormField label="City" icon={MapIcon}>
                <Input
                  value={editLocation.city}
                  onChange={(e) => handleInputChange(e, 'location', 'city')}
                  className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                />
              </FormField>
              
              <FormField label="Country" icon={MapIcon}>
                <Input
                  value={editLocation.country}
                  onChange={(e) => handleInputChange(e, 'location', 'country')}
                  className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                />
              </FormField>
              
              <FormField label="Postal Code" icon={MapPinIcon}>
                <Input
                  value={editLocation.postalCode}
                  onChange={(e) => handleInputChange(e, 'location', 'postalCode')}
                  className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                />
              </FormField>

              <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-white/10 col-span-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleCancel('location')}
                  className="px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/5 border border-white/20 hover:border-white/30 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => handleSave('location')}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors rounded-md shadow-sm"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-white/90">{locationInfo.address}</p>
              <p className="text-white/70">
                {locationInfo.city}, {locationInfo.country} {locationInfo.postalCode}
              </p>
              <div className="pt-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatFullAddress(locationInfo))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-purple-300 hover:text-purple-200 hover:underline mt-2"
                >
                  <MapPinIcon className="h-4 w-4 mr-1.5" />
                  View on Map
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
