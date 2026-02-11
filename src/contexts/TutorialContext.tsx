"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';

export interface TutorialStep {
    targetId: string;
    title: string;
    description: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'bottom-center';
    alignment?: 'start' | 'center' | 'end';
    offsetY?: number; // Vertical offset in pixels (negative moves up, positive moves down)
    onStart?: () => void;
}

export interface TutorialConfig {
    id: string;
    steps: TutorialStep[];
}

interface TutorialContextType {
    activeStep: number;
    isOpen: boolean;
    config: TutorialConfig | null;
    startTutorial: (config: TutorialConfig) => void;
    nextStep: () => void;
    prevStep: () => void;
    closeTutorial: () => void;
    hasSeenTutorial: (id: string) => boolean;
    markTutorialSeen: (id: string) => void;
    resetTutorials: () => void;
    clearTutorialHistory: (id: string) => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider = ({ children }: { children: ReactNode }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState<TutorialConfig | null>(null);
    const [seenTours, setSeenTours] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('doodlance_seen_tutorials');
        if (saved) {
            try {
                setSeenTours(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse seen tutorials', e);
            }
        }
    }, []);

    const hasSeenTutorial = useCallback((id: string) => seenTours.includes(id), [seenTours]);

    const markTutorialSeen = useCallback((id: string) => {
        if (!seenTours.includes(id)) {
            const updated = [...seenTours, id];
            setSeenTours(updated);
            localStorage.setItem('doodlance_seen_tutorials', JSON.stringify(updated));
        }
    }, [seenTours]);

    const closeTutorial = useCallback(() => {
        if (config) {
            markTutorialSeen(config.id);

            // Remove tutorial query parameter from URL to prevent restart
            if (typeof window !== 'undefined') {
                const url = new URL(window.location.href);
                if (url.searchParams.get('tutorial') === config.id) {
                    url.searchParams.delete('tutorial');
                    window.history.replaceState({}, '', url.toString());
                }
            }
        }
        setIsOpen(false);
        setConfig(null);
        setActiveStep(0);
    }, [config, markTutorialSeen]);

    const startTutorial = useCallback((config: TutorialConfig) => {
        setConfig(config);
        setActiveStep(0);
        setIsOpen(true);
    }, []);

    const nextStep = useCallback(() => {
        if (config && activeStep < config.steps.length - 1) {
            setActiveStep(prev => prev + 1);
        } else {
            closeTutorial();
        }
    }, [config, activeStep, closeTutorial]);

    const prevStep = useCallback(() => {
        if (activeStep > 0) {
            setActiveStep(prev => prev - 1);
        }
    }, [activeStep]);

    const resetTutorials = useCallback(() => {
        setSeenTours([]);
        localStorage.removeItem('doodlance_seen_tutorials');
        window.location.reload(); // Reload to trigger the auto-tours
    }, []);

    const clearTutorialHistory = useCallback((id: string) => {
        const updated = seenTours.filter(tourId => tourId !== id);
        setSeenTours(updated);
        localStorage.setItem('doodlance_seen_tutorials', JSON.stringify(updated));
    }, [seenTours]);

    const value = useMemo(() => ({
        activeStep,
        isOpen,
        config,
        startTutorial,
        nextStep,
        prevStep,
        closeTutorial,
        hasSeenTutorial,
        markTutorialSeen,
        resetTutorials,
        clearTutorialHistory
    }), [
        activeStep,
        isOpen,
        config,
        startTutorial,
        nextStep,
        prevStep,
        closeTutorial,
        hasSeenTutorial,
        markTutorialSeen,
        resetTutorials,
        clearTutorialHistory
    ]);

    return (
        <TutorialContext.Provider
            value={value}
        >
            {children}
        </TutorialContext.Provider>
    );
};

export const useTutorial = () => {
    const context = useContext(TutorialContext);
    if (context === undefined) {
        throw new Error('useTutorial must be used within a TutorialProvider');
    }
    return context;
};
