'use client';

import React, { ReactNode } from 'react';
import { PersonalDetailsProvider } from './PersonalDetailsContext';
import { SkillsProvider } from './SkillsContext';
import { ForYouJobsProvider } from './ForYouJobsContext';
import { PortfolioProvider } from './PortfolioContext';
import { ExperienceProvider } from './ExperienceContext';
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
export function CombinedProfileProvider({ children }: CombinedProfileProviderProps) {
  return (
    <PersonalDetailsProvider>
      <SkillsProvider>
        <ForYouJobsProvider>
          <PortfolioProvider>
            <ExperienceProvider>
              <ServicesProvider>
                <ReviewsProvider>
                  <BankAccountProvider>
                    <SettingsProvider>
                      {children}
                    </SettingsProvider>
                  </BankAccountProvider>
                </ReviewsProvider>
              </ServicesProvider>
            </ExperienceProvider>
          </PortfolioProvider>
        </ForYouJobsProvider>
      </SkillsProvider>
    </PersonalDetailsProvider>
  );
}
