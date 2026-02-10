"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface TutorialStep {
    targetId: string;
    title: string;
    description: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
    alignment?: 'start' | 'center' | 'end';
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

    const hasSeenTutorial = (id: string) => seenTours.includes(id);

    const markTutorialSeen = (id: string) => {
        if (!seenTours.includes(id)) {
            const updated = [...seenTours, id];
            setSeenTours(updated);
            localStorage.setItem('doodlance_seen_tutorials', JSON.stringify(updated));
        }
    };

    const startTutorial = (config: TutorialConfig) => {
        setConfig(config);
        setActiveStep(0);
        setIsOpen(true);
    };

    const nextStep = () => {
        if (config && activeStep < config.steps.length - 1) {
            setActiveStep(prev => prev + 1);
        } else {
            closeTutorial();
        }
    };

    const prevStep = () => {
        if (activeStep > 0) {
            setActiveStep(prev => prev - 1);
        }
    };

    const closeTutorial = () => {
        if (config) {
            markTutorialSeen(config.id);
        }
        setIsOpen(false);
        setConfig(null);
        setActiveStep(0);
    };

    const resetTutorials = () => {
        setSeenTours([]);
        localStorage.removeItem('doodlance_seen_tutorials');
        window.location.reload(); // Reload to trigger the auto-tours
    };

    return (
        <TutorialContext.Provider
            value={{
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
            }}
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
