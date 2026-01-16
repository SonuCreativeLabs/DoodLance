'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRole } from '@/contexts/role-context';
import { ServiceVideoCarousel } from '@/components/common/ServiceVideoCarousel';
import { Badge } from '@/components/ui/badge';

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  type?: 'online' | 'in-person';
  deliveryTime: string;
  features?: string[];
  category?: string;
  videoUrls?: string[];
}

interface ServicesPageProps {
  searchParams: {
    services?: string;
    freelancerName?: string;
  };
}

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [freelancerName, setFreelancerName] = useState('Freelancer');
  const [showFreelancerMessage, setShowFreelancerMessage] = useState(false);
  const params = useSearchParams();
  const { role } = useRole();

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
      try {
        const u = new URL(returnToPreview);
        const relative = `${u.pathname}${u.search}${u.hash}`;
        router.push(relative);
      } catch {
        router.push('/freelancer/profile');
      }
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
      <div className="sticky top-0 z-50 px-4 py-2 border-b border-white/5 bg-[#0f0f0f]/95 backdrop-blur-sm">
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
            <p className="text-white/50 text-xs">Browse and book {freelancerName}&apos;s expert services</p>
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
              <div key={service.id} className="rounded-3xl border border-white/5 bg-[#1E1E1E] flex flex-col relative overflow-hidden group hover:border-white/10 transition-colors">
                {/* Video Carousel Header */}
                <ServiceVideoCarousel
                  videoUrls={service.videoUrls?.filter(url => url) || []}
                  onVideoClick={(url) => window.open(url, '_blank')}
                  className="aspect-video w-full object-cover rounded-t-3xl"
                />

                <div className="p-6 flex flex-col flex-1">
                  {service.category && (
                    <div className="mb-4 flex justify-start">
                      <Badge className="bg-white/10 text-white/80 border-white/20 px-2 py-0.5 text-xs font-normal">
                        {service.category}
                      </Badge>
                    </div>
                  )}

                  <div className="mb-auto">
                    <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 text-left">{service.title}</h3>
                    <p className="text-sm text-white/60 line-clamp-3 mb-6 text-left">{service.description}</p>

                    {service.features && service.features.length > 0 && (
                      <ul className="space-y-2.5 text-left mb-6">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0 text-purple-400 mr-2.5 mt-0.5" />
                            <span className="text-sm text-white/80 leading-tight">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mt-6 pt-4 relative">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold text-white">
                          {service.price.includes('₹') ? service.price : `₹${service.price.replace(/^\₹/, '')}`}
                        </div>
                        <div className="text-sm text-white/60 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                          {service.deliveryTime}
                        </div>
                      </div>


                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Freelancer Preview Message Dialog */}
      {showFreelancerMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E1E] border border-white/10 rounded-xl p-6 max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Can't Hire Yourself</h3>
            <p className="text-white/70 text-sm mb-4">
              You can't hire yourself for your own services. This button is for clients to hire you.
            </p>
            <button
              onClick={() => setShowFreelancerMessage(false)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-xl text-sm font-medium transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
