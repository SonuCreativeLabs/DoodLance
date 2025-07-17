'use client';

import { useEffect } from 'react';
import { useLayout } from '@/contexts/LayoutContext';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { hideHeader, hideNavbar, showHeader, showNavbar } = useLayout();

  useEffect(() => {
    // Hide header and navbar when component mounts
    hideHeader();
    hideNavbar();

    // Cleanup function to show header and navbar when component unmounts
    return () => {
      showHeader();
      showNavbar();
    };
  }, [hideHeader, hideNavbar, showHeader, showNavbar]);

  return <>{children}</>;
}

export default function VerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutContent>{children}</LayoutContent>;
}
