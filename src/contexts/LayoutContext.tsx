'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextType {
  isHeaderVisible: boolean;
  isNavbarVisible: boolean;
  hideHeader: () => void;
  showHeader: () => void;
  hideNavbar: () => void;
  showNavbar: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const hideHeader = () => setIsHeaderVisible(false);
  const showHeader = () => setIsHeaderVisible(true);
  const hideNavbar = () => setIsNavbarVisible(false);
  const showNavbar = () => setIsNavbarVisible(true);

  return (
    <LayoutContext.Provider
      value={{
        isHeaderVisible,
        isNavbarVisible,
        hideHeader,
        showHeader,
        hideNavbar,
        showNavbar,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
