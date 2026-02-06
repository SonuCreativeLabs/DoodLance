"use client";

import { useRef, useEffect, useState } from 'react';
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
  Loader2,
  Plus,
  CircleDot,
  Activity,
  Target
} from 'lucide-react';
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/AuthContext';
import { usePersonalDetails } from '@/contexts/PersonalDetailsContext';
import { useFreelancerProfile } from '@/contexts/FreelancerProfileContext';
import { UsernameInput } from '@/components/freelancer/profile/UsernameInput';
import { CricketLoader } from '@/components/ui/cricket-loader';
import { SPORTS_CONFIG, POPULAR_SPORTS, SportConfig } from '@/constants/sports';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectScrollUpButton, SelectScrollDownButton } from "@/components/ui/select"
import * as SelectPrimitive from "@radix-ui/react-select";

// Sport icon mapping
const SPORT_ICONS: Record<string, any> = {
  Cricket: Trophy,
  Football: CircleDot,
  Badminton: Activity,
  Tennis: Target,
  Basketball: CircleDot,
  Padel: Target,
  Pickleball: Target,
  Kabaddi: Activity,
};


type PersonalInfo = {
  firstName: string;
  lastName: string;
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
  area: string;
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
  className = '',
  isSaveDisabled = false
}: SectionCardProps & { isSaveDisabled?: boolean }) => (
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
                disabled={isSaveDisabled}
                className={cn(
                  "text-green-500 hover:bg-green-500/10 hover:text-green-400 h-8 px-3 disabled:opacity-50 disabled:cursor-not-allowed",
                  isSaveDisabled && "text-white/30 hover:bg-transparent hover:text-white/30"
                )}
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

import { Skeleton } from "@/components/ui/skeleton";



// ... existing types ...

export default function PersonalDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo'); // Get return path from query params
  const { user, refreshUser } = useAuth();
  const { personalDetails, updatePersonalDetails, refreshPersonalDetails, isLoading } = usePersonalDetails();
  const { updateLocalProfile } = useFreelancerProfile();
  const [editingSection, setEditingSection] = useState<EditSection>(null);

  // Refresh user data on mount to ensure we have latest updates from Client profile
  useEffect(() => {
    refreshUser();
    refreshPersonalDetails();
  }, [refreshUser, refreshPersonalDetails]);

  // ... (content will be generated in the next step after I verify the end of the file)

  // Initialize state from context
  const [username, setUsername] = useState(personalDetails.username || '');

  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isSavingUsername, setIsSavingUsername] = useState(false);


  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: personalDetails.firstName || "",
    lastName: personalDetails.lastName || "",
    gender: personalDetails.gender || "",
    dateOfBirth: personalDetails.dateOfBirth ? new Date(personalDetails.dateOfBirth).toISOString().split('T')[0] : "",
    bio: personalDetails.bio || "",
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: personalDetails.email || "",
    phone: personalDetails.phone || "",
    website: ""
  });

  const [locationInfo, setLocationInfo] = useState<LocationInfo>({
    address: personalDetails.address || "",
    city: personalDetails.city || "",
    country: personalDetails.state || "", // Using country field for State temporarily to match UI
    postalCode: personalDetails.postalCode || "",
    area: personalDetails.area || ""
  });

  // Sport State
  const [mainSport, setMainSport] = useState(personalDetails.mainSport || "Cricket");
  const [otherSports, setOtherSports] = useState<string[]>(personalDetails.otherSports || []);
  const [sportsDetails, setSportsDetails] = useState<any>(personalDetails.sportsDetails || {
    cricketRole: personalDetails.cricketRole,
    battingStyle: personalDetails.battingStyle,
    bowlingStyle: personalDetails.bowlingStyle
  } || {});



  // Legacy Cricket State (Sync for backward compatibility)
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
      firstName: personalDetails.firstName || "",
      lastName: personalDetails.lastName || "",
      gender: personalDetails.gender || "",
      dateOfBirth: personalDetails.dateOfBirth ? new Date(personalDetails.dateOfBirth).toISOString().split('T')[0] : "",
      bio: personalDetails.bio || ""
    }));
    setMainSport(personalDetails.mainSport || "Cricket");
    setOtherSports(personalDetails.otherSports || []);
    setSportsDetails(personalDetails.sportsDetails || {
      cricketRole: personalDetails.cricketRole,
      battingStyle: personalDetails.battingStyle,
      bowlingStyle: personalDetails.bowlingStyle
    });

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

    setLocationInfo(prev => ({
      ...prev,
      address: personalDetails.address || "",
      city: personalDetails.city || "",
      country: personalDetails.state || "",
      postalCode: personalDetails.postalCode || "",
      area: personalDetails.area || ""
    }));
  }, [personalDetails]);

  const [editPersonalInfo, setEditPersonalInfo] = useState<PersonalInfo>({ ...personalInfo });
  const [editContact, setEditContact] = useState<ContactInfo>({ ...contactInfo });
  const [editLocation, setEditLocation] = useState<LocationInfo>({ ...locationInfo });
  // Dynamic Edit State
  const [editMainSport, setEditMainSport] = useState(mainSport);
  const [editOtherSports, setEditOtherSports] = useState<string[]>(otherSports);
  const [editSportsDetails, setEditSportsDetails] = useState<any>({ ...sportsDetails });


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
        name: `${editPersonalInfo.firstName} ${editPersonalInfo.lastName}`.trim(),
        firstName: editPersonalInfo.firstName,
        lastName: editPersonalInfo.lastName,
        title: cricketInfo.cricketRole || 'Cricketer',
        location: locationInfo.city + ', ' + locationInfo.country,
        dateOfBirth: editPersonalInfo.dateOfBirth,
        bio: editPersonalInfo.bio,
        gender: editPersonalInfo.gender
      });

      // Sync with FreelancerProfileContext
      updateLocalProfile({
        name: `${editPersonalInfo.firstName} ${editPersonalInfo.lastName}`.trim(),
        about: editPersonalInfo.bio,
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
        name: `${personalInfo.firstName} ${personalInfo.lastName}`.trim(),
        title: cricketInfo.cricketRole || 'Cricketer',
        location: `${editLocation.area ? editLocation.area + ', ' : ''}${editLocation.city}`,
        dateOfBirth: personalInfo.dateOfBirth,
        address: editLocation.address,
        area: editLocation.area,
        city: editLocation.city,
        state: editLocation.country,
        postalCode: editLocation.postalCode
      });

      // Sync with FreelancerProfileContext
      updateLocalProfile({
        location: `${editLocation.area ? editLocation.area + ', ' : ''}${editLocation.city}`,
      });
      // Sync with FreelancerProfileContext
      updateLocalProfile({
        location: `${editLocation.area ? editLocation.area + ', ' : ''}${editLocation.city}`,
      });
    } else if (section === 'cricket') {
      // Save Main Sport & Details
      setMainSport(editMainSport);
      setOtherSports(editOtherSports);
      setSportsDetails(editSportsDetails);

      // Sync with Context
      updatePersonalDetails({
        mainSport: editMainSport,
        otherSports: editOtherSports,
        sportsDetails: editSportsDetails,
        // Legacy Sync (if Cricket)
        ...(editMainSport === 'Cricket' ? {
          cricketRole: editSportsDetails.cricketRole,
          battingStyle: editSportsDetails.battingStyle,
          bowlingStyle: editSportsDetails.bowlingStyle,
          title: editSportsDetails.cricketRole || 'Cricketer'
        } : {
          title: `${editMainSport} Player` // Default title for other sports
        })
      });

      // Sync with FreelancerProfileContext
      updateLocalProfile({
        title: editMainSport === 'Cricket' ? (editSportsDetails.cricketRole || 'Cricketer') : `${editMainSport} Player`,
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
      // Reset Sport State
      setEditMainSport(mainSport);
      setEditOtherSports([...otherSports]);
      setEditSportsDetails({ ...sportsDetails });
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

    // Initialize Sport Edit State
    setEditMainSport(mainSport);
    setEditOtherSports([...otherSports]);
    setEditSportsDetails({ ...sportsDetails });

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
          isSaveDisabled={!editPersonalInfo.firstName || !editPersonalInfo.lastName || !editPersonalInfo.gender || !editPersonalInfo.dateOfBirth || !editPersonalInfo.bio}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isEditing ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="First Name" required>
                    <Input
                      value={editPersonalInfo.firstName}
                      onChange={(e) => handleInputChange(e, 'personal', 'firstName')}
                      className="rounded-lg bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                    />
                  </FormField>
                  <FormField label="Last Name" required>
                    <Input
                      value={editPersonalInfo.lastName}
                      onChange={(e) => handleInputChange(e, 'personal', 'lastName')}
                      className="rounded-lg bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                    />
                  </FormField>
                </div>
                <FormField label="Gender" required>
                  <div className="relative">
                    <select
                      value={editPersonalInfo.gender}
                      onChange={(e) => handleInputChange(e, 'personal', 'gender')}
                      className={cn(
                        "flex h-10 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E1E1E] transition-colors cursor-pointer appearance-none pr-10",
                        !editPersonalInfo.gender ? "text-white/40" : "text-white"
                      )}
                    >
                      <option value="" disabled className="bg-[#1E1E1E] text-white/50">Select Gender</option>
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


                <FormField label="Date of Birth" required>
                  <Input
                    type="date"
                    value={editPersonalInfo.dateOfBirth}
                    onChange={(e) => handleInputChange(e, 'personal', 'dateOfBirth')}
                    className="rounded-lg bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50 [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </FormField>

                <div className="md:col-span-2">
                  <FormField label="Bio" required>
                    <Textarea
                      value={editPersonalInfo.bio}
                      onChange={(e) => handleInputChange(e, 'personal', 'bio')}
                      className="rounded-lg min-h-[100px] bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                    />
                  </FormField>
                </div>

                <div className="md:col-span-2 flex justify-center gap-4">
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
                    disabled={!editPersonalInfo.firstName || !editPersonalInfo.lastName || !editPersonalInfo.gender || !editPersonalInfo.dateOfBirth || !editPersonalInfo.bio}
                    className="h-10 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Changes
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white/70 mb-0.5">First Name</p>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-white/90 font-medium text-base", !personalInfo.firstName && "text-white/50 italic")}>
                        {personalInfo.firstName || "Not specified"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white/70 mb-0.5">Last Name</p>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-white/90 font-medium text-base", !personalInfo.lastName && "text-white/50 italic")}>
                        {personalInfo.lastName || "Not specified"}
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
        </SectionCard >
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
          isSaveDisabled={!editContact.email || !editContact.phone}
        >
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Email" required>
                  <Input
                    type="email"
                    value={editContact.email}
                    onChange={(e) => handleInputChange(e, 'contact', 'email')}
                    className="rounded-lg bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                    placeholder="e.g. john@example.com"
                  />
                </FormField>

                <FormField label="Phone" required>
                  <Input
                    type="tel"
                    value={editContact.phone}
                    onChange={(e) => handleInputChange(e, 'contact', 'phone')}
                    className="rounded-lg bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
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
                    disabled={!editContact.email || !editContact.phone}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          isSaveDisabled={!editLocation.address || !editLocation.city || !editLocation.country || !editLocation.postalCode}
          className="space-y-4"
        >
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Address" required>
                  <Input
                    value={editLocation.address}
                    onChange={(e) => handleInputChange(e, 'location', 'address')}
                    className="rounded-lg bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                    placeholder="Street address"
                  />
                </FormField>

                <FormField label="Area" required>
                  <Input
                    value={editLocation.area}
                    onChange={(e) => handleInputChange(e, 'location', 'area')}
                    className="rounded-lg bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                    placeholder="e.g. Velachery"
                  />
                </FormField>

                <FormField label="City" required>
                  <Input
                    value={editLocation.city}
                    onChange={(e) => handleInputChange(e, 'location', 'city')}
                    className="rounded-lg bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                    placeholder="City"
                  />
                </FormField>

                <FormField label="State" required>
                  <Input
                    value={editLocation.country}
                    onChange={(e) => handleInputChange(e, 'location', 'country')}
                    className="rounded-lg bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                    placeholder="State/Province"
                  />
                </FormField>

                <FormField label="Postal Code" required>
                  <Input
                    value={editLocation.postalCode}
                    onChange={(e) => handleInputChange(e, 'location', 'postalCode')}
                    className="rounded-lg bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
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
                    disabled={!editLocation.address || !editLocation.city || !editLocation.country || !editLocation.postalCode}
                    className="h-10 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                <p className={cn("text-white/70 text-sm mt-1", (!locationInfo.city && !locationInfo.area) && "text-white/50 italic")}>
                  {(locationInfo.city || locationInfo.area) ? `${locationInfo.area ? locationInfo.area + ', ' : ''}${locationInfo.city || ''}` : "Location not specified"}
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
          isSaveDisabled={!editUsername || usernameStatus === 'taken' || usernameStatus === 'invalid' || usernameStatus === 'checking'}
        >
          {isEditing ? (
            <div className="space-y-4">
              <FormField label="Claim your unique URL" required>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-white/50 text-sm font-medium z-10 pointer-events-none select-none">
                    bails.in/
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

              <div className="mt-6 pt-4 border-t border-white/10">
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
                      if (editUsername && editUsername !== username) {
                        setIsSavingUsername(true);
                        try {
                          const response = await fetch('/api/user/username', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username: editUsername }),
                          });

                          if (response.ok) {
                            setUsername(editUsername);
                            localStorage.setItem('username', editUsername);
                            updatePersonalDetails({ username: editUsername });
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
                        } finally {
                          setIsSavingUsername(false);
                        }
                      } else {
                        handleSave('username');
                      }
                    }}
                    disabled={isSavingUsername || !editUsername || usernameStatus === 'taken' || usernameStatus === 'invalid' || usernameStatus === 'checking'}
                    className="h-10 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSavingUsername ? (
                      <>
                        <CricketLoader size={16} color="white" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </div>

              {editUsername && editUsername !== username && usernameStatus === 'available' && (
                <p className="text-xs text-purple-400">
                  Your profile will be: bails.in/{editUsername}
                </p>
              )}
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
                      bails.in/{username}
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
      const activeConfig = SPORTS_CONFIG[editMainSport] || SPORTS_CONFIG['Cricket'];

      return (
        <SectionCard
          key="cricket"
          title="Sport Details"
          icon={Trophy}
          onEdit={!isEditing ? () => startEditing('cricket') : undefined}
          isEditing={isEditing}
          onSave={() => handleSave('cricket')}
          onCancel={() => handleCancel('cricket')}
          // Disable save if required fields are missing
          isSaveDisabled={isEditing && activeConfig.attributes.some(attr =>
            attr.required && !editSportsDetails[attr.key]
          )}
        >
          {isEditing ? (
            <div className="space-y-6">
              {/* Main Sport Selector */}
              <FormField label="Main Sport" required>
                <div className="relative">
                  <select
                    value={editMainSport}
                    onChange={(e) => {
                      const newSport = e.target.value;
                      setEditMainSport(newSport);
                      // Reset details when sport changes
                      setEditSportsDetails({});
                    }}
                    className="flex h-10 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 transition-colors cursor-pointer appearance-none pr-10 text-white"
                  >
                    {POPULAR_SPORTS.map(sport => (
                      <option key={sport} value={sport} className="bg-[#1E1E1E] text-white">
                        {sport}
                      </option>
                    ))}
                  </select>
                </div>
              </FormField>


              {/* Dynamic Attributes based on config */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeConfig.attributes.map(attr => (
                  <FormField key={attr.key} label={attr.label} required={attr.required}>
                    {attr.type === 'select' ? (
                      <div className="flex flex-wrap gap-2">
                        {attr.options?.map(opt => {
                          const selected = (editSportsDetails[attr.key] || "") === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setEditSportsDetails({ ...editSportsDetails, [attr.key]: opt })}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200",
                                selected
                                  ? "bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-500/25"
                                  : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white"
                              )}
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                    ) : attr.type === 'multi-select' ? (
                      <div className="space-y-2">
                        <p className="text-xs text-white/40 italic">(Select multiple)</p>
                        <div className="flex flex-wrap gap-2">
                          {attr.options?.map(opt => {
                            const selected = (editSportsDetails[attr.key] || []).includes(opt);
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  const current = editSportsDetails[attr.key] || [];
                                  const updated = selected
                                    ? current.filter((i: string) => i !== opt)
                                    : [...current, opt];
                                  setEditSportsDetails({ ...editSportsDetails, [attr.key]: updated });
                                }}
                                className={cn(
                                  "px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200",
                                  selected
                                    ? "bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-500/25"
                                    : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white"
                                )}
                              >
                                {opt}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ) : (
                      <Input
                        value={editSportsDetails[attr.key] || ""}
                        onChange={(e) => setEditSportsDetails({ ...editSportsDetails, [attr.key]: e.target.value })}
                        className="rounded-lg bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                        placeholder={attr.placeholder}
                      />
                    )}
                  </FormField>
                ))}
              </div>

              <div className="h-px bg-white/10 my-4" />

              {/* Secondary Sports Title */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white/90">Secondary Sports (Optional)</h3>
              </div>

              {/* Secondary Sports List */}
              <div className="space-y-6">
                {editOtherSports.map(sport => {
                  const config = SPORTS_CONFIG[sport];
                  return (
                    <div
                      key={sport}
                      className="relative pb-6 mb-6 border-b border-white/10 last:border-0 last:pb-0 last:mb-0"
                    >
                      <FormField label="Sport" required className="mb-4">
                        <div className="relative">
                          <div className="flex h-10 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm items-center justify-between">
                            <span className="text-white">{sport}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditOtherSports(current => current.filter(s => s !== sport));
                                // Cleanup details
                                const newDetails = { ...editSportsDetails };
                                delete newDetails[sport];
                                setEditSportsDetails(newDetails);
                              }}
                              className="p-1 rounded-md text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors -mr-1"
                              title="Remove Sport"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </FormField>

                      {/* Inline Dynamic Attributes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {config?.attributes.map(attr => (
                          <FormField key={`${sport}-${attr.key}`} label={attr.label} required={attr.required}>
                            {attr.type === 'select' ? (
                              <div className="flex flex-wrap gap-2">
                                {attr.options?.map(opt => {
                                  const currentVal = editSportsDetails[sport]?.[attr.key];
                                  const selected = currentVal === opt;
                                  return (
                                    <button
                                      key={opt}
                                      type="button"
                                      onClick={() => setEditSportsDetails((prev: any) => ({
                                        ...prev,
                                        [sport]: {
                                          ...(prev[sport] || {}),
                                          [attr.key]: opt
                                        }
                                      }))}
                                      className={cn(
                                        "px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200",
                                        selected
                                          ? "bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-500/25"
                                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white"
                                      )}
                                    >
                                      {opt}
                                    </button>
                                  )
                                })}
                              </div>
                            ) : attr.type === 'multi-select' ? (
                              <div className="space-y-2">
                                <p className="text-xs text-white/40 italic">(Select multiple)</p>
                                <div className="flex flex-wrap gap-2">
                                  {attr.options?.map(opt => {
                                    const currentDetails = editSportsDetails[sport] || {};
                                    const currentValues = currentDetails[attr.key] || [];
                                    // Ensure we handle both string (legacy) and array
                                    const selected = Array.isArray(currentValues)
                                      ? currentValues.includes(opt)
                                      : currentValues === opt;

                                    return (
                                      <button
                                        key={opt}
                                        type="button"
                                        onClick={() => {
                                          const current = editSportsDetails[sport] || {};
                                          const currentVals = Array.isArray(current[attr.key]) ? current[attr.key] : [];

                                          const updated = currentVals.includes(opt)
                                            ? currentVals.filter((i: string) => i !== opt)
                                            : [...currentVals, opt];

                                          setEditSportsDetails((prev: any) => ({
                                            ...prev,
                                            [sport]: {
                                              ...(prev[sport] || {}),
                                              [attr.key]: updated
                                            }
                                          }));
                                        }}
                                        className={cn(
                                          "px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200",
                                          selected
                                            ? "bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-500/25"
                                            : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white"
                                        )}
                                      >
                                        {opt}
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                            ) : (
                              <Input
                                value={editSportsDetails[sport]?.[attr.key] || ""}
                                onChange={(e) => setEditSportsDetails((prev: any) => ({
                                  ...prev,
                                  [sport]: {
                                    ...(prev[sport] || {}),
                                    [attr.key]: e.target.value
                                  }
                                }))}
                                className="rounded-lg bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                                placeholder={attr.placeholder}
                              />
                            )}
                          </FormField>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Inline Add Sport Dropdown - Premium Radix UI Select */}
                <div className="pt-2">
                  <div className="relative">
                    <SelectPrimitive.Root
                      value=""
                      onValueChange={(sportToAdd) => {
                        if (sportToAdd) {
                          setEditOtherSports(prev => [...prev, sportToAdd]);
                          // Initialize empty details object for this sport
                          setEditSportsDetails((prev: any) => ({
                            ...prev,
                            [sportToAdd]: {}
                          }));
                        }
                      }}
                    >
                      <SelectPrimitive.Trigger
                        className="flex h-10 w-full md:w-1/2 rounded-lg bg-white/5 border border-dashed border-white/20 px-3 py-2 text-sm text-white/70 hover:border-purple-500/50 hover:bg-purple-500/5 hover:text-purple-300 transition-all cursor-pointer items-center justify-between outline-none"
                      >
                        <span className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Add another sport
                        </span>
                      </SelectPrimitive.Trigger>

                      <SelectPrimitive.Portal>
                        <SelectPrimitive.Content
                          position="popper"
                          side="bottom"
                          sideOffset={5}
                          className="overflow-hidden bg-[#18181b] rounded-xl border border-white/10 shadow-xl z-50 w-[var(--radix-select-trigger-width)] max-h-[235px] relative"
                        >
                          <SelectScrollUpButton className="flex items-center justify-center h-6 bg-gradient-to-b from-[#18181b] to-transparent text-white/50 cursor-default pointer-events-none" />
                          <SelectPrimitive.Viewport className="p-1">
                            {POPULAR_SPORTS
                              .filter(s => s !== editMainSport && !editOtherSports.includes(s))
                              .map(sport => (
                                <SelectPrimitive.Item
                                  key={sport}
                                  value={sport}
                                  className="relative flex items-center h-10 px-8 text-sm text-white rounded-lg select-none hover:bg-white hover:text-black data-[highlighted]:bg-white data-[highlighted]:text-black outline-none cursor-pointer mb-1 transition-colors"
                                >
                                  <SelectPrimitive.ItemText>{sport}</SelectPrimitive.ItemText>
                                  <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                  </SelectPrimitive.ItemIndicator>
                                </SelectPrimitive.Item>
                              ))}
                          </SelectPrimitive.Viewport>
                          <SelectScrollDownButton className="flex items-center justify-center h-8 bg-gradient-to-t from-[#18181b] to-transparent text-purple-400 cursor-default animate-pulse pointer-events-none" />
                        </SelectPrimitive.Content>
                      </SelectPrimitive.Portal>
                    </SelectPrimitive.Root>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  {(() => {
                    const MainSportIcon = SPORT_ICONS[mainSport] || Trophy;
                    return <MainSportIcon className="h-5 w-5 text-purple-400" />;
                  })()}
                  <span className="text-lg font-medium text-white">{mainSport}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(SPORTS_CONFIG[mainSport] || SPORTS_CONFIG['Cricket']).attributes.map(attr => (
                    <div key={attr.key}>
                      <p className="text-xs font-medium text-white/50 mb-1">{attr.label}</p>
                      <div className={cn("text-white inline-flex items-center gap-1.5", !sportsDetails[attr.key] && "text-white/50 italic")}>
                        {Array.isArray(sportsDetails[attr.key])
                          ? sportsDetails[attr.key].join(', ')
                          : (sportsDetails[attr.key] || "Not specified")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Display Secondary Sports */}
              {otherSports.length > 0 && (
                <div className="space-y-4">
                  {otherSports.map(sport => {
                    const config = SPORTS_CONFIG[sport];
                    const details = sportsDetails[sport] || {};
                    const SportIcon = SPORT_ICONS[sport] || Trophy;

                    return (
                      <div key={sport} className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <SportIcon className="h-5 w-5 text-purple-400" />
                          <span className="text-lg font-medium text-white">{sport}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {config?.attributes.map(attr => (
                            <div key={attr.key}>
                              <p className="text-xs font-medium text-white/50 mb-1">{attr.label}</p>
                              <div className={cn("text-white inline-flex items-center gap-1.5", !details[attr.key] && "text-white/50 italic")}>
                                {Array.isArray(details[attr.key])
                                  ? details[attr.key].join(', ')
                                  : (details[attr.key] || "Not specified")}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </SectionCard >
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 md:top-16 z-10 bg-[#0F0F0F] border-b border-white/5 pt-2">
        <div className="container max-w-4xl mx-auto px-4 py-3">
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
        <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
          {isLoading ? (
            <div className="space-y-6">
              {/* Personal Information Skeleton */}
              <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                </div>
              </div>

              {/* Contact Information Skeleton */}
              <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                </div>
              </div>

              {/* Location Skeleton */}
              <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>

              {/* Username Skeleton */}
              <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          ) : editingSection === null ? (
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

        {/* Bottom padding when editing cricket section */}
        {editingSection === 'cricket' && <div className="h-24" />}

        {/* Sticky Action Buttons for Sport Details */}
        {editingSection === 'cricket' && (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0F0F0F] via-[#1A1A1A] to-[#1A1A1A]/95 border-t border-white/5 backdrop-blur-md z-50">
            <div className="max-w-4xl mx-auto px-6 py-3 flex justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleCancel('cricket')}
                className="h-10 w-36 rounded-xl border-white/10 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => handleSave('cricket')}
                disabled={
                  // Check main sport requirements
                  (SPORTS_CONFIG[editMainSport]?.attributes.some(attr => {
                    if (!attr.required) return false;
                    const value = editSportsDetails[attr.key];
                    return !value || (Array.isArray(value) && value.length === 0);
                  })) ||
                  // Check secondary sports requirements
                  editOtherSports.some(sport => {
                    const config = SPORTS_CONFIG[sport];
                    const details = editSportsDetails[sport] || {};
                    return config?.attributes.some(attr => {
                      if (!attr.required) return false;
                      const value = details[attr.key];
                      return !value || (Array.isArray(value) && value.length === 0);
                    });
                  })
                }
                className="h-10 w-36 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </div>


    </div>
  );
}
