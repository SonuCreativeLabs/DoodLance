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

    // Ref to store cleanup function
    const cleanupRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (!isOpen || !config) return;

        const step = config.steps[activeStep];

        // Trigger onStart
        if (step.onStart) {
            step.onStart();
        }

        let retries = 0;
        const maxRetries = 150; // 15 seconds
        let retryTimer: NodeJS.Timeout;
        let animationId: NodeJS.Timeout;

        // Define handleResize first so it can be used in cleanup
        let element: HTMLElement | null = null;
        let lastRect = { left: 0, top: 0, width: 0, height: 0, bottom: 0, right: 0, x: 0, y: 0, toJSON: () => { } } as DOMRect;

        const handleResize = () => {
            if (!element) return;
            const newRect = element.getBoundingClientRect();
            if (
                Math.abs(newRect.left - lastRect.left) > 0.5 ||
                Math.abs(newRect.top - lastRect.top) > 0.5 ||
                Math.abs(newRect.width - lastRect.width) > 0.5 ||
                Math.abs(newRect.height - lastRect.height) > 0.5
            ) {
                lastRect = newRect;
                setTargetRect(newRect);
            }
        };

        const cleanup = () => {
            if (retryTimer) clearTimeout(retryTimer);
            if (animationId) clearInterval(animationId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleResize);
            cleanupRef.current = null;
        };
        cleanupRef.current = cleanup;

        const attemptFind = () => {
            const findVisibleElement = (id: string) => {
                // Use querySelectorAll to find all elements with the ID (handles duplicate IDs in responsive layouts)
                const elements = document.querySelectorAll(`[id="${id}"]`);
                for (let i = 0; i < elements.length; i++) {
                    const el = elements[i] as HTMLElement;
                    if (el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0) {
                        return el;
                    }
                }
                return null;
            };

            if (step.targetId.includes(',')) {
                const targetIds = step.targetId.split(',').map(id => id.trim());
                for (const id of targetIds) {
                    const el = findVisibleElement(id);
                    if (el) {
                        element = el;
                        break;
                    }
                }
            } else {
                element = findVisibleElement(step.targetId);
            }

            if (element) {
                lastRect = element.getBoundingClientRect();
                setTargetRect(lastRect);
                setIsReady(true);

                window.addEventListener('resize', handleResize);
                window.addEventListener('scroll', handleResize);

                // Poll for rect changes (handles inner scrolls)
                animationId = setInterval(handleResize, 32);

                const computedStyle = window.getComputedStyle(element);
                if (computedStyle.position !== 'fixed') {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                if (retries < maxRetries) {
                    retries++;
                    retryTimer = setTimeout(attemptFind, 100);
                } else {
                    console.warn(`Tutorial target not found: ${step.targetId}`);
                    setIsReady(false);
                }
            }
        };

        attemptFind();

        return cleanup;
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

        if (currentStep.position === 'bottom-center') {
            return {
                position: 'fixed',
                bottom: '24px',
                left: '0',
                right: '0',
                margin: '0 auto',
                width: 'min(320px, 90vw)',
                zIndex: 9999,
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
            left = targetRect.right + spacing + 10;
            top = targetRect.top + (targetRect.height / 2) - (popoverHeight / 2);
        } else {
            // Auto-position fallback
            if (targetRect.bottom + spacing + popoverHeight > window.innerHeight) {
                top = targetRect.top - spacing - popoverHeight;
            }
        }

        // Auto-flip if top position is too close to viewport top
        if (top < 10 && currentStep.position === 'top') {
            top = targetRect.bottom + spacing;
        }

        // Auto-flip if bottom position is too close to viewport bottom
        if (top + popoverHeight > window.innerHeight - 10 && currentStep.position === 'bottom') {
            top = targetRect.top - spacing - popoverHeight;
        }

        // CLAMP: Keep within viewport horizontally
        if (left < 10) left = 10;
        if (left + popoverWidth > window.innerWidth - 10) left = window.innerWidth - popoverWidth - 10;

        // CLAMP: Keep within viewport vertically
        if (top < 10) top = 10;
        if (top + popoverHeight > window.innerHeight - 10) top = window.innerHeight - popoverHeight - 10;

        return {
            position: 'fixed',
            zIndex: 9999,
            width: `${popoverWidth}px`,
            left: `${left}px`,
            top: `${top}px`,
        };
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
                            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
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
                transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
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
                        {config.steps.map((_, idx) => {
                            // Logic to show only 5 dots: active step, 2 before, 2 after
                            // Adjust window if near start or end
                            let start = activeStep - 2;
                            let end = activeStep + 2;

                            if (start < 0) {
                                end += Math.abs(start);
                                start = 0;
                            }
                            if (end >= config.steps.length) {
                                start -= (end - config.steps.length + 1);
                                end = config.steps.length - 1;
                            }
                            start = Math.max(0, start);

                            if (idx >= start && idx <= end) {
                                return (
                                    <div
                                        key={idx}
                                        className={`h-1 rounded-full transition-all duration-300 ${idx === activeStep ? 'w-4 bg-purple-500' : 'w-1 bg-white/20'}`}
                                    />
                                );
                            }
                            return null;
                        })}
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
