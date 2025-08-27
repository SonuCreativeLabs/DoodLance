"use client";

import { useEffect } from 'react';
import { useLayout } from '@/contexts/LayoutContext';

export default function InboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hideHeader, showNavbar } = useLayout();

  useEffect(() => {
    hideHeader();
    showNavbar();

    return () => {
      showNavbar();
    };
  }, [hideHeader, showNavbar]);

  return <>{children}</>;
}
