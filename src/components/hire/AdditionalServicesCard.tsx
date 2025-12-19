"use client";

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useHire } from '@/contexts/HireContext';

interface AdditionalServicesCardProps {
  freelancerId: string;
  freelancerServices: any[]; // This should be populated with actual freelancer services
}

export default function AdditionalServicesCard({
  freelancerId,
  freelancerServices
}: AdditionalServicesCardProps) {
  const { state, addService, addToCart } = useHire();
  const [expanded, setExpanded] = useState(false);

  // Use freelancer's actual services, filtered to exclude already selected ones
  const additionalServices = freelancerServices.filter(
    service => !state.selectedServices.some(selected => selected.id === service.id)
  );

  const handleAddService = (service: any) => {
    addService(service);
    // Also add to cart with current date/time if available
    addToCart(service, state.selectedDate, state.selectedTime, state.selectedDuration);
  };

  if (additionalServices.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div>
          <h4 className="text-white font-medium">Add More Services</h4>
          <p className="text-sm text-white/60">{additionalServices.length} additional service{additionalServices.length !== 1 ? 's' : ''} available</p>
        </div>
        <div className={`transform transition-transform ${expanded ? 'rotate-45' : ''}`}>
          <Plus className="w-5 h-5 text-purple-400" />
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {additionalServices.map((service) => (
            <div key={service.id} className="p-3 bg-[#1E1E1E] rounded-lg border border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-medium text-white text-sm">{service.title}</h5>
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                      {service.category}
                    </span>
                  </div>
                  <p className="text-xs text-white/70 mb-2">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-white">{service.price}</div>
                    <div className="text-xs text-white/60">{service.deliveryTime}</div>
                  </div>
                </div>

                <button
                  onClick={() => handleAddService(service)}
                  className="ml-3 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 hover:bg-purple-500/30 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
