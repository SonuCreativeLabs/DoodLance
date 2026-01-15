'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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

  const pathname = usePathname();

  const switchRole = (role: 'client' | 'freelancer') => {
    setTargetRole(role);
    setIsSwitching(true);

    // Wait for minimum splash animation duration
    setTimeout(() => {
      if (role === 'client') {
        router.push('/client');
      } else {
        router.push('/freelancer/profile');
      }
      // We don't turn off isSwitching here anymore.
      // We wait for the pathname to change in the useEffect below.
    }, 2000);
  };

  // Watch for path changes to turn off the splash screen
  React.useEffect(() => {
    if (isSwitching) {
      const isTargetReached =
        (targetRole === 'client' && pathname.startsWith('/client')) ||
        (targetRole === 'freelancer' && pathname.startsWith('/freelancer'));

      if (isTargetReached) {
        // Small buffer to ensure page is painted
        const timer = setTimeout(() => {
          setIsSwitching(false);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname, isSwitching, targetRole]);


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
