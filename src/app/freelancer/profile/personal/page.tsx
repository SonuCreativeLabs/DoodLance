"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  UserCircle, 
  Contact, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Cake, 
  Info, 
  Pencil, 
  X, 
  User, 
  Map, 
  Smartphone,
  Calendar,
  MapPin as MapPinIcon,
  User as UserIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Info as InfoIcon,
  Map as MapIcon,
  User as UserIcon2,
  MapPin as MapPinIcon2,
  Mail as MailIcon2,
  Phone as PhoneIcon2,
  Info as InfoIcon2,
  Cake as CakeIcon2,
  Map as MapIcon2,
  User as UserIcon3,
  MapPin as MapPinIcon3,
  Mail as MailIcon3,
  Phone as PhoneIcon3,
  Info as InfoIcon3,
  Cake as CakeIcon3,
  Map as MapIcon3,
  User as UserIcon4,
  MapPin as MapPinIcon4,
  Mail as MailIcon4,
  Phone as PhoneIcon4,
  Info as InfoIcon4,
  Cake as CakeIcon4,
  Map as MapIcon4,
  User as UserIcon5,
  MapPin as MapPinIcon5,
  Mail as MailIcon5,
  Phone as PhoneIcon5,
  Info as InfoIcon5,
  Cake as CakeIcon5,
  Map as MapIcon5,
  User as UserIcon6,
  MapPin as MapPinIcon6,
  Mail as MailIcon6,
  Phone as PhoneIcon6,
  Info as InfoIcon6,
  Cake as CakeIcon6,
  Map as MapIcon6,
  User as UserIcon7,
  MapPin as MapPinIcon7,
  Mail as MailIcon7,
  Phone as PhoneIcon7,
  Info as InfoIcon7,
  Cake as CakeIcon7,
  Map as MapIcon7,
  User as UserIcon8,
  MapPin as MapPinIcon8,
  Mail as MailIcon8,
  Phone as PhoneIcon8,
  Info as InfoIcon8,
  Cake as CakeIcon8,
  Map as MapIcon8,
  User as UserIcon9,
  MapPin as MapPinIcon9,
  Mail as MailIcon9,
  Phone as PhoneIcon9,
  Info as InfoIcon9,
  Cake as CakeIcon9,
  Map as MapIcon9,
  User as UserIcon10,
  MapPin as MapPinIcon10,
  Mail as MailIcon10,
  Phone as PhoneIcon10,
  Info as InfoIcon10,
  Cake as CakeIcon10,
  Map as MapIcon10 
} from 'lucide-react';
import Link from "next/link";


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

export default function PersonalDetailsPage() {
  const [isEditing, setIsEditing] = useState(false);
  
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

  const handleSave = () => {
    setPersonalInfo({ ...editPersonalInfo });
    setContactInfo({ ...editContact });
    setLocationInfo({ ...editLocation });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditPersonalInfo({ ...personalInfo });
    setEditContact({ ...contactInfo });
    setEditLocation({ ...locationInfo });
    setIsEditing(false);
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

  const startEditing = () => {
    setEditPersonalInfo({ ...personalInfo });
    setEditContact({ ...contactInfo });
    setEditLocation({ ...locationInfo });
    setIsEditing(true);
  };

  const formatFullAddress = (loc: LocationInfo) => {
    return `${loc.address}, ${loc.city}, ${loc.country} ${loc.postalCode}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-32">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="text-gray-600 hover:bg-transparent">
            <Link href="/freelancer/profile">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-medium">Personal Details</h1>
        </div>
        <Button 
          variant="ghost"
          size="sm" 
          className="flex items-center gap-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-gray-800"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <X className="h-4 w-4" />
          ) : (
            <Pencil className="h-4 w-4" />
          )}
          <span>{isEditing ? 'Cancel' : 'Edit'}</span>
        </Button>
      </div>

      <div className="space-y-8">
        {/* Personal Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-purple-500" />
            Personal Information
          </h2>
          
          {isEditing ? (
            <div className="space-y-5 pl-7">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</Label>
                <Input
                  id="fullName"
                  value={editPersonalInfo.fullName}
                  onChange={(e) => handleInputChange(e, 'personal', 'fullName')}
                  className="max-w-md"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="gender" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>Gender</span>
                  </Label>
                  <select
                    id="gender"
                    value={editPersonalInfo.gender}
                    onChange={(e) => handleInputChange(e, 'personal', 'gender')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-md"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={editPersonalInfo.dateOfBirth}
                    onChange={(e) => handleInputChange(e, 'personal', 'dateOfBirth')}
                    className="max-w-xs"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bio" className="text-sm font-medium text-gray-700 dark:text-gray-300">About Me</Label>
                <textarea
                  id="bio"
                  value={editPersonalInfo.bio}
                  onChange={(e) => handleInputChange(e, 'personal', 'bio')}
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-2xl"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3 pl-7">
              <div className="flex items-start gap-4">
                <User className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                  <p className="text-gray-900 dark:text-gray-100">{personalInfo.fullName}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-4">
                  <User className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0 opacity-0" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                    <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{personalInfo.gender}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Cake className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {new Date(personalInfo.dateOfBirth).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Info className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">About Me</p>
                  <p className="text-gray-900 dark:text-gray-100 whitespace-pre-line">{personalInfo.bio}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2 mt-8">
            <Contact className="h-5 w-5 text-purple-500" />
            Contact Information
          </h2>
          
          {isEditing ? (
            <div className="space-y-5 pl-7">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
                <Input
                  id="email"
                  value={editContact.email}
                  onChange={(e) => handleInputChange(e, 'contact', 'email')}
                  className="max-w-md"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</Label>
                <Input
                  id="phone"
                  value={editContact.phone}
                  onChange={(e) => handleInputChange(e, 'contact', 'phone')}
                  className="max-w-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="website" className="text-sm font-medium text-gray-700 dark:text-gray-300">Website</Label>
                <Input
                  id="website"
                  value={editContact.website}
                  onChange={(e) => handleInputChange(e, 'contact', 'website')}
                  className="max-w-md"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3 pl-7">
              <div className="flex items-start gap-4">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-gray-900 dark:text-gray-100">{contactInfo.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-gray-900 dark:text-gray-100">{contactInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Globe className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                  <a 
                    href={`https://${contactInfo.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline dark:text-purple-400"
                  >
                    {contactInfo.website}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

        {/* Location Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2 mt-8">
            <MapPin className="h-5 w-5 text-purple-500" />
            Location
          </h2>
          
          {isEditing ? (
            <div className="space-y-4 pl-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label htmlFor="address" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>Address</span>
                  </Label>
                  <Input
                    id="address"
                    value={editLocation.address}
                    onChange={(e) => handleInputChange(e, 'location', 'address')}
                    className="mt-1"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>City</span>
                  </Label>
                  <Input
                    id="city"
                    value={editLocation.city}
                    onChange={(e) => handleInputChange(e, 'location', 'city')}
                    className="mt-1"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="country" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>Country</span>
                  </Label>
                  <Input
                    id="country"
                    value={editLocation.country}
                    onChange={(e) => handleInputChange(e, 'location', 'country')}
                    className="mt-1"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="postalCode" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>Postal Code</span>
                  </Label>
                  <Input
                    id="postalCode"
                    value={editLocation.postalCode}
                    onChange={(e) => handleInputChange(e, 'location', 'postalCode')}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pl-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>Address</span>
                  </div>
                  <p className="ml-6 text-gray-900 dark:text-gray-100">{locationInfo.address}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>City</span>
                  </div>
                  <p className="ml-6 text-gray-900 dark:text-gray-100">{locationInfo.city}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>Country</span>
                  </div>
                  <p className="ml-6 text-gray-900 dark:text-gray-100">{locationInfo.country}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>Postal Code</span>
                  </div>
                  <p className="ml-6 text-gray-900 dark:text-gray-100">{locationInfo.postalCode}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
