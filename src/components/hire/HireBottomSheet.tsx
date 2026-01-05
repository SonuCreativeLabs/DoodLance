"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useHire, ServiceItem } from '@/contexts/HireContext';
import { useAuth } from '@/contexts/AuthContext';

interface HireBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  freelancerId: string;
  freelancerName: string;
  freelancerImage: string;
  freelancerRating?: number | null;
  freelancerReviewCount?: number | null;
  services: ServiceItem[];
}

export function HireBottomSheet({
  isOpen,
  onClose,
  freelancerId,
  freelancerName,
  freelancerImage,
  freelancerRating,
  freelancerReviewCount,
  services
}: HireBottomSheetProps) {
  const router = useRouter();
  const { state, setFreelancer, setSelectedService, removeService, resetHireState } = useHire();
  const { user } = useAuth();
  const prevFreelancerIdRef = React.useRef<string | null>(null);

  console.log('🔍 [HIRE SHEET] Render:', {
    isOpen,
    freelancerId,
    hasUser: !!user,
    userId: user?.id,
    servicesCount: services?.length,
    selectedCount: state.selectedServices.length
  });

  useEffect(() => {
    console.log('🔍 [HIRE SHEET] useEffect triggered:', { isOpen, freelancerId });
    if (isOpen) {
      // Reset if switching to a different freelancer
      if (prevFreelancerIdRef.current !== null && prevFreelancerIdRef.current !== freelancerId) {
        console.log('🔄 [HIRE SHEET] Switching freelancers, resetting state');
        resetHireState();
      }
      prevFreelancerIdRef.current = freelancerId;

      // Set freelancer data
      console.log('✅ [HIRE SHEET] Setting freelancer data');
      setFreelancer(freelancerId, freelancerName, freelancerImage, freelancerRating, freelancerReviewCount, services);
    }
  }, [isOpen, freelancerId, freelancerName, freelancerImage, freelancerRating, freelancerReviewCount, services, setFreelancer, resetHireState]);

  const handleServiceToggle = (service: ServiceItem) => {
    const isSelected = state.selectedServices.some(s => s.id === service.id);

    if (isSelected) {
      removeService(service.id);
    } else {
      setSelectedService(service);
    }
  };



  // ... (inside the component)

  const handleContinue = () => {
    console.log('🔍 [HIRE SHEET] Continue clicked:', {
      selectedServicesCount: state.selectedServices.length,
      hasUser: !!user,
      userId: user?.id
    });

    if (state.selectedServices.length > 0) {
      if (!user) {
        console.warn('⚠️ [HIRE SHEET] User not authenticated, cannot proceed');
        // User needs to login - but we can't show dialog here
        // The parent component should handle this
        return;
      }

      console.log('✅ [HIRE SHEET] Proceeding to booking-date');
      onClose();
      router.push('/client/hire/booking-date');
    } else {
      console.warn('⚠️ [HIRE SHEET] No services selected');
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[9998] backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#1E1E1E] rounded-t-3xl max-h-[80vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10">
                    <img
                      src={freelancerImage}
                      alt={freelancerName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Hire {freelancerName}</h3>
                    <p className="text-sm text-white/60">Select a service to continue</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 min-h-0">
                <div className="space-y-4">
                  <h4 className="text-white font-medium mb-4">Available Services</h4>

                  {(!services || services.length === 0) ? (
                    <div className="text-center py-8 text-white/60">
                      <p>No services available for this freelancer.</p>
                    </div>
                  ) : (
                    services.map((service) => {
                      const isSelected = state.selectedServices.some(s => s.id === service.id);

                      return (
                        <div
                          key={service.id}
                          role="button"
                          tabIndex={0}
                          className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${isSelected
                            ? 'border-purple-500/50 bg-purple-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                            }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleServiceToggle(service);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleServiceToggle(service);
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected
                                ? 'border-purple-500 bg-purple-500'
                                : 'border-white/30'
                                }`}>
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <div>
                                <h5 className="font-medium text-white">{service.title}</h5>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="text-sm font-semibold text-purple-400">
                                    ₹{typeof service.price === 'string'
                                      ? parseFloat(service.price.replace(/[^\d.]/g, ''))
                                      : service.price} / {service.deliveryTime}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 p-6 border-t border-white/10 bg-[#1E1E1E]">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-white/60">
                    {state.selectedServices.length > 0 ? '1 service selected' : 'No service selected'}
                  </div>
                  {state.selectedServices.length > 0 && (
                    <div className="text-sm font-medium text-white">
                      Total: ₹{services
                        .filter(s => state.selectedServices.some(selected => selected.id === s.id))
                        .reduce((total, service) => {
                          const price = typeof service.price === 'string'
                            ? parseFloat(service.price.replace(/[^\d.]/g, ''))
                            : service.price;
                          return total + price;
                        }, 0)
                        .toLocaleString()}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleContinue}
                  disabled={state.selectedServices.length === 0}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${state.selectedServices.length > 0
                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-lg'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                    }`}
                >
                  Confirm
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </>
  );
}
