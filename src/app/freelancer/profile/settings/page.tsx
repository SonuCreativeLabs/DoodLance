"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Bell,
  Lock,
  Mail,
  UserX,
  LogOut,
  AlertTriangle
} from 'lucide-react';
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSettings } from '@/contexts/SettingsContext';
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

interface SectionCardProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

const SectionCard = ({
  title,
  icon: Icon,
  children,
  className = ''
}: SectionCardProps) => (
  <div className="bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 shadow-lg shadow-purple-900/10 hover:shadow-purple-900/20">
    <div className="flex items-center gap-3 mb-6">
      <div className="text-purple-400">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
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

export default function SettingsPage() {
  const { settings, updateNotificationSettings, updateEmail, deactivateAccount, logout, isLoading } = useSettings();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Form states
  const [emailForm, setEmailForm] = useState({
    newEmail: settings?.email || '',
    confirmEmail: ''
  });

  const [notificationSettings, setNotificationSettings] = useState(
    settings?.notifications || {
      jobAlerts: true,
      messageNotifications: true,
      paymentNotifications: true,
      marketingEmails: false,
    }
  );

  const handleNotificationToggle = (key: keyof typeof notificationSettings) => {
    const updated = { ...notificationSettings, [key]: !notificationSettings[key] };
    setNotificationSettings(updated);
    updateNotificationSettings(updated);
  };

  const handleEmailChange = async () => {
    if (emailForm.newEmail !== emailForm.confirmEmail) {
      alert('Emails do not match');
      return;
    }

    if (!emailForm.newEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateEmail(emailForm.newEmail);
      alert('Email updated successfully! Please check your new email for verification.');
      setEmailForm({ newEmail: emailForm.newEmail, confirmEmail: '' });
    } catch (error) {
      alert('Failed to update email. Please try again.');
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      await deactivateAccount();
    } catch (error) {
      alert('Failed to deactivate account. Please try again.');
    }
  };

  const renderNotificationSettings = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
        <div className="flex-1">
          <p className="text-white font-medium text-sm">Job Alerts</p>
          <p className="text-white/60 text-xs">Get notified about new job opportunities</p>
        </div>
        <input
          type="checkbox"
          checked={notificationSettings.jobAlerts}
          onChange={() => handleNotificationToggle('jobAlerts')}
          className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2 ml-3"
        />
      </div>

      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
        <div className="flex-1">
          <p className="text-white font-medium text-sm">Message Notifications</p>
          <p className="text-white/60 text-xs">Receive notifications for new messages</p>
        </div>
        <input
          type="checkbox"
          checked={notificationSettings.messageNotifications}
          onChange={() => handleNotificationToggle('messageNotifications')}
          className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2 ml-3"
        />
      </div>

      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
        <div className="flex-1">
          <p className="text-white font-medium text-sm">Payment Notifications</p>
          <p className="text-white/60 text-xs">Get alerts for payments and transactions</p>
        </div>
        <input
          type="checkbox"
          checked={notificationSettings.paymentNotifications}
          onChange={() => handleNotificationToggle('paymentNotifications')}
          className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2 ml-3"
        />
      </div>

      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
        <div className="flex-1">
          <p className="text-white font-medium text-sm">Marketing Emails</p>
          <p className="text-white/60 text-xs">Receive tips, updates and promotional content</p>
        </div>
        <input
          type="checkbox"
          checked={notificationSettings.marketingEmails}
          onChange={() => handleNotificationToggle('marketingEmails')}
          className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2 ml-3"
        />
      </div>
    </div>
  );

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-[#0F0F0F] border-b border-white/5 pt-2">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="ml-3">
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Notification Skeleton */}
            <div className="bg-[#1E1E1E] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-48" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between p-3">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-4 w-4 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Email Skeleton */}
            <div className="bg-[#1E1E1E] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
                <div className="flex justify-center gap-4 pt-4">
                  <Skeleton className="h-10 w-24 rounded-xl" />
                  <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="space-y-3">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-[#0F0F0F] border-b border-white/5 pt-2">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <Link
              href="/freelancer/profile"
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                <ArrowLeft className="h-4 w-4" />
              </div>
            </Link>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-white">Settings</h1>
              <p className="text-white/50 text-xs">Manage your account preferences and security</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Notification Preferences */}
          <SectionCard
            title="Notification Preferences"
            icon={Bell}
          >
            {renderNotificationSettings()}
          </SectionCard>



          {/* Email Change */}
          <SectionCard
            title="Change Email"
            icon={Mail}
          >
            <div className="space-y-4">
              <div className="text-white/60 text-sm">
                Current Email: <span className="text-white font-medium">{settings?.email}</span>
              </div>

              <FormField label="New Email Address" required>
                <Input
                  type="email"
                  value={emailForm.newEmail}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, newEmail: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                  placeholder="Enter new email address"
                />
              </FormField>

              <FormField label="Confirm New Email" required>
                <Input
                  type="email"
                  value={emailForm.confirmEmail}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, confirmEmail: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white placeholder-white/30 focus-visible:ring-purple-500/50"
                  placeholder="Confirm new email address"
                />
              </FormField>

              <div className="flex justify-center gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEmailForm({ newEmail: settings?.email || '', confirmEmail: '' });
                  }}
                  className="h-10 px-8 rounded-xl border-white/10 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleEmailChange}
                  className="h-10 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-purple-500/30 transition-all"
                >
                  Update Email
                </Button>
              </div>
            </div>
          </SectionCard>

          {/* Account Actions */}
          <div className="space-y-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 border-white/20 text-white/80 hover:bg-white/5 hover:text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1E1E1E] text-white border-white/10 sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Sign out</DialogTitle>
                  <DialogDescription className="text-white/60">
                    Are you sure you want to sign out of your account?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <DialogClose asChild>
                    <Button variant="outline" className="border-white/20 hover:bg-white/5 hover:text-white text-white/70">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Sign out
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 border-white/20 text-white/80 hover:bg-white/5 hover:text-white"
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Deactivate Account
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1E1E1E] text-white border-white/10 sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-red-400 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Deactivate Account
                  </DialogTitle>
                  <DialogDescription className="text-white/60">
                    This action cannot be undone. Your profile will be hidden and you will lose access to all features. Are you sure?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <DialogClose asChild>
                    <Button variant="outline" className="border-white/20 hover:bg-white/5 hover:text-white text-white/70">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={handleDeactivateAccount}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isLoading ? 'Deactivating...' : 'Confirm Deactivation'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
