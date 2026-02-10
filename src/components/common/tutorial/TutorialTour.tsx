"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTutorial } from '@/contexts/TutorialContext';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TutorialTour = () => {
    const { config, activeStep, isOpen, nextStep, prevStep, closeTutorial } = useTutorial();
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!isOpen || !config) return;

        const step = config.steps[activeStep];

        // Trigger onStart if defined (before checking for element)
        if (step.onStart) {
            step.onStart();
        }

        const findElementAndSetRect = () => {
            const element = document.getElementById(step.targetId);
            if (element) {
                const lastRectRef = { current: element.getBoundingClientRect() };
                setTargetRect(lastRectRef.current);

                const updateRect = () => {
                    const newRect = element.getBoundingClientRect();
                    const lastRect = lastRectRef.current;

                    // Only update state if position or size changed significantly (threshold: 0.5px)
                    if (
                        Math.abs(newRect.left - lastRect.left) > 0.5 ||
                        Math.abs(newRect.top - lastRect.top) > 0.5 ||
                        Math.abs(newRect.width - lastRect.width) > 0.5 ||
                        Math.abs(newRect.height - lastRect.height) > 0.5
                    ) {
                        lastRectRef.current = newRect;
                        setTargetRect(newRect);
                    }
                };

                updateRect();
                window.addEventListener('resize', updateRect);
                window.addEventListener('scroll', updateRect);

                // Continuous updates to handle animating targets
                const animationId = setInterval(updateRect, 32);

                setIsReady(true);

                // Only scroll into view if element is not fixed position
                const computedStyle = window.getComputedStyle(element);
                if (computedStyle.position !== 'fixed') {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

                return () => {
                    window.removeEventListener('resize', updateRect);
                    window.removeEventListener('scroll', updateRect);
                    clearInterval(animationId);
                };
            } else {
                console.warn(`Tutorial target not found: ${step.targetId}`);
                setIsReady(false);
                setTargetRect(null);
            }
        };

        // Small delay to allow onStart UI transitions to begin
        const timer = setTimeout(findElementAndSetRect, 100);
        return () => clearTimeout(timer);
    }, [isOpen, config, activeStep]);

    if (!isOpen || !config || !isReady || !targetRect) return null;

    const currentStep = config.steps[activeStep];
    const isLastStep = activeStep === config.steps.length - 1;

    // Calculate popover position
    const getPopoverStyles = (): React.CSSProperties => {
        const spacing = 24;
        const popoverWidth = 320;
        const popoverHeight = 200; // estimated

        if (currentStep.position === 'center') {
            return {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${popoverWidth}px`,
                zIndex: 1000,
            };
        }

        let top = targetRect.bottom + spacing;
        let left = targetRect.left + (targetRect.width / 2) - (popoverWidth / 2);

        // Respect explicit position
        if (currentStep.position === 'top') {
            top = targetRect.top - spacing - popoverHeight;
        } else if (currentStep.position === 'bottom') {
            top = targetRect.bottom + spacing;
        } else if (currentStep.position === 'left') {
            left = targetRect.left - spacing - popoverWidth;
            top = targetRect.top + (targetRect.height / 2) - (popoverHeight / 2);
        } else if (currentStep.position === 'right') {
            left = targetRect.right + spacing + 10; // Extra spacing to prevent overlap
            top = targetRect.top + (targetRect.height / 2) - (popoverHeight / 2);
        } else {
            // Auto-position fallback
            if (targetRect.bottom + spacing + popoverHeight > window.innerHeight) {
                top = targetRect.top - spacing - popoverHeight;
            }
        }

        // Keep within viewport
        if (left < 10) left = 10;
        if (left + popoverWidth > window.innerWidth - 10) left = window.innerWidth - popoverWidth - 10;

        const style: React.CSSProperties = {
            position: 'fixed',
            zIndex: 1000,
            width: `${popoverWidth}px`,
            left: `${left}px`,
        };

        let effectivePosition = currentStep.position;

        // Auto-flip if top position is too close to viewport top
        if (effectivePosition === 'top' && targetRect.top < popoverHeight + spacing + 20) {
            effectivePosition = 'bottom';
        }

        if (effectivePosition === 'top') {
            // For top position, pin to bottom to avoid ensuring height calculation
            // Bottom of popover should be at targetRect.top - spacing
            style.bottom = `${window.innerHeight - (targetRect.top - spacing)}px`;
            // Reset top
            style.top = 'auto';
        } else if (effectivePosition === 'bottom') {
            const offsetY = currentStep.offsetY || 0;
            style.top = `${targetRect.bottom + spacing + offsetY}px`;
        } else {
            // Default top calculation
            const offsetY = currentStep.offsetY || 0;
            style.top = `${top + offsetY}px`;

            // Handle alignment overrides for side-positioned elements
            if ((currentStep.position === 'left' || currentStep.position === 'right') && currentStep.alignment === 'end') {
                // Align to bottom of target with extra spacing
                style.bottom = `${window.innerHeight - targetRect.bottom + spacing + 10 - offsetY}px`;
                style.top = 'auto'; // release top
            }
        }


        return style;
    };

    return (
        <div className="fixed inset-0 z-[999] pointer-events-none">
            {/* Spotlight Backdrop */}
            <svg className="absolute inset-0 w-full h-full pointer-events-auto">
                <defs>
                    <mask id="spotlight-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <motion.rect
                            initial={false}
                            animate={{
                                x: targetRect.left - 2,
                                y: targetRect.top - 2,
                                width: targetRect.width + 4,
                                height: targetRect.height + 4,
                                rx: Math.abs(targetRect.width - targetRect.height) < 2 ? 999 : 12,
                            }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            fill="black"
                        />
                    </mask>
                </defs>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="rgba(0, 0, 0, 0.7)"
                    mask="url(#spotlight-mask)"
                />
            </svg>

            {/* Popover */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ type: 'spring', damping: 20, stiffness: 250 }}
                style={getPopoverStyles()}
                className="pointer-events-auto bg-[#1E1E1E] border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl"
            >
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white">{currentStep.title}</h3>
                    <button
                        onClick={closeTutorial}
                        className="p-1 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <p className="text-white/70 text-sm leading-relaxed mb-6">
                    {currentStep.description}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                        {config.steps.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1 rounded-full transition-all duration-300 ${idx === activeStep ? 'w-4 bg-purple-500' : 'w-1 bg-white/20'}`}
                            />
                        ))}
                    </div>

                    <div className="flex gap-2">
                        {activeStep > 0 && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={prevStep}
                                className="bg-transparent border-white/10 text-white/70 hover:bg-white/5"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                        )}
                        <Button
                            size="sm"
                            onClick={nextStep}
                            className="bg-gradient-to-r from-purple-600 to-purple-400 text-white hover:shadow-lg hover:shadow-purple-500/20"
                        >
                            {isLastStep ? 'Finish' : 'Next'}
                            {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
