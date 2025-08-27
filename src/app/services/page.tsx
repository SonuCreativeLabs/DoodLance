'use client';

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Check, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  type?: 'online' | 'in-person';
  deliveryTime: string;
  features?: string[];
}

interface ServicesPageProps {
  searchParams: {
    services?: string;
    freelancerName?: string;
  };
}

export default function ServicesPage({ searchParams }: ServicesPageProps) {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [freelancerName, setFreelancerName] = useState('Freelancer');
  const params = useSearchParams();
  
  // Back button handler
  const handleBack = () => {
    console.log('Back button clicked on services page');
    // Check if we have a stored URL to return to the profile preview
    const returnToPreview = sessionStorage.getItem('returnToProfilePreview');
    console.log('Stored return URL:', returnToPreview);
    
    if (returnToPreview) {
      console.log('Navigating back to profile preview');
      // Clear the stored URL
      sessionStorage.removeItem('returnToProfilePreview');
      // Navigate back to the profile preview with the stored URL
      window.location.href = returnToPreview;
      return; // Prevent further execution
    }
    
    // Fallback to browser history if available
    if (window.history.length > 1) {
      router.back();
    } else {
      // Fallback to the home page
      router.push('/');
    }
  };

  useEffect(() => {
    try {
      // Check if we're coming from the profile preview modal
      const isFromPreview = window.location.hash === '#fromPreview';
      
      if (isFromPreview) {
        // Get data from session storage
        const storedServices = sessionStorage.getItem('servicesPreviewData');
        const storedName = sessionStorage.getItem('freelancerName');
        
        if (storedServices) {
          const parsedServices = JSON.parse(storedServices);
          setServices(parsedServices);
          // Clear the stored data after using it
          sessionStorage.removeItem('servicesPreviewData');
        }
        
        if (storedName) {
          setFreelancerName(storedName);
          sessionStorage.removeItem('freelancerName');
        }
      } else {
        // Fallback to URL parameters if not coming from preview
        const servicesParam = params.get('services');
        if (servicesParam) {
          const decodedServices = JSON.parse(decodeURIComponent(servicesParam));
          setServices(decodedServices);
        }
        
        const nameParam = params.get('freelancerName');
        if (nameParam) {
          setFreelancerName(decodeURIComponent(nameParam));
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error parsing services data:', error);
      setLoading(false);
    }
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-white/5 bg-[#0F0F0F]">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="text-white/70 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="h-6 w-48 bg-white/10 rounded animate-pulse"></div>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-white/5 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
      {/* Header */}
      <div className="px-2 py-3 border-b border-white/5">
        <div className="flex items-center">
          <button 
            onClick={handleBack}
            className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
            aria-label="Go back"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
              <ArrowLeft className="h-4 w-4" />
            </div>
          </button>
          <div className="ml-3">
            <h1 className="text-lg font-semibold text-white">Professional Services</h1>
            <p className="text-white/50 text-xs">Browse and book {freelancerName}'s expert services</p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {services.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <div className="text-white/60 mb-4">No services available</div>
            <Button 
              variant="outline"
              onClick={handleBack}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {services.map((service) => (
              <div key={service.id} className="flex-shrink-0 p-5 rounded-3xl border border-white/10 bg-white/5 hover:border-purple-500/30 transition-colors flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                    {service.type && (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        service.type === 'online' 
                          ? 'bg-blue-500/10 text-blue-400' 
                          : 'bg-green-500/10 text-green-400'
                      }`}>
                        {service.type === 'online' ? 'Online' : 'In-Person'}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-white/70 mt-2 text-sm">{service.description}</p>
                  
                  {service.features && service.features.length > 0 && (
                    <ul className="mt-3 space-y-2">
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
                        {service.price}
                      </div>
                      <div className="text-sm text-white/60 bg-white/5 px-3 py-1 rounded-full">
                        {service.deliveryTime}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors">
                        <MessageCircle className="h-5 w-5" />
                      </button>
                      <button 
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-xl text-sm font-medium transition-colors"
                        onClick={() => {
                          // Handle order now
                        }}
                      >
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
