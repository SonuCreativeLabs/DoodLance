'use client';

import { ReactNode } from 'react';
import { NavbarProvider } from '@/contexts/NavbarContext';
import { LayoutProvider } from '@/contexts/LayoutContext';
import { ChatViewProvider } from '@/contexts/ChatViewContext';
import { DateRangeProvider } from '@/contexts/DateRangeContext';
import { ModalProvider } from '@/contexts/ModalContext';
import { CombinedProfileProvider } from '@/contexts/CombinedProfileProvider';
import { AvailabilityProvider } from '@/contexts/AvailabilityContext';
import { RoleProvider } from '@/contexts/role-context';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <RoleProvider>
      <NavbarProvider>
        <LayoutProvider>
          <ChatViewProvider>
            <DateRangeProvider>
              <ModalProvider>
                <AvailabilityProvider>
                  <CombinedProfileProvider>
                    {children}
                  </CombinedProfileProvider>
                </AvailabilityProvider>
              </ModalProvider>
            </DateRangeProvider>
          </ChatViewProvider>
        </LayoutProvider>
      </NavbarProvider>
    </RoleProvider>
  );
}
