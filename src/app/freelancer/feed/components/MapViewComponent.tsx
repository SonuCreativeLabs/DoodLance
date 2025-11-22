"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { createPortal } from 'react-dom';
import JobDetailsFull from './JobDetailsFull';
import OverlayPortal from './OverlayPortal';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import dynamic from 'next/dynamic';
// Import types from the shared types file first
import { 
  ClientInfo, 
  JobDuration, 
  ExperienceLevel, 
  JobType,
  WorkMode,
  Job as SharedJob
} from '../types';

// Define the Job type that properly extends SharedJob
type Job = Omit<SharedJob, 'client' | 'clientName' | 'clientImage' | 'clientRating' | 'clientJobs' | 'proposals' | 'coords'> & {
  // Required properties from SharedJob
  id: string;
  title: string;
  description: string;
  category: string;
  rate: number;
  budget: number;
  location: string;
  skills: string[];
  workMode: WorkMode;
  type: JobType;
  postedAt: string;
  company: string;
  companyLogo: string;
  clientName: string;
  clientImage?: string;
  clientRating: string | number;
  clientJobs: number;
  proposals: number;
  duration: JobDuration;
  experience: ExperienceLevel;
  
  // Additional properties
  coordinates: [number, number];
  coords: [number, number];
  client?: ClientInfo;
  
  // Make all properties optional for the input type
  [key: string]: any;
};

// Define the Job interface for map view
type JobWithCoordinates = Job & {
  // Make coordinates optional to handle both Job types
  coordinates?: [number, number];
  coords?: [number, number];
};

// Dynamically import JobDetailsFull with no SSR and simple loading spinner
const DynamicJobDetailsFull = dynamic(() => import('./JobDetailsFull'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[500px]">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
});

interface MapViewProps {
  jobs: JobWithCoordinates[];
  selectedCategory: string | null;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    openJobDetails: (jobId: string) => void;
  }
}

const MapViewComponent: React.FC<MapViewProps> = ({ jobs, selectedCategory, style = {} }) => {
  // Error boundary fallback component
  const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="p-6 max-w-md w-full bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Something went wrong</h2>
        <p className="text-gray-700 mb-4">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );

  const [selectedJob, setSelectedJob] = useState<JobWithCoordinates | null>(null);
  const [currentJobIndex, setCurrentJobIndex] = useState<number>(-1);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredJobs, setFilteredJobs] = useState<JobWithCoordinates[]>([]);
  const [error, setErrorState] = useState<{message: string; details?: any} | null>(null);
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);
  const lastOpenedPopup = useRef<{jobId: string | null; marker: mapboxgl.Marker | null}>({jobId: null, marker: null});

  // Process jobs with default values
  const processedJobs = useMemo(() => {
    return (jobs || []).map((jobInput: JobWithCoordinates): Job => {
      // Extract coordinates safely - check both coords and coordinates
      let coords: [number, number] = [0, 0];
      
      if (Array.isArray(jobInput.coords) && jobInput.coords.length === 2) {
        coords = [jobInput.coords[0], jobInput.coords[1]];
      } else if (Array.isArray(jobInput.coordinates) && jobInput.coordinates.length === 2) {
        coords = [jobInput.coordinates[0], jobInput.coordinates[1]];
      } else if (typeof jobInput.location === 'string') {
        // Try to extract coords from location string if available
        const match = jobInput.location.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (match) {
          coords = [parseFloat(match[1]), parseFloat(match[2])];
        }
      }
      
      // Create default client info
      const defaultClient: ClientInfo = {
        name: jobInput.clientName || 'Unknown Client',
        rating: typeof jobInput.clientRating === 'number' ? jobInput.clientRating : 0,
        jobsCompleted: jobInput.clientJobs || 0,
        location: jobInput.location || 'Remote',
        image: jobInput.clientImage || '',
        memberSince: new Date().toISOString()
      };
      
      // Use provided client or default
      const client = jobInput.client || defaultClient;
      
      // Return the job with all required properties
      return {
        ...jobInput,
        id: jobInput.id || `job-${Math.random().toString(36).substr(2, 9)}`,
        title: jobInput.title || 'Untitled Job',
        description: jobInput.description || '',
        category: jobInput.category || 'General',
        rate: typeof jobInput.rate === 'number' ? jobInput.rate : 0,
        budget: typeof jobInput.budget === 'number' ? jobInput.budget : 0,
        location: jobInput.location || 'Remote',
        skills: Array.isArray(jobInput.skills) ? jobInput.skills : [],
        workMode: ['remote', 'onsite', 'all'].includes(jobInput.workMode || '') 
          ? jobInput.workMode as WorkMode 
          : 'onsite',
        type: ['freelance', 'part-time', 'full-time', 'contract'].includes(jobInput.type || '')
          ? jobInput.type as JobType
          : 'freelance',
        postedAt: jobInput.postedAt || new Date().toISOString(),
        company: jobInput.company || '',
        companyLogo: jobInput.companyLogo || '',
        clientName: client.name,
        clientImage: client.image,
        clientRating: client.rating || 0,
        clientJobs: client.jobsCompleted || 0,
        proposals: jobInput.proposals || 0,
        duration: ['hourly', 'daily', 'weekly', 'monthly', 'one-time'].includes(jobInput.duration || '')
          ? jobInput.duration as JobDuration
          : 'one-time',
        experience: ['Entry Level', 'Intermediate', 'Expert'].includes(jobInput.experience || '')
          ? jobInput.experience as ExperienceLevel
          : 'Entry Level',
        coordinates: coords,
        coords,
        client
      };
    });
  }, [jobs]);

  // Expose openJobDetails to window for popup clicks
  const handleOpenJobDetails = useCallback((jobId: string) => {
    const job = processedJobs.find(j => j.id === jobId);
    if (!job) return;
    
    setSelectedJob(job);
    setIsJobDetailsOpen(true);
    
    // Center map on selected job
    if (map.current) {
      map.current.flyTo({
        center: job.coordinates,
        zoom: 12,
        essential: true
      });
    }
  }, [processedJobs]);
  
  // Handle job selection from the list - using the single implementation below

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).openJobDetails = handleOpenJobDetails;
      return () => {
        delete (window as any).openJobDetails;
      };
    }
  }, [handleOpenJobDetails]);

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    try {
      if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
        throw new Error('Mapbox access token is not defined');
      }

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [0, 0],
        zoom: 2,
        attributionControl: false
      });

      // Add controls after map has loaded
      map.current.on('load', () => {
        if (!map.current) return;
        
        // Create a container for the controls
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'mapboxgl-ctrl-bottom-right';
        map.current.getContainer().appendChild(controlsContainer);
        
        // Add navigation control (zoom buttons)
        const nav = new mapboxgl.NavigationControl({
          showCompass: false,
          showZoom: true,
          visualizePitch: false
        });
        
        // Add geolocate control with enhanced options
        const geolocate = new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserLocation: true,
          showUserHeading: true,
          showAccuracyCircle: true,
          fitBoundsOptions: {
            maxZoom: 15
          }
        });
        
        // Add controls to the map with explicit positions
        map.current.addControl(nav, 'bottom-right');
        map.current.addControl(geolocate, 'bottom-right');
        
        // Add event listeners for geolocation
        geolocate.on('geolocate', (e: any) => {
          if (!e.coords) return;
          const { longitude, latitude } = e.coords;
          map.current?.flyTo({
            center: [longitude, latitude],
            zoom: 14,
            essential: true
          });
        });
        
        // Auto-trigger geolocation on first load
        setTimeout(() => {
          const geolocateBtn = document.querySelector('.mapboxgl-ctrl-geolocate');
          if (geolocateBtn) {
            (geolocateBtn as HTMLElement).click();
          }
        }, 1000);
        
        // Force controls to be visible
        setTimeout(() => {
          const controls = document.querySelectorAll('.mapboxgl-ctrl-bottom-right .mapboxgl-ctrl');
          controls.forEach((control, index) => {
            const el = control as HTMLElement;
            el.style.margin = '10px 0';
            el.style.opacity = '1';
            el.style.visibility = 'visible';
          });
        }, 100);
      });

      // Add click handler to close popups when clicking on the map
      map.current.on('click', (e) => {
        // Close all popups when clicking on the map
        markersRef.current.forEach((marker) => {
          const popup = marker.getPopup();
          if (popup) {
            popup.remove();
          }
        });
      });

      // Stop propagation for popup clicks to prevent map click from triggering
      map.current.on('click', '.mapboxgl-popup', (e) => {
        e.originalEvent.stopPropagation();
      });

      // Stop propagation for marker clicks
      map.current.on('click', '.mapboxgl-marker', (e) => {
        e.originalEvent.stopPropagation();
      });

      // Handle map errors
      const handleMapError = (e: any) => {
        console.error('Map error:', e.error);
        setErrorState({
          message: 'Failed to load map. Please try refreshing the page.',
          details: e.error
        });
        setIsLoading(false);
      };
      
      map.current.on('error', handleMapError);
      
          // Cleanup function for map events
      const cleanupMapEvents = () => {
        if (map.current) {
          map.current.off('error', handleMapError);
          // Remove click handlers from the document
          document.removeEventListener('click', handleDocumentClick);
        }
      };

      // Add click handler to document to close popups when clicking outside
      const handleDocumentClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.mapboxgl-popup') && !target.closest('.mapboxgl-marker')) {
          // Close all popups when clicking outside
          markersRef.current.forEach((marker) => {
            const popup = marker.getPopup();
            if (popup?.isOpen()) {
              popup.remove();
            }
          });
        }
      };

      // Add document click handler
      document.addEventListener('click', handleDocumentClick);

      // Cleanup function
      return () => {
        if (map.current) {
          // Remove all markers
          markersRef.current.forEach((marker) => marker.remove());
          markersRef.current = [];

          // Remove the map
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setErrorState({
        message: 'Failed to initialize map. Please check your connection and try again.',
        details: error
      });
      setIsLoading(false);
    }
  }, []);

  // Handle job markers
  useEffect(() => {
    if (!map.current) return;

    // Filter jobs based on selected category
    const filteredJobs = processedJobs;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for filtered jobs
    filteredJobs.forEach((job) => {
      // Skip jobs without valid coordinates
      if (!job.coords || job.coords.length !== 2 || typeof job.coords[0] !== 'number' || typeof job.coords[1] !== 'number') {
        console.warn('Skipping job with invalid coordinates:', job);
        return;
      }
      
      // Create a smaller location pin marker
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker';
      markerEl.innerHTML = `
        <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="location-pin" style="pointer-events: none;">
          <defs>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="150%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#3b82f6" flood-opacity="0.6"/>
            </filter>
          </defs>
          <g filter="url(#shadow)">
            <path 
              d="M12 0C5.373 0 0 5.373 0 12C0 21 12 36 12 36S24 21 24 12C24 5.373 18.627 0 12 0Z" 
              fill="#1d59eb"
              class="pin-body"
            />
            <path 
              d="M12 0C5.373 0 0 5.373 0 12C0 21 12 36 12 36S24 21 24 12C24 5.373 18.627 0 12 0Z" 
              fill="#1d59eb"
              class="pin-body"
              transform="scale(0.8 1)" 
              transform-origin="12 18"
            />
            <circle cx="12" cy="10" r="3" fill="white" class="pin-dot" />
          </g>
        </svg>
      `;
      
      // Style the marker container
      markerEl.style.width = '24px';
      markerEl.style.height = '36px';
      markerEl.style.display = 'flex';
      markerEl.style.justifyContent = 'center';
      markerEl.style.filter = 'drop-shadow(0 2px 6px rgba(59, 130, 246, 0.4))';

      // Create a safe stringified version of the job object
      const safeJobString = JSON.stringify(job)
        .replace(/</g, '\\u003c')
        .replace(/>/g, '\\u003e')
        .replace(/"/g, '\\"')
        .replace(/'/g, '\\\'');

      // Create popup content with navigation and click handler
      const popupContent = document.createElement('div');
      
      // Create the job card HTML with embedded navigation
      const createJobCardHTML = (job: JobWithCoordinates) => {
        const currentIndex = processedJobs.findIndex(j => j.id === job.id);
        const hasNext = currentIndex < processedJobs.length - 1;
        const hasPrev = currentIndex > 0;
        
        return `
          <div class="group bg-gradient-to-br from-[#111111] to-[#000000] opacity-95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl hover:shadow-purple-500/20 transition-all duration-300 w-[360px] border border-white/10 hover:border-white/20">
            
            <!-- Navigation Buttons -->
            <div class="flex justify-between items-center mb-3">
              <button class="nav-btn prev-btn flex items-center justify-center w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 transition-colors ${!hasPrev ? 'opacity-50 cursor-not-allowed' : 'text-white'}" 
                      ${!hasPrev ? 'disabled' : ''}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div class="flex-1 text-center">
                <span class="text-xs font-medium text-white/60">${currentIndex + 1} / ${processedJobs.length}</span>
              </div>
              <button class="nav-btn next-btn flex items-center justify-center w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 transition-colors ${!hasNext ? 'opacity-50 cursor-not-allowed' : 'text-white'}" 
                      ${!hasNext ? 'disabled' : ''}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <!-- Job header with client profile -->
            <div class="flex items-center gap-3 mb-2">
              <div class="relative flex-shrink-0">
                <div class="relative w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white/20">
                  <img
                    src="${job.clientImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.clientName || 'Client')}&background=6B46C1&color=fff&bold=true`}"
                    alt="Client"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div class="flex flex-col gap-1 flex-1 min-w-0">
                <h3 class="text-[15px] font-semibold text-white leading-tight line-clamp-2 break-words">
                  ${job.title}
                </h3>
                <div class="flex items-center gap-2">
                  <span class="text-[12px] font-medium text-white/80 bg-white/10 px-2 py-0.5 rounded whitespace-nowrap">
                    ${job.category}
                  </span>
                  ${job.workMode ? `
                    <span class="text-[12px] font-medium text-white/80 bg-white/10 px-2 py-0.5 rounded whitespace-nowrap">
                      ${job.workMode === 'remote' ? 'Remote' : job.workMode === 'onsite' ? 'On-site' : 'All'}
                    </span>
                  ` : ''}
                </div>
              </div>
            </div>

            <!-- Description -->
            <p class="text-[13px] text-white/80 line-clamp-2 leading-relaxed mb-2">
              ${job.description}
            </p>

            <!-- Location and Date -->
            <div class="flex items-center justify-between text-[12px] text-white/60 mb-2">
              <div class="flex items-center gap-1 min-w-0 flex-1">
                <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="truncate" title="${job.location}">${job.location}</span>
              </div>
              <div class="flex items-center gap-1 flex-shrink-0 ml-2">
                <svg class="w-3 h-3 flex-shrink-0 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-white/60 text-[11px] whitespace-nowrap">
                  ${(() => {
                    const scheduledAt = job.scheduledAt ? new Date(job.scheduledAt) : new Date();
                    const date = scheduledAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    const time = scheduledAt.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true
                    });
                    return `${date}, ${time}`;
                  })()}
                </span>
              </div>
            </div>

            <!-- Skills -->
            ${job.skills && job.skills.length > 0 ? `
              <div class="flex flex-wrap gap-2 mb-3">
                ${job.skills.slice(0, 2).map(skill => `
                  <span class="px-2.5 py-1 h-6 flex items-center text-[11px] rounded-full bg-white/5 text-white/70 backdrop-blur-sm whitespace-nowrap">
                    ${skill}
                  </span>
                `).join('')}
                ${job.skills.length > 2 ? `
                  <span class="px-2.5 py-1 h-6 flex items-center text-[11px] rounded-full bg-white/5 text-white/50 whitespace-nowrap">
                    +${job.skills.length - 2} more
                  </span>
                ` : ''}
              </div>
            ` : ''}

            <!-- Footer -->
            <div class="flex items-center justify-between pt-3 border-t border-white/5">
              <div class="flex items-baseline gap-1">
                <span class="text-[17px] font-semibold text-white">
                  ₹${job.budget.toLocaleString('en-IN')}
                </span>
                <span class="text-[13px] text-white/60">
                  / ${job.category === 'Sports' ? 'session' :
                      job.category?.toLowerCase().includes('tutoring') ? 'session' :
                      job.category?.toLowerCase().includes('coach') ? 'session' :
                      job.category?.toLowerCase().includes('fitness') ? 'session' :
                      job.category?.toLowerCase().includes('makeup') ? 'session' :
                      job.category?.toLowerCase().includes('diet') ? 'plan' :
                      'project'}
                </span>
              </div>
              <button class="apply-now-btn px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-[#6B46C1] to-[#4C1D95] hover:from-[#5B35B0] hover:to-[#3D1B7A] rounded-xl transition-all duration-300 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 flex items-center justify-center gap-1.5"
                      data-job-id="${job.id}">
                <span>Apply Now</span>
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        `;
      };
      
      popupContent.innerHTML = createJobCardHTML(job);
      popupContent.style.cursor = 'pointer';
      
      // Add click handler to the popup content
      popupContent.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const currentIndex = processedJobs.findIndex(j => j.id === job.id);
        const hasNext = currentIndex < processedJobs.length - 1;
        const hasPrev = currentIndex > 0;
        
        // Handle navigation buttons
        if (target.closest('.nav-btn')) {
          e.stopPropagation();
          const isNext = target.closest('.next-btn');
          const isPrev = target.closest('.prev-btn');
          
          if (isNext && hasNext) {
            navigateToJob(currentIndex + 1);
          } else if (isPrev && hasPrev) {
            navigateToJob(currentIndex - 1);
          }
          return;
        }
        
        // Don't trigger if clicking on the apply button or navigation
        if (!target.closest('.apply-now-btn')) {
          setSelectedJob(job);
          setIsJobDetailsOpen(true);
        }
      });
      
      // Function to navigate to a specific job
      const navigateToJob = (index: number) => {
        if (index >= 0 && index < processedJobs.length) {
          const nextJob = processedJobs[index];
          const marker = markersRef.current.find(m => (m as any)._jobId === nextJob.id);
          if (marker && map.current) {
            // Close current popup
            popup.remove();
            
            // Open the popup for the next job
            setTimeout(() => {
              marker.togglePopup();
              
              // Center the map on the marker
              const lngLat = marker.getLngLat();
              map.current?.flyTo({
                center: [lngLat.lng, lngLat.lat],
                essential: true
              });
            }, 100);
          }
        }
      };

      // Create popup with connecting line to pin
      const popup = new mapboxgl.Popup({
        offset: [0, 60], // Position popup lower below the pin (moved down 5%)
        closeButton: false,
        closeOnClick: false,
        maxWidth: '380px',
        className: 'custom-popup',
        anchor: 'bottom'
      }).setDOMContent(popupContent);
      
      // Add custom class for styling the popup tip
      popup.addClassName('custom-popup-tip');

      // Add marker to map with popup
      try {
        const marker = new mapboxgl.Marker({
          element: markerEl,
          anchor: 'bottom'
        })
          .setLngLat(job.coords as [number, number])
          .setPopup(popup) // Set the popup on the marker
          .addTo(map.current!);
        
        // Store job ID on marker for later reference
        (marker as any)._jobId = job.id;
          
        console.log(`Marker added successfully for job: ${job.title}`);
        
        // Make marker clickable
        markerEl.style.cursor = 'pointer';
        
        // Add click handler to handle marker clicks
        markerEl.addEventListener('click', (e) => {
          e.stopPropagation();
          
          // Close all other popups
          markersRef.current.forEach(m => {
            if (m !== marker) {
              const otherPopup = m.getPopup();
              if (otherPopup?.isOpen()) {
                otherPopup.remove();
              }
            }
          });
          
          // Toggle the current marker's popup
          const currentPopup = marker.getPopup();
          if (currentPopup) {
            if (currentPopup.isOpen()) {
              currentPopup.remove();
            } else {
              // Show the popup and center the map
              marker.togglePopup();
              
              if (map.current) {
                map.current.flyTo({
                  center: job.coords as [number, number],
                  zoom: 12,
                  essential: true
                });
              }
              
              // Store the marker for back navigation
              lastOpenedPopup.current = { jobId: job.id, marker };
            }
          }
        });
        
        // Store the marker reference
        markersRef.current.push(marker);
      } catch (error) {
        console.error(`Error adding marker for job ${job.title}:`, error);
      }

    });
    
    console.log(`Finished adding ${markersRef.current.length} markers to the map`);

    // Fit map to show all markers if we have any
    if (filteredJobs.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      let hasValidCoords = false;

      filteredJobs.forEach((job) => {
        if (job.coords && job.coords.length === 2) {
          bounds.extend(job.coords);
          hasValidCoords = true;
        }
      });

      if (hasValidCoords && !bounds.isEmpty()) {
        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15
        });
      }
    } else {
      // If no jobs to show, center on a default location
      map.current.flyTo({
        center: [80.2007, 12.9359],
        zoom: 12
      });
    }
  }, [processedJobs, selectedCategory]);

  // Handle closing job details
  const handleCloseJobDetails = useCallback(() => {
    setIsJobDetailsOpen(false);
    
    // Show the popup for the last selected job when returning from full view
    if (lastOpenedPopup.current.jobId && lastOpenedPopup.current.marker && map.current) {
      const popup = lastOpenedPopup.current.marker.getPopup();
      if (popup) {
        // Small timeout to ensure the map has finished any transitions
        setTimeout(() => {
          popup.addTo(map.current!);
          
          // Center the map on the marker with a slight offset
          const markerLngLat = lastOpenedPopup.current.marker?.getLngLat();
          if (markerLngLat) {
            map.current?.flyTo({
              center: [markerLngLat.lng, markerLngLat.lat],
              zoom: 12,
              essential: true
            });
          }
        }, 50);
      }
    }
    
    // Focus the map container for keyboard navigation
    if (mapContainer.current) {
      mapContainer.current.focus();
    }
  }, []);
  
  // Handle job selection
  const handleJobSelect = useCallback((jobId: string) => {
    const job = processedJobs.find(j => j.id === jobId);
    if (!job) return;
    
    setSelectedJob(job);
    
    // Find the marker for this job
    const marker = markersRef.current.find(m => {
      const markerJobId = (m as any)._jobId;
      return markerJobId === jobId;
    });
    
    // If we have a marker, store it for later use when returning from full view
    if (marker) {
      lastOpenedPopup.current = { jobId, marker };
    }
    
    // Center map on the selected job
    if (map.current && job.coords && job.coords.length === 2) {
      map.current.flyTo({
        center: job.coords as [number, number],
        zoom: 12,
        essential: true
      });
    }
    
    // Close any open popups when selecting from the list
    markersRef.current.forEach(m => {
      const popup = m.getPopup();
      if (popup?.isOpen()) {
        popup.remove();
      }
      
      // Open the popup for the selected job
      if (m === marker && popup) {
        popup.addTo(map.current!);
      }
    });
    
    // Open the full view
    setIsJobDetailsOpen(true);
  }, [processedJobs]);
  
  const handleApplyToJob = useCallback(async (jobId: string, proposal: string, rate: string, rateType: string, attachments: File[]) => {
    try {
      // Import the createApplication function
      const { createApplication } = await import('@/components/freelancer/jobs/mock-data');

      // Create the application
      const newApplication = await createApplication(jobId, proposal, rate, rateType, attachments);

      if (newApplication) {
        console.log('Successfully created application:', newApplication["#"]);

        // Refresh the ForYouJobs context to exclude the applied job
        // Dispatch a custom event that the ForYouJobsContext will listen to
        window.dispatchEvent(new CustomEvent('applicationCreated', { detail: { jobId } }));

        // Close the job details modal
        setIsJobDetailsOpen(false);

        // Show success message
        alert('Application submitted successfully!');

        // Small delay to allow event processing before navigation
        setTimeout(() => {
          window.location.href = '/freelancer/jobs?tab=applications&status=pending';
        }, 500);
      } else {
        console.error('Failed to create application');
        alert('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      alert('Error submitting application. Please try again.');
    }
  }, []);

  // If there's an error, show error message
  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="p-6 max-w-md w-full bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Map</h2>
          <p className="text-gray-700 mb-4">{error.message}</p>
          {error.details && (
            <details className="mb-4">
              <summary className="text-sm text-gray-500 cursor-pointer">View details</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                {JSON.stringify(error.details, null, 2)}
              </pre>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error: Error) => {
          console.error('Error in MapViewComponent:', error);
          setErrorState({
            message: 'An unexpected error occurred.',
            details: error
          });
        }}
      >
        <div 
          ref={mapContainer} 
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 1 }}
        />
      </ErrorBoundary>

      {/* Job Details Full View */}
      {isJobDetailsOpen && selectedJob && (
        <OverlayPortal>
          <JobDetailsFull
            job={selectedJob}
            onBack={handleCloseJobDetails}
            onApply={(jobId: string, proposal: string, rate: string, rateType: string, attachments: File[]) => {
              handleApplyToJob(jobId, proposal, rate, rateType, attachments);
            }}
          />
        </OverlayPortal>
      )}
      
      <style jsx global>{`
        /* Map controls */
        .mapboxgl-ctrl-bottom-right {
          bottom: 80px !important;
          right: 10px !important;
          z-index: 10 !important;
        }
        
        .mapboxgl-ctrl-group {
          border-radius: 8px !important;
          overflow: hidden !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2) !important;
        }
        
        .mapboxgl-ctrl button {
          width: 32px !important;
          height: 32px !important;
          background-color: white !important;
          border: none !important;
          border-bottom: 1px solid #eee !important;
          cursor: pointer !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        .mapboxgl-ctrl button:last-child {
          border-bottom: none !important;
        }
        
        .mapboxgl-ctrl button:hover {
          background-color: #f8f8f8 !important;
        }
        
        .mapboxgl-ctrl-icon {
          opacity: 1 !important;
          background-size: 16px 16px !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
        }
        
        .mapboxgl-ctrl-zoom-in .mapboxgl-ctrl-icon {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' fill='%23333'/%3E%3C/svg%3E") !important;
        }
        
        .mapboxgl-ctrl-zoom-out .mapboxgl-ctrl-icon {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M19 13H5v-2h14v2z' fill='%23333'/%3E%3C/svg%3E") !important;
        }
        
        .mapboxgl-ctrl-geolocate .mapboxgl-ctrl-icon {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.44-7.94-7.94V1h-2v2.06C6.83 3.56 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.44 7.94 7.94V23h2v-2.06c4.17-.46 7.44-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z' fill='%23333'/%3E%3C/svg%3E") !important;
        }
        .mapboxgl-ctrl-bottom-right {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .mapboxgl-ctrl-group {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
          overflow: hidden;
        }
        .mapboxgl-ctrl button {
          width: 32px;
          height: 32px;
        }
        .mapboxgl-ctrl button + button {
          border-top: 1px solid #eee;
        }
        .mapboxgl-ctrl button:hover {
          background-color: #f5f5f5;
        }
        .mapboxgl-ctrl-icon {
          background-size: 16px 16px;
        }

        .marker {
          width: 24px;
          height: 36px;
          display: flex;
          justify-content: center;
          filter: drop-shadow(0 2px 6px rgba(59, 130, 246, 0.4));
        }
        .mapboxgl-popup {
          will-change: transform;
          pointer-events: auto;
        }
        .mapboxgl-popup-content {
          padding: 0 !important;
          border-radius: 0.75rem;
          overflow: hidden;
          background: transparent !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important;
          position: relative;
        }
        .mapboxgl-popup-tip {
          display: none !important;
        }
        .mapboxgl-popup-close-button {
          display: none;
        }
        .mapboxgl-popup-anchor-bottom {
          margin-top: 0;
        }
        .mapboxgl-popup-anchor-bottom .mapboxgl-popup-content {
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default MapViewComponent;
