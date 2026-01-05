'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSkills } from '@/contexts/SkillsContext';
import { useExperience } from '@/contexts/ExperienceContext';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useReviews } from '@/contexts/ReviewsContext';
import { useBankAccount } from '@/contexts/BankAccountContext';
import { usePersonalDetails } from '@/contexts/PersonalDetailsContext';

export function FreelancerDataLoader() {
    const { user } = useAuth();
    const { hydrateSkills } = useSkills();
    const { hydrateExperiences } = useExperience();
    const { hydratePortfolio } = usePortfolio();
    const { hydrateReviews } = useReviews();
    const { hydrateBankAccount } = useBankAccount();
    // PersonalDetailsContext might handle its own or we can just ignore it if it's fast enough 
    // (it uses /api/user/profile which is fast, but we can optimize it too if we exposed hydration)
    const { updatePersonalDetails } = usePersonalDetails(); // This usually expects a full update, might simpler to skip for now or use if compatible.

    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        const fetchDashboard = async () => {
            if (!user) return;

            console.log('🔄 FreelancerDataLoader: Fetching dashboard data...');
            try {
                const response = await fetch('/api/freelancer/dashboard');
                if (!response.ok) return;

                const data = await response.json();
                console.log('✅ FreelancerDataLoader: Data received');

                // 1. Hydrate Skills
                if (data.skills) {
                    const skillItems = Array.isArray(data.skills)
                        ? (typeof data.skills[0] === 'string'
                            ? data.skills.map((name: string, index: number) => ({ id: `${Date.now()}-${index}`, name }))
                            : data.skills)
                        : [];
                    hydrateSkills(skillItems);
                }

                // 2. Hydrate Experience
                if (data.experiences) {
                    const mappedExp = data.experiences.map((exp: any) => ({
                        id: exp.id,
                        role: exp.title,
                        company: exp.company,
                        location: exp.location,
                        startDate: exp.startDate,
                        endDate: exp.endDate,
                        isCurrent: exp.current,
                        description: exp.description
                    }));
                    hydrateExperiences(mappedExp);
                }

                // 3. Hydrate Portfolio
                if (data.portfolios) {
                    const mappedPort = data.portfolios.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        category: item.category,
                        description: item.description,
                        image: item.images,
                        skills: typeof item.skills === 'string' ? item.skills.split(',') : (Array.isArray(item.skills) ? item.skills : [])
                    }));
                    hydratePortfolio(mappedPort);
                }

                // 4. Hydrate Reviews
                if (data.reviews) {
                    const mappedReviews = data.reviews.map((r: any) => ({
                        id: r.id,
                        author: r.client?.name || 'Anonymous',
                        rating: r.rating,
                        comment: r.comment,
                        date: new Date(r.createdAt).toISOString().split('T')[0],
                        role: 'Client',
                        isVerified: r.isVerified
                    }));
                    hydrateReviews(mappedReviews);
                }

                // 5. Hydrate Bank Account
                if (data.bankAccount) {
                    hydrateBankAccount(data.bankAccount);
                }

                setHasLoaded(true);

            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            }
        };

        // Initial load
        if (user && !hasLoaded) {
            fetchDashboard();
        }

        // Event listener for re-fetching
        const handleRefresh = () => {
            console.log('🔔 refreshProfile event received. Reloading dashboard data...');
            fetchDashboard();
        };

        window.addEventListener('refreshProfile', handleRefresh);
        return () => {
            window.removeEventListener('refreshProfile', handleRefresh);
        };

    }, [user, hasLoaded, hydrateSkills, hydrateExperiences, hydratePortfolio, hydrateReviews, hydrateBankAccount]);

    return null; // Headless component
}
