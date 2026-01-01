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

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsData | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }
    return defaultSettings;
  });

  const [isLoading, setIsLoading] = useState(false);

  const updateNotificationSettings = useCallback((notificationSettings: NotificationSettings) => {
    setSettings(prev => {
      if (!prev) return prev;
      const updated = { ...prev, notifications: notificationSettings };
      if (typeof window !== 'undefined') {
        localStorage.setItem('settings', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const updateEmail = useCallback((email: string) => {
    setSettings(prev => {
      if (!prev) return prev;
      const updated = { ...prev, email };
      if (typeof window !== 'undefined') {
        localStorage.setItem('settings', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const deactivateAccount = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSettings(prev => {
        if (!prev) return prev;
        const updated = { ...prev, accountStatus: 'deactivated' as const };
        if (typeof window !== 'undefined') {
          localStorage.setItem('settings', JSON.stringify(updated));
        }
        return updated;
      });

      // In a real app, this would redirect to login or show confirmation
      alert('Account deactivated successfully. You will be logged out.');
      logout();
    } catch (error) {
      console.error('Failed to deactivate account:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    // Import Supabase client
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();

    try {
      // Sign out from Supabase
      await supabase.auth.signOut();

      // Clear all stored data
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }

      // Redirect to home or login page
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if signOut fails, clear local storage and redirect
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
