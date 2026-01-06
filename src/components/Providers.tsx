'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { RealtimeProvider } from '@/providers/RealtimeProvider';
import { NavbarProvider } from '@/contexts/NavbarContext';
import { LayoutProvider } from '@/contexts/LayoutContext';
import { ChatViewProvider } from '@/contexts/ChatViewContext';
import { DateRangeProvider } from '@/contexts/DateRangeContext';
import { ModalProvider } from '@/contexts/ModalContext';
import { CombinedProfileProvider } from '@/contexts/CombinedProfileProvider';
import { AvailabilityProvider } from '@/contexts/AvailabilityContext';
import { ListingsProvider } from '@/contexts/ListingsContext';
import { RoleProvider } from '@/contexts/role-context';
import { NearbyProfessionalsProvider } from '@/contexts/NearbyProfessionalsContext';
import { PopularServicesProvider } from '@/contexts/PopularServicesContext';
import { BookingsProvider } from '@/contexts/BookingsContext';
import { ApplicationsProvider } from '@/contexts/ApplicationsContext';
import { HistoryJobsProvider } from '@/contexts/HistoryJobsContext';
import { ClientServicesProvider } from '@/contexts/ClientServicesContext';
import { HireProvider } from '@/contexts/HireContext';
import { RoleSwitchProvider } from '@/contexts/RoleSwitchContext';
import { PostedJobsProvider } from '@/contexts/PostedJobsContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <RoleProvider>
        <RealtimeProvider>
          <NavbarProvider>
            <LayoutProvider>
              <ChatViewProvider>
                <DateRangeProvider>
                  <ModalProvider>
                    <AvailabilityProvider>
                      <ListingsProvider>
                        <CombinedProfileProvider>
                          <NearbyProfessionalsProvider>
                            <PopularServicesProvider>
                              <ClientServicesProvider>
                                <BookingsProvider>
                                  <ApplicationsProvider>
                                    <HistoryJobsProvider>
                                      <PostedJobsProvider>
                                        <HireProvider>
                                          <RoleSwitchProvider>
                                            {children}
                                          </RoleSwitchProvider>
                                        </HireProvider>
                                      </PostedJobsProvider>
                                    </HistoryJobsProvider>
                                  </ApplicationsProvider>
                                </BookingsProvider>
                              </ClientServicesProvider>
                            </PopularServicesProvider>
                          </NearbyProfessionalsProvider>
                        </CombinedProfileProvider>
                      </ListingsProvider>
                    </AvailabilityProvider>
                  </ModalProvider>
                </DateRangeProvider>
              </ChatViewProvider>
            </LayoutProvider>
          </NavbarProvider>
        </RealtimeProvider>
      </RoleProvider>
    </AuthProvider>
  );
}
