'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Check, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { professionals } from '@/app/client/nearby/mockData';

export type Service = {
  id: string;
  title: string;
  description: string;
  price: string | number;
  deliveryTime: string;
  features?: string[];
  category?: string;
};

export default function ServicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const freelancerId = searchParams.get('freelancerId');
  
  const [services, setServices] = useState<Service[]>([]);
  const [freelancerName, setFreelancerName] = useState('');

  // Check if we're viewing a freelancer's services
  useEffect(() => {
    if (freelancerId) {
      const freelancer = professionals.find(p => p.id.toString() === freelancerId);
      if (freelancer) {
        setServices(freelancer.services || []);
        setFreelancerName(freelancer.name);
      }
    }
  }, [freelancerId]);

  // Hide header and navbar for this page
  useEffect(() => {
    const header = document.querySelector('header');
    const navbar = document.querySelector('nav');
    
    if (header) header.style.display = 'none';
    if (navbar) navbar.style.display = 'none';
    
    return () => {
      if (header) header.style.display = '';
      if (navbar) navbar.style.display = '';
    };
  }, []);

  const handleBack = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('scrollToServices', 'true');
      
      // Check if we're viewing a freelancer's services
      const urlParams = new URLSearchParams(window.location.search);
      const freelancerId = urlParams.get('freelancerId');
      
      if (freelancerId) {
        // Go back to the freelancer detail page
        const freelancerPath = `/client/freelancer/${freelancerId}`;
        const returnUrl = `${window.location.origin}${freelancerPath}#services`;
        sessionStorage.setItem('returnToProfilePreview', returnUrl);
        router.push(`${freelancerPath}#services`);
      } else {
        // Go back to user's profile
        const returnUrl = sessionStorage.getItem('returnToProfilePreview');
        if (returnUrl) {
          try {
            const u = new URL(returnUrl);
            const relative = `${u.pathname}${u.search}${u.hash}`;
            router.push(relative);
            return;
          } catch {
            // fall through to default path
          }
        }
        // Fallbacks
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push('/client/nearby');
        }
      }
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {/* Sticky Header with back button and title */}
      <div className="sticky top-0 z-50 px-4 py-2 border-b border-white/5 bg-[#0f0f0f]/95 backdrop-blur-sm">
        <div className="flex items-center">
          <button 
            onClick={handleBack}
            className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
            aria-label="Back to profile preview"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
              <ArrowLeft className="h-4 w-4" />
            </div>
          </button>
          <div className="ml-3">
            <h1 className="text-lg font-semibold text-white">Services</h1>
            <p className="text-white/50 text-xs">Professional services offered by {freelancerName}</p>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="container mx-auto px-4 py-6">
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="p-5 rounded-3xl border border-white/10 bg-white/5 hover:border-purple-500/30 transition-colors flex flex-col h-full"
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                    </div>

                    <p className="text-white/70 text-sm mb-4">{service.description}</p>

                    {service.features && service.features.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start text-sm text-white/80">
                            <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mt-4 pt-4 relative">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold text-white">
                          {typeof service.price === 'string' && service.price.includes('₹') 
                            ? service.price 
                            : `₹${service.price}`
                          }
                        </div>
                        <div className="text-sm text-white/60 bg-white/5 px-3 py-1 rounded-full">
                          {service.deliveryTime}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-xl text-sm font-medium transition-colors">
                          Hire Me
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 rounded-3xl border border-white/10 bg-white/5">
            <Clock className="h-12 w-12 mx-auto text-white/20 mb-4" />
            <h3 className="text-lg font-medium text-white">No services available</h3>
            <p className="text-white/60 mt-1">This freelancer hasn't added any services yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
