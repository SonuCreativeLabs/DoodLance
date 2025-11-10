'use client';

import React, { ReactNode } from 'react';
import { PersonalDetailsProvider } from './PersonalDetailsContext';
import { SkillsProvider } from './SkillsContext';
import { PortfolioProvider } from './PortfolioContext';
import { ExperienceProvider } from './ExperienceContext';
import { ServicesProvider } from './ServicesContext';
import { ReviewsProvider } from './ReviewsContext';

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
        <PortfolioProvider>
          <ExperienceProvider>
            <ServicesProvider>
              <ReviewsProvider>
                {children}
              </ReviewsProvider>
            </ServicesProvider>
          </ExperienceProvider>
        </PortfolioProvider>
      </SkillsProvider>
    </PersonalDetailsProvider>
  );
}
