import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavbarContextType {
  isNavbarVisible: boolean;
  setNavbarVisibility: (isVisible: boolean) => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const setNavbarVisibility = (isVisible: boolean) => {
    setIsNavbarVisible(isVisible);
  };

  return (
    <NavbarContext.Provider value={{ isNavbarVisible, setNavbarVisibility }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
}
