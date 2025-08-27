"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useLayout } from '@/contexts/LayoutContext';
import { ModalProvider } from '@/contexts/ModalContext';

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
    if (isMainProfilePage) {
      hideHeader();
      // Keep the navbar visible
      showNavbar();
    } else {
      // Show both header and navbar on subpages
      showHeader();
      showNavbar();
    }

    return () => {
      showHeader();
      showNavbar();
    };
  }, [pathname, isMainProfilePage, hideHeader, hideNavbar, showHeader, showNavbar]);

  return <ModalProvider>{children}</ModalProvider>;
}
