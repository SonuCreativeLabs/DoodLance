"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  User,
  Pencil,
  Check,
  X,
  Calendar,
  MapPin,
  MailIcon,
  Trophy,
  Loader2
} from 'lucide-react';
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from "@/lib/utils";
import { usePersonalDetails } from '@/contexts/PersonalDetailsContext';
import { UsernameInput } from '@/components/freelancer/profile/UsernameInput';

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

type CricketInfo = {
  cricketRole: string;
  battingStyle: string;
  bowlingStyle: string;
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
  children,
  className = '',
  required = false
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}) => (
  <div className={cn("flex flex-col gap-2", className)}>
    <Label className="text-sm font-medium text-white/70">
      {label}{required && <span className="text-red-500 ml-1">*</span>}
    </Label>
    <div className="relative">
      {children}
    </div>
  </div>
);

type EditSection = 'personal' | 'contact' | 'location' | 'cricket' | 'username' | null;

export default function PersonalDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo'); // Get return path from query params
  const { personalDetails, updatePersonalDetails, refreshUser } = usePersonalDetails();
  const [editingSection, setEditingSection] = useState<EditSection>(null);

  // Refresh user data on mount to ensure we have latest updates from Client profile
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Initialize state from context
  const [username, setUsername] = useState(personalDetails.username || '');

  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [usernameMessage, setUsernameMessage] = useState('');

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: personalDetails.name || "",
    gender: personalDetails.gender || "",
    dateOfBirth: personalDetails.dateOfBirth || "",
    bio: personalDetails.bio || "",
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: personalDetails.email || "",
    phone: personalDetails.phone || "",
    website: ""
  });

  const [locationInfo, setLocationInfo] = useState<LocationInfo>({
    address: "",
    city: personalDetails.location?.split(',')[0]?.trim() || "",
    country: personalDetails.location?.split(',')[1]?.trim() || "",
    postalCode: ""
  });

  const [cricketInfo, setCricketInfo] = useState<CricketInfo>({
    cricketRole: personalDetails.cricketRole || "",
    battingStyle: personalDetails.battingStyle || "",
    bowlingStyle: personalDetails.bowlingStyle || ""
  });

  // Sync state with context updates (when API loads)
  useEffect(() => {
    setUsername(personalDetails.username || '');
    setPersonalInfo(prev => ({
      ...prev,
      fullName: personalDetails.name || "",
      gender: personalDetails.gender || "",
      dateOfBirth: personalDetails.dateOfBirth || "",
      bio: personalDetails.bio || ""
    }));
    setCricketInfo(prev => ({
      ...prev,
      cricketRole: personalDetails.cricketRole || "",
      battingStyle: personalDetails.battingStyle || "",
      bowlingStyle: personalDetails.bowlingStyle || ""
    }));

    setContactInfo(prev => ({
      ...prev,
      email: personalDetails.email || "",
      phone: personalDetails.phone || ""
    }));

    if (personalDetails.location) {
      const parts = personalDetails.location.split(',');
      setLocationInfo(prev => ({
        ...prev,
        city: parts[0]?.trim() || "",
        country: parts[1]?.trim() || ""
      }));
    }
  }, [personalDetails]);

  const [editPersonalInfo, setEditPersonalInfo] = useState<PersonalInfo>({ ...personalInfo });
  const [editContact, setEditContact] = useState<ContactInfo>({ ...contactInfo });
  const [editLocation, setEditLocation] = useState<LocationInfo>({ ...locationInfo });
  const [editCricket, setEditCricket] = useState<CricketInfo>({ ...cricketInfo });
  const [editUsername, setEditUsername] = useState(username);

  // Debounced username validation
  useEffect(() => {
    if (!editUsername || editUsername === username || editingSection !== 'username') {
      setUsernameStatus('idle');
      setUsernameMessage('');
      return;
    }

    const timeoutId = setTimeout(async () => {
      setUsernameStatus('checking');
      setUsernameMessage('Checking availability...');

      try {
        const response = await fetch(`/api/username/check?username=${encodeURIComponent(editUsername)}`);
        const data = await response.json();

        if (data.available && data.valid) {
          setUsernameStatus('available');
          setUsernameMessage('✓ Username is available');
        } else if (!data.valid) {
          setUsernameStatus('invalid');
          setUsernameMessage(data.message || 'Invalid username format');
        } else {
          setUsernameStatus('taken');
          setUsernameMessage(data.message || 'Username is already taken');
        }
      } catch (error) {
        console.error('Error checking username:', error);
        setUsernameStatus('invalid');
        setUsernameMessage('Error checking availability');
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [editUsername, username, editingSection]);

  const handleSave = (section: EditSection) => {
    if (section === 'personal') {
      const newPersonalInfo = { ...editPersonalInfo };
      setPersonalInfo(newPersonalInfo);
      // Sync name, title, and dateOfBirth with PersonalDetailsContext
      updatePersonalDetails({
        name: editPersonalInfo.fullName,
        title: cricketInfo.cricketRole || 'Cricketer',
        location: locationInfo.city + ', ' + locationInfo.country,
        dateOfBirth: editPersonalInfo.dateOfBirth,
        bio: editPersonalInfo.bio,
        gender: editPersonalInfo.gender
      });
    } else if (section === 'contact') {
      const newContactInfo = { ...editContact };
      setContactInfo(newContactInfo);
      updatePersonalDetails({
        email: editContact.email,
        phone: editContact.phone
      });
    } else if (section === 'location') {
      const newLocationInfo = { ...editLocation };
      setLocationInfo(newLocationInfo);
      // Sync location with PersonalDetailsContext when location changes
      updatePersonalDetails({
        name: personalInfo.fullName,
        title: cricketInfo.cricketRole || 'Cricketer',
        location: editLocation.city + ', ' + editLocation.country,
        dateOfBirth: personalInfo.dateOfBirth
      });
    } else if (section === 'cricket') {
      const newCricketInfo = { ...editCricket };
      setCricketInfo(newCricketInfo);
      // Sync cricket role with PersonalDetailsContext
      updatePersonalDetails({
        name: personalInfo.fullName,
        title: editCricket.cricketRole || 'Cricketer',
        cricketRole: editCricket.cricketRole,
        battingStyle: editCricket.battingStyle,
        bowlingStyle: editCricket.bowlingStyle,
        location: locationInfo.city + ', ' + locationInfo.country,
        dateOfBirth: personalInfo.dateOfBirth
      });
    } else if (section === 'username') {
      setUsername(editUsername);
      // Username is saved via the UsernameInput component's own API call
    }
    setEditingSection(null);

    // If there's a returnTo param (user came from auth flow), redirect after save
    if (returnTo && typeof window !== 'undefined') {
      setTimeout(() => {
        router.push(decodeURIComponent(returnTo));
      }, 500); // Small delay to ensure state updates
    }
  };

  const handleCancel = (section: EditSection) => {
    if (section === 'personal') {
      setEditPersonalInfo({ ...personalInfo });
    } else if (section === 'contact') {
      setEditContact({ ...contactInfo });
    } else if (section === 'location') {
      setEditLocation({ ...locationInfo });
    } else if (section === 'cricket') {
      setEditCricket({ ...cricketInfo });
    } else if (section === 'username') {
      setEditUsername(username);
    }
    setEditingSection(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, section: 'personal' | 'contact' | 'location' | 'cricket', field: string) => {
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
    } else if (section === 'location') {
      setEditLocation({
        ...editLocation,
        [field]: value
      });
    } else if (section === 'cricket') {
      setEditCricket({
        ...editCricket,
        [field]: value
      });
    }
  };

  const startEditing = (section: EditSection) => {
    setEditingSection(section);
    // Reset edit states when starting to edit with current values
    setEditPersonalInfo({ ...personalInfo });
    setEditContact({ ...contactInfo });
    setEditLocation({ ...locationInfo });
    setEditCricket({ ...cricketInfo });
    setEditUsername(username);
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
                  <FormField label="Full Name" required>
                    <Input
                      value={editPersonalInfo.fullName}
                      onChange={(e) => handleInputChange(e, 'personal', 'fullName')}
                      className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                    />
                  </FormField>
                  <FormField label="Gender" required>
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
                  <FormField label="Date of Birth" required>
                    <Input
                      type="date"
                      value={editPersonalInfo.dateOfBirth}
                      onChange={(e) => handleInputChange(e, 'personal', 'dateOfBirth')}
                      className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50 [&::-webkit-calendar-picker-indicator]:invert"
                    />
                  </FormField>

                  <FormField label="Bio" required>
                    <Textarea
                      value={editPersonalInfo.bio}
                      onChange={(e) => handleInputChange(e, 'personal', 'bio')}
                      className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                    />
                  </FormField>

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
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white/70 mb-0.5">Full Name</p>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-white/90 font-medium text-base", !personalInfo.fullName && "text-white/50 italic")}>
                        {personalInfo.fullName || "Not specified"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white/70 mb-0.5">Gender</p>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-white/90", !personalInfo.gender && "text-white/50 italic")}>
                        {personalInfo.gender || "Not specified"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white/70 mb-0.5">Date of Birth</p>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-white/90", !personalInfo.dateOfBirth && "text-white/50 italic")}>
                        {personalInfo.dateOfBirth ? new Date(personalInfo.dateOfBirth).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : "Not specified"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm font-medium text-white/70 mb-0.5">Bio</p>
                    <div className="flex items-start gap-2">
                      <span className={cn("text-white/80 whitespace-pre-line", !personalInfo.bio && "text-white/50 italic")}>
                        {personalInfo.bio || "No bio added yet"}
                      </span>
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
                <FormField label="Email" required>
                  <Input
                    type="email"
                    value={editContact.email}
                    onChange={(e) => handleInputChange(e, 'contact', 'email')}
                    className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                    placeholder="e.g. john@example.com"
                  />
                </FormField>

                <FormField label="Phone" required>
                  <Input
                    type="tel"
                    value={editContact.phone}
                    onChange={(e) => handleInputChange(e, 'contact', 'phone')}
                    className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                    placeholder="e.g. +1 234 567 8900"
                  />
                </FormField>
              </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-white/70 mb-1">Email</p>
                <div className={cn("text-white/90 inline-flex items-center gap-1.5", !contactInfo.email && "text-white/50 italic")}>
                  {contactInfo.email || "Not specified"}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-white/70 mb-1">Phone</p>
                <div className={cn("text-white/90 inline-flex items-center gap-1.5", !contactInfo.phone && "text-white/50 italic")}>
                  {contactInfo.phone || "Not specified"}
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
                <FormField label="Address" required>
                  <Input
                    value={editLocation.address}
                    onChange={(e) => handleInputChange(e, 'location', 'address')}
                    className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                    placeholder="Street address"
                  />
                </FormField>

                <FormField label="City" required>
                  <Input
                    value={editLocation.city}
                    onChange={(e) => handleInputChange(e, 'location', 'city')}
                    className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                    placeholder="City"
                  />
                </FormField>

                <FormField label="Country" required>
                  <Input
                    value={editLocation.country}
                    onChange={(e) => handleInputChange(e, 'location', 'country')}
                    className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                    placeholder="Country"
                  />
                </FormField>

                <FormField label="Postal Code" required>
                  <Input
                    value={editLocation.postalCode}
                    onChange={(e) => handleInputChange(e, 'location', 'postalCode')}
                    className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                    placeholder="Zip/Postal Code"
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
                <p className={cn("text-white/90 font-medium", !locationInfo.address && "text-white/50 italic")}>{locationInfo.address || "Address not specified"}</p>
                <p className={cn("text-white/70 text-sm mt-1", (!locationInfo.city && !locationInfo.country) && "text-white/50 italic")}>
                  {(locationInfo.city || locationInfo.country) ? `${locationInfo.city || ''}${(locationInfo.city && locationInfo.country) ? ', ' : ''}${locationInfo.country || ''} ${locationInfo.postalCode || ''}` : "City/Country not specified"}
                </p>
              </div>
              <div className="pt-1">
                {(locationInfo.address || locationInfo.city || locationInfo.country) ? (
                  <a
                    href={`https://maps.google.com/maps?q=${encodeURIComponent(formatFullAddress(locationInfo))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors group"
                  >
                    <span className="inline-flex items-center px-3 py-1.5 bg-white/5 rounded-full border border-white/10 group-hover:border-purple-500/30 transition-colors">
                      View on Map
                    </span>
                  </a>
                ) : null}
              </div>
            </div>
          )}
        </SectionCard>
      );
    } else if (section === 'username') {
      return (
        <SectionCard
          key="username"
          title="Public Profile Link"
          icon={User}
          onEdit={!isEditing ? () => startEditing('username') : undefined}
          isEditing={isEditing}
          onSave={async () => {
            // Save username via API
            if (editUsername && editUsername !== username) {
              try {
                const response = await fetch('/api/user/username', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username: editUsername }),
                });

                if (response.ok) {
                  setUsername(editUsername);
                  localStorage.setItem('username', editUsername); // Save to localStorage
                  // Update global context so header reflects the change
                  updatePersonalDetails({ username: editUsername });
                  handleSave('username');
                } else {
                  const data = await response.json();
                  alert(data.error || 'Failed to save username');
                }
              } catch (error) {
                console.error('Error saving username:', error);
                alert('Error saving username');
              }
            } else {
              handleSave('username');
            }
          }}
          onCancel={() => handleCancel('username')}
        >
          {isEditing ? (
            <div className="space-y-4">
              <FormField label="Claim your unique URL" required>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-white/50 text-sm font-medium z-10 pointer-events-none select-none">
                    doodlance.com/
                  </div>
                  <Input
                    value={editUsername}
                    onChange={(e) => {
                      setEditUsername(e.target.value);
                      setUsernameStatus('idle');
                    }}
                    placeholder="yourname"
                    className="pl-[140px] pr-10 bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                    maxLength={30}
                  />
                  {usernameStatus !== 'idle' && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {usernameStatus === 'checking' && (
                        <Loader2 className="h-4 w-4 animate-spin text-white/50" />
                      )}
                      {usernameStatus === 'available' && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                      {(usernameStatus === 'taken' || usernameStatus === 'invalid') && (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              </FormField>

              {usernameMessage && (
                <p className={`text-sm ${usernameStatus === 'available' ? 'text-green-500' :
                  usernameStatus === 'taken' || usernameStatus === 'invalid' ? 'text-red-500' :
                    'text-white/50'
                  }`}>
                  {usernameMessage}
                </p>
              )}

              <p className="text-xs text-white/50">
                3-30 characters. Letters, numbers, hyphens, and underscores only.
              </p>

              {editUsername && editUsername !== username && usernameStatus === 'available' && (
                <p className="text-xs text-purple-400">
                  Your profile will be: doodlance.com/{editUsername}
                </p>
              )}

              <div className="flex justify-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleCancel('username')}
                  className="h-10 px-8 rounded-xl border-white/10 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={async () => {
                    // Save username via API
                    if (editUsername && usernameStatus === 'available') {
                      try {
                        const response = await fetch('/api/user/username', {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ username: editUsername }),
                        });

                        if (response.ok) {
                          setUsername(editUsername);
                          setUsernameStatus('idle');
                          setUsernameMessage('');
                          handleSave('username');
                        } else {
                          const data = await response.json();
                          alert(data.error || 'Failed to save username');
                        }
                      } catch (error) {
                        console.error('Error saving username:', error);
                        alert('Error saving username');
                      }
                    }
                  }}
                  disabled={usernameStatus !== 'available'}
                  className="h-10 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {username ? (
                <>
                  <div>
                    <p className="text-sm font-medium text-white/70 mb-1">Public Profile Link</p>
                    <Link
                      href={`/${username}`}
                      className="text-purple-400 text-sm break-all hover:underline flex items-center gap-2"
                      target="_blank"
                    >
                      doodlance.com/{username}
                      <ArrowLeft className="h-3 w-3 rotate-180" />
                    </Link>
                  </div>
                </>
              ) : (
                <p className="text-white/50 italic">No username set. Click edit to create your public profile.</p>
              )}
            </div>
          )}
        </SectionCard>
      );
    } else if (section === 'cricket') {
      return (
        <SectionCard
          key="cricket"
          title="Cricket Information"
          icon={Trophy}
          onEdit={!isEditing ? () => startEditing('cricket') : undefined}
          isEditing={isEditing}
          onSave={() => handleSave('cricket')}
          onCancel={() => handleCancel('cricket')}
        >
          {isEditing ? (
            <div className="space-y-4">
              <FormField label="Cricket Role" required>
                <Input
                  value={editCricket.cricketRole}
                  onChange={(e) => handleInputChange(e, 'cricket', 'cricketRole')}
                  className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                  placeholder="e.g., All-rounder, Batsman, Bowler"
                />
              </FormField>

              <FormField label="Batting Style" required>
                <Input
                  value={editCricket.battingStyle}
                  onChange={(e) => handleInputChange(e, 'cricket', 'battingStyle')}
                  className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                  placeholder="e.g., Right-handed, Left-handed"
                />
              </FormField>

              <FormField label="Bowling Style" required>
                <Input
                  value={editCricket.bowlingStyle}
                  onChange={(e) => handleInputChange(e, 'cricket', 'bowlingStyle')}
                  className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                  placeholder="e.g., Right-arm off-spin, Left-arm orthodox"
                />
              </FormField>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleCancel('cricket')}
                    className="h-10 px-8 rounded-xl border-white/10 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleSave('cricket')}
                    className="h-10 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-purple-500/30 transition-all"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-white/70 mb-1">Cricket Role</p>
                <div className={cn("text-white/90 inline-flex items-center gap-1.5", !cricketInfo.cricketRole && "text-white/50 italic")}>
                  {cricketInfo.cricketRole || "Not specified"}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-white/70 mb-1">Batting Style</p>
                <div className={cn("text-white/90 inline-flex items-center gap-1.5", !cricketInfo.battingStyle && "text-white/50 italic")}>
                  {cricketInfo.battingStyle || "Not specified"}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-white/70 mb-1">Bowling Style</p>
                <div className={cn("text-white/90 inline-flex items-center gap-1.5", !cricketInfo.bowlingStyle && "text-white/50 italic")}>
                  {cricketInfo.bowlingStyle || "Not specified"}
                </div>
              </div>
            </div>
          )}
        </SectionCard>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-[#0F0F0F] border-b border-white/5 pt-2">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <Link
              href="/freelancer/profile#personal-details"
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
              onClick={(e) => {
                if (editingSection !== null) {
                  e.preventDefault();
                  handleCancel(editingSection);
                }
              }}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                <ArrowLeft className="h-4 w-4" />
              </div>
            </Link>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-white">Personal Details</h1>
              <p className="text-white/50 text-xs">Manage your personal information and contact details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {editingSection === null ? (
            // Show all sections in view mode
            <>
              {renderSection('personal')}
              {renderSection('username')}
              {renderSection('cricket')}
              {renderSection('contact')}
              {renderSection('location')}
            </>
          ) : (
            // Show only the section being edited
            <>{renderSection(editingSection)}</>
          )}
        </div>
      </div>
    </div>
  );
}
