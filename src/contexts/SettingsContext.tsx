'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface NotificationSettings {
  jobAlerts: boolean;
  messageNotifications: boolean;
  paymentNotifications: boolean;
  marketingEmails: boolean;
}

export interface SettingsData {
  notifications: NotificationSettings;
  email: string;
  accountStatus: 'active' | 'inactive' | 'deactivated';
}

interface SettingsContextType {
  settings: SettingsData | null;
  updateNotificationSettings: (settings: NotificationSettings) => void;
  updateEmail: (email: string) => void;
  deactivateAccount: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const defaultNotificationSettings: NotificationSettings = {
  jobAlerts: true,
  messageNotifications: true,
  paymentNotifications: true,
  marketingEmails: false,
};

const defaultSettings: SettingsData = {
  notifications: defaultNotificationSettings,
  email: 'user@example.com', // This would come from auth context
  accountStatus: 'active',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

import { useAuth } from '@/contexts/AuthContext';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [settings, setSettings] = useState<SettingsData | null>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from API
  React.useEffect(() => {
    // Only fetch if authenticated
    if (!isAuthenticated) return;

    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/freelancer/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(prev => ({
            ...prev || defaultSettings,
            notifications: data.settings,
            email: data.email || prev?.email || defaultSettings.email
          }));
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [isAuthenticated]);

  const updateNotificationSettings = useCallback(async (notificationSettings: NotificationSettings) => {
    // Optimistic update
    setSettings(prev => prev ? { ...prev, notifications: notificationSettings } : null);

    try {
      const response = await fetch('/api/freelancer/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifications: notificationSettings })
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      // Revert if needed, but for now we just log
    }
  }, []);

  const updateEmail = useCallback(async (email: string) => {
    // Import Supabase client dynamically
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();

    try {
      // 1. Update in Supabase Auth
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;

      // 2. Update in Database via API
      const response = await fetch('/api/freelancer/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('Failed to update email in database');
      }

      setSettings(prev => prev ? { ...prev, email } : null);
    } catch (error) {
      console.error('Failed to update email:', error);
      throw error;
    }
  }, []);

  const deactivateAccount = useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real app, you might want to call an API to mark the user as deactivated in DB
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      // Call the deactivation API (Temporary Hold)
      const response = await fetch('/api/user/deactivate', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to deactivate account');
      }

      // Sign out from Supabase Auth
      await supabase.auth.signOut();

      // Clear data
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }

      window.location.href = '/';
    } catch (error) {
      console.error('Failed to deactivate account:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();

    try {
      await supabase.auth.signOut();

      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }

      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      window.location.href = '/';
    }
  }, []);

  const value: SettingsContextType = {
    settings,
    updateNotificationSettings,
    updateEmail,
    deactivateAccount,
    logout,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
