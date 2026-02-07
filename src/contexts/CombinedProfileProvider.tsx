'use client';

import React, { ReactNode } from 'react';
import { PersonalDetailsProvider } from './PersonalDetailsContext';
import { SkillsProvider } from './SkillsContext';
import { ForYouJobsProvider } from './ForYouJobsContext';
import { AchievementsProvider } from './AchievementsContext';
import { ServicesProvider } from './ServicesContext';
import { ReviewsProvider } from './ReviewsContext';
import { BankAccountProvider } from './BankAccountContext';
import { SettingsProvider } from './SettingsContext';

interface CombinedProfileProviderProps {
  children: ReactNode;
}

/**
 * CombinedProfileProvider wraps all profile-related context providers
 * Use this in your root layout instead of individual providers
 */
import { FreelancerDataLoader } from '@/components/freelancer/FreelancerDataLoader';

export function CombinedProfileProvider({ children }: CombinedProfileProviderProps) {
  return (
    <PersonalDetailsProvider>
      <SkillsProvider skipInitialFetch={true}>
        <ForYouJobsProvider>
          <AchievementsProvider skipInitialFetch={true}>
            <ServicesProvider>
              <ReviewsProvider skipInitialFetch={true}>
                <BankAccountProvider skipInitialFetch={true}>
                  <SettingsProvider>
                    <FreelancerDataLoader />
                    {children}
                  </SettingsProvider>
                </BankAccountProvider>
              </ReviewsProvider>
            </ServicesProvider>
          </AchievementsProvider>
        </ForYouJobsProvider>
      </SkillsProvider>
    </PersonalDetailsProvider>
  );
}
