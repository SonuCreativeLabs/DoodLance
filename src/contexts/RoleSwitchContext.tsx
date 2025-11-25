'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { RoleSwitchSplash } from '@/components/shared/RoleSwitchSplash';

interface RoleSwitchContextType {
  switchRole: (targetRole: 'client' | 'freelancer') => void;
  isSwitching: boolean;
}

const RoleSwitchContext = createContext<RoleSwitchContextType | undefined>(undefined);

export function RoleSwitchProvider({ children }: { children: ReactNode }) {
  const [isSwitching, setIsSwitching] = useState(false);
  const [targetRole, setTargetRole] = useState<'client' | 'freelancer'>('client');
  const router = useRouter();

  const switchRole = (role: 'client' | 'freelancer') => {
    setTargetRole(role);
    setIsSwitching(true);

    // Wait for animation/splash duration
    setTimeout(() => {
      if (role === 'client') {
        router.push('/client');
      } else {
        router.push('/freelancer'); // Changed from '/freelancer/profile'
      }

      // Hide splash after navigation (plus a small buffer for page load)
      setTimeout(() => {
        setIsSwitching(false);
      }, 500);
    }, 2000); // 2 seconds splash duration
  };

  return (
    <RoleSwitchContext.Provider value={{ switchRole, isSwitching }}>
      {children}
      <RoleSwitchSplash targetRole={targetRole} isVisible={isSwitching} />
    </RoleSwitchContext.Provider>
  );
}

export function useRoleSwitch() {
  const context = useContext(RoleSwitchContext);
  if (context === undefined) {
    throw new Error('useRoleSwitch must be used within a RoleSwitchProvider');
  }
  return context;
}
