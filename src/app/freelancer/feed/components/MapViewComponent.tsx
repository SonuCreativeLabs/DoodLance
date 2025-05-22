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
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [80.2007, 12.9359], // Default to Chennai
        zoom: 12,
        accessToken: mapboxToken,
      });

      // Add navigation control
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

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

      // Create marker element
      const el = document.createElement('div');
      el.className = 'w-4 h-4 bg-blue-500 rounded-full border-2 border-white cursor-pointer';

      // Create popup content
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <h3 class="text-lg font-semibold mb-2">${job.title}</h3>
          <div class="text-sm text-gray-600 mb-2">
            <p><strong>Rating:</strong> ${job.clientRating} ⭐️</p>
            <p><strong>Jobs Posted:</strong> ${job.clientJobs}</p>
            <p><strong>Posted:</strong> ${new Date(job.postedAt).toLocaleDateString()}</p>
            <p><strong>Budget:</strong> ₹${job.budget}</p>
          </div>
          <p class="text-sm text-gray-500">${job.description}</p>
          <div class="mt-2 flex flex-wrap gap-1">
            ${job.skills.map(skill => `
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                ${skill}
              </span>
            `).join('')}
          </div>
        </div>
      `);

      // Add marker to map
      const marker = new mapboxgl.Marker(el)
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
