"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useLayout } from '@/contexts/LayoutContext';
import { ModalProvider } from '@/contexts/ModalContext';
import { FreelancerProfileProvider } from '@/contexts/FreelancerProfileContext';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { hideHeader, hideNavbar, showHeader, showNavbar } = useLayout();
  // Check if we're on the main profile page or a subpage
  const isMainProfilePage = pathname === '/freelancer/profile' || pathname === '/freelancer/profile/';

  useEffect(() => {
    // Hide both header and navbar on all profile pages
    hideHeader();
    hideNavbar();

    return () => {
      showHeader();
      showNavbar();
    };
  }, [hideHeader, hideNavbar, showHeader, showNavbar]);

  return (
    <FreelancerProfileProvider>
      <ModalProvider>{children}</ModalProvider>
    </FreelancerProfileProvider>
  );
}
