"use client";

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Define the Job interface that matches your data structure
type SalaryPeriod = 'hour' | 'day' | 'week' | 'month' | 'year';

interface Company {
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  size?: string;
  founded?: number;
  industry?: string;
}

interface Salary {
  min: number;
  max: number;
  currency: string;
  period: SalaryPeriod;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  rate: number;
  budget: number;
  location: string;
  coords: [number, number]; // [lng, lat] format for Mapbox
  skills: string[];
  workMode: 'remote' | 'onsite' | 'hybrid';
  type: 'full-time' | 'part-time' | 'contract';
  postedAt: string;
  clientRating: string;
  clientJobs: number;
  proposals: number;
  duration: string;
  salary?: Salary;
}

interface MapViewProps {
  jobs: Job[];
  selectedCategory: string;
  style?: React.CSSProperties;
}

const MapViewComponent: React.FC<MapViewProps> = ({ jobs, selectedCategory, style = {} }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Process jobs with default values
  const processedJobs = React.useMemo(() => {
    return jobs.map(job => ({
      ...job,
      coords: job.coords || [0, 0] as [number, number],
      skills: job.skills || [],
      description: job.description || '',
      category: job.category || 'Uncategorized',
      title: job.title || 'Untitled Job',
      location: job.location || 'Location not specified',
      clientRating: job.clientRating || '0',
      clientJobs: job.clientJobs || 0,
      budget: job.budget || 0,
      rate: job.rate || 0,
      postedAt: job.postedAt || new Date().toISOString(),
      duration: job.duration || 'Not specified'
    }));
  }, [jobs]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!mapboxToken) {
      setError('Mapbox access token is not configured');
      setIsLoading(false);
      return;
    }

    try {
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [80.2707, 13.0827], // Chennai coordinates
        zoom: 11,
        accessToken: mapboxToken,
      });

      // Handle missing image errors
      map.current.on('styleimagemissing', (e) => {
        const id = e.id; // Get the missing image id
        if (id.startsWith('in-state-')) {
          // Create a blank transparent pixel
          const blankImage = new Uint8Array(4);
          map.current?.addImage(id, { width: 1, height: 1, data: blankImage });
        }
      });

      // Create custom controls container
      const controlsContainer = document.createElement('div');
      controlsContainer.className = 'map-controls';
      controlsContainer.style.position = 'absolute';
      // Ultra-slim controls
      controlsContainer.style.top = '120px';
      controlsContainer.style.right = '8px';
      controlsContainer.style.display = 'flex';
      controlsContainer.style.flexDirection = 'column';
      controlsContainer.style.gap = '4px';
      controlsContainer.style.zIndex = '1000';
      controlsContainer.style.borderRadius = '8px';
      controlsContainer.style.overflow = 'hidden';
      controlsContainer.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
      controlsContainer.style.transition = 'all 0.15s ease';
      controlsContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      controlsContainer.style.padding = '4px';
      controlsContainer.style.border = '1px solid rgba(0, 0, 0, 0.05)';
      
      // Create control buttons with consistent styling
      const createControlButton = (iconSvg: string, title: string, onClick: () => void) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.title = title;
        button.style.width = '28px';
        button.style.height = '28px';
        button.style.border = 'none';
        button.style.background = 'transparent';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.cursor = 'pointer';
        button.style.transition = 'all 0.2s';
        button.style.padding = '0';
        button.style.margin = '0';
        button.style.borderRadius = '6px';
        button.style.color = '#333';
        // Minimalist SVG icons
        const svg = new DOMParser().parseFromString(iconSvg, 'image/svg+xml').firstChild as SVGElement;
        svg.setAttribute('width', '14');
        svg.setAttribute('height', '14');
        svg.setAttribute('fill', 'currentColor');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '1.5');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        button.innerHTML = '';
        button.appendChild(svg);
        
        // Hover effect with better contrast
        button.addEventListener('mouseenter', () => {
          button.style.backgroundColor = 'rgba(0, 0, 0, 0.04)';
          button.style.transform = 'scale(1.05)';
          button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
        });
        
        button.addEventListener('mouseleave', () => {
          button.style.backgroundColor = 'transparent';
          button.style.transform = 'scale(1)';
          button.style.boxShadow = 'none';
        });
        
        button.addEventListener('mousedown', () => {
          button.style.backgroundColor = 'rgba(0, 0, 0, 0.08)';
          button.style.transform = 'scale(0.96)';
          button.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        });
        
        button.addEventListener('mouseup', () => {
          button.style.backgroundColor = 'rgba(0, 0, 0, 0.04)';
          button.style.transform = 'scale(1.03)';
          button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
        });
        
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          onClick();
        });
        
        return button;
      };
      
      // Zoom in button
      const zoomInButton = createControlButton(
        `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 3.5V12.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/>
          <path d="M3.5 8H12.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/>
        </svg>`,
        'Zoom in',
        () => map.current?.zoomIn()
      );
      
      // Zoom out button
      const zoomOutButton = createControlButton(
        `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.5 8H12.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/>
        </svg>`,
        'Zoom out',
        () => map.current?.zoomOut()
      );
      
      // Current location button with pin icon
      const locationButton = createControlButton(
        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9C5 13.17 9.42 18.92 11.24 21.11C11.64 21.59 12.37 21.59 12.77 21.11C14.58 18.92 19 13.17 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
        </svg>`,
        'Current location',
        () => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              map.current?.flyTo({
                center: [position.coords.longitude, position.coords.latitude],
                zoom: 14
              });
            });
          }
        }
      );
      
      // Add buttons to container
      controlsContainer.appendChild(zoomInButton);
      controlsContainer.appendChild(zoomOutButton);
      controlsContainer.appendChild(locationButton);
      
      // Add controls to map container
      if (mapContainer.current) {
        mapContainer.current.appendChild(controlsContainer);
      }

      // Set loading to false when map is ready
      map.current.on('load', () => {
        setIsLoading(false);
      });

      // Handle map errors
      map.current.on('error', (e) => {
        console.error('Map error:', e.error);
        setError('Failed to load map. Please try refreshing the page.');
        setIsLoading(false);
      });

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
      setError('Failed to initialize map. Please check your connection and try again.');
      setIsLoading(false);
    }
  }, []);

  // Handle job markers
  useEffect(() => {
    if (!map.current) return;

    // Filter jobs based on category
    const filteredJobs = selectedCategory === 'For You'
      ? processedJobs.filter((job) => {
          const jobText = [
            job.title,
            job.description,
            job.category,
            ...job.skills,
          ].join(' ').toLowerCase();

          const isCricketJob = /cricket|coach|training|sports|player/i.test(jobText);
          const isDeveloperJob = /developer|programming|code|software|frontend|backend|fullstack|web|app|mobile/i.test(jobText);

          return isCricketJob || isDeveloperJob;
        })
      : processedJobs;

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
        <svg width="26" height="32" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="location-pin" style="pointer-events: none;">
          <path 
            d="M16 0C7.163 0 0 7.163 0 16C0 28 16 40 16 40C16 40 32 28 32 16C32 7.163 24.837 0 16 0Z" 
            fill="#1d59eb"
            class="pin-body"
          />
          <circle cx="16" cy="14" r="4" fill="white" class="pin-dot" />
        </svg>
      `;
      
      // Style the marker container
      markerEl.style.width = '26px';
      markerEl.style.height = '32px';
      markerEl.style.display = 'flex';
      markerEl.style.justifyContent = 'center';

      // Create popup content
      const popupContent = `
        <div class="bg-[#111111]/90 backdrop-blur-xl border border-white/10 shadow-lg rounded-xl p-4 w-[300px] text-white">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold truncate">${job.title}</h3>
              <span class="px-2 py-1 text-sm font-medium bg-purple-500/20 text-purple-300 rounded-lg">₹${job.budget.toLocaleString('en-IN')}</span>
            </div>
            <p class="text-sm text-gray-300 line-clamp-2">${job.description}</p>
            <div class="flex items-center gap-2 text-sm text-gray-400">
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                  <path fill-rule="evenodd" d="M9.69 18.933l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                </svg>
                ${job.location}
              </span>
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clip-rule="evenodd" />
                </svg>
                ${job.duration}
              </span>
            </div>
            <div class="flex flex-wrap gap-2">
              ${job.skills.slice(0, 3).map(skill => `
                <span class="px-2 py-1 text-xs bg-purple-500/10 text-purple-300 rounded-lg">${skill}</span>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        maxWidth: '340px',
        className: 'custom-popup animate-popup',
        anchor: 'bottom'
      }).setHTML(popupContent);

      // Add marker to map
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat(job.coords) // job.coords is already in [lng, lat] format
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

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

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-800">Loading map...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-lg shadow-lg z-10 max-w-xs">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div
        ref={mapContainer}
        className="w-full h-full rounded-lg overflow-hidden shadow-sm"
        style={style}
      />
    </div>
  );
};

export default MapViewComponent;
