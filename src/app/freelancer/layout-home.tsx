"use client";

import { useEffect } from 'react';
import { useLayout } from '@/contexts/LayoutContext';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showHeader, showNavbar } = useLayout();

  useEffect(() => {
    // Always show header and navbar for the home page
    showHeader();
    showNavbar();
  }, [showHeader, showNavbar]);

  return <>{children}</>;
}
