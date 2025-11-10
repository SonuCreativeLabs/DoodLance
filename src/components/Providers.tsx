'use client';

import { ReactNode } from 'react';
import { NavbarProvider } from '@/contexts/NavbarContext';
import { LayoutProvider } from '@/contexts/LayoutContext';
import { ChatViewProvider } from '@/contexts/ChatViewContext';
import { DateRangeProvider } from '@/contexts/DateRangeContext';
import { ModalProvider } from '@/contexts/ModalContext';
import { CombinedProfileProvider } from '@/contexts/CombinedProfileProvider';
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
                <CombinedProfileProvider>
                  {children}
                </CombinedProfileProvider>
              </ModalProvider>
            </DateRangeProvider>
          </ChatViewProvider>
        </LayoutProvider>
      </NavbarProvider>
    </RoleProvider>
  );
}
