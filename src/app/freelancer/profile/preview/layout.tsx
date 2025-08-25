'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLayout } from '@/contexts/LayoutContext';

export default function ProfilePreviewLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { hideHeader, hideNavbar } = useLayout();
  const pathname = usePathname();

  useEffect(() => {
    // Hide header and navbar for all preview pages
    hideHeader();
    hideNavbar();

    // Cleanup function to restore header and navbar when leaving preview
    return () => {
      // These will be restored by the parent layout
    };
  }, [pathname, hideHeader, hideNavbar]);

  return <>{children}</>;
}
