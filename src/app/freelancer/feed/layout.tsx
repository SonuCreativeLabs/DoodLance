"use client";

import { useEffect } from 'react';
import { useLayout } from '@/contexts/LayoutContext';

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hideHeader, showNavbar } = useLayout();

  useEffect(() => {
    // Hide header and show navbar for all feed pages
    hideHeader();
    showNavbar();

    return () => {
      // Cleanup if needed
    };
  }, [hideHeader, showNavbar]);

  return <>{children}</>;
}
