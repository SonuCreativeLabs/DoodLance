"use client";

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Job {
  id: number;
  title: string;
  client: string;
  clientRating: number;
  budget: number;
  currency: string;
  description: string;
  location: string;
  distance: number;
  posted: string;
  duration: string;
  coords: [number, number];
  availability: string[];
  skills: string[];
  category: string;
  proposals: number;
}

interface MapViewProps {
  jobs: Job[];
  style?: React.CSSProperties;
}

export default function MapView({ jobs, style = {} }: MapViewProps): JSX.Element {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number]>([80.2707, 13.0827]);

  useEffect(() => {
    console.log('Initializing map...');
    console.log('Mapbox token:', process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ? 'Set' : 'Not set');
    
    // Get user's location
    if (navigator.geolocation) {
      console.log('Requesting geolocation...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Got user location:', position.coords);
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.warn('Error getting location, using default:', error);
          // Default to Chennai coordinates if location access is denied
          setUserLocation([80.2707, 13.0827]);
        }
      );
    } else {
      console.warn('Geolocation not supported by browser');
      setUserLocation([80.2707, 13.0827]);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Check if Mapbox access token is available
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!mapboxToken) {
      console.error('Mapbox access token is not set. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your .env.local file');
      return;
    }

    // Initialize map with error handling
    try {
      console.log('Creating map instance...');
      if (!mapContainer.current) {
        console.error('Map container not found');
        return;
      }
      
      console.log('Map container dimensions:', {
        width: mapContainer.current.offsetWidth,
        height: mapContainer.current.offsetHeight
      });
      
      mapInstance.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: userLocation,
        zoom: 12,
        accessToken: mapboxToken,
      });
      
      mapInstance.current.on('load', () => {
        console.log('Map loaded successfully');
      });
      
      mapInstance.current.on('error', (e) => {
        console.error('Map error:', e.error);
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      return;
    }

    const map = mapInstance.current;

    // Add navigation control
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add user location marker
    const userEl = document.createElement('div');
    userEl.className = 'w-4 h-4 bg-blue-500 rounded-full border-2 border-white';
    new mapboxgl.Marker({
      element: userEl,
    })
      .setLngLat(userLocation)
      .addTo(map);

    // Add markers for jobs
    jobs.forEach((job) => {
      const el = document.createElement('div');
      el.className = 'w-6 h-6 bg-purple-500 rounded-full border-2 border-white cursor-pointer transition-transform hover:scale-110';

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        className: 'bg-[#111111] text-white px-4 py-2 rounded-lg shadow-lg border border-white/10 w-64',
      })
        .setHTML(
          `<div class="space-y-1">
            <h3 class="font-semibold text-purple-400">${job.title}</h3>
            <p class="text-sm text-white/80">${job.client} • ${job.clientRating}★</p>
            <p class="text-sm text-white/60">${job.budget} ${job.currency} • ${job.distance} km away</p>
            <p class="text-xs text-white/50 mt-1 line-clamp-2">${job.description}</p>
            <div class="flex flex-wrap gap-1 mt-2">
              ${job.skills.map(skill => 
                `<span class="text-xs bg-black/30 px-2 py-0.5 rounded-full">${skill}</span>`
              ).join('')}
            </div>
          </div>`
        );

      const marker = new mapboxgl.Marker({
        element: el,
      })
        .setLngLat(job.coords)
        .setPopup(popup)
        .addTo(map);

      // Show popup on hover
      el.addEventListener('mouseenter', () => marker.togglePopup());
      el.addEventListener('mouseleave', () => marker.togglePopup());
    });

    // Add custom styles
    const mapStyle = document.createElement('style');
    mapStyle.textContent = `
      .mapboxgl-ctrl-top-right {
        margin-top: 70px !important;
      }

      .mapboxgl-ctrl-top-right .mapboxgl-ctrl {
        margin: 10px 10px 0 0;
      }

      .mapboxgl-ctrl-top-left {
        margin-top: 110px !important;
      }

      .mapboxgl-ctrl-top-left .mapboxgl-ctrl {
        margin: 10px 0 0 10px;
      }

      .mapboxgl-ctrl-group {
        background: white !important;
        border: 1px solid rgba(0, 0, 0, 0.1) !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
      }

      .mapboxgl-ctrl-group button {
        background-color: white !important;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
      }

      .mapboxgl-ctrl-group button:hover {
        background-color: #f8f8f8 !important;
      }

      .mapboxgl-ctrl-scale {
        min-width: 50px !important;
        height: 22px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background-color: white !important;
        border: 1px solid rgba(0, 0, 0, 0.1) !important;
        color: #666 !important;
        font-size: 11px !important;
        font-weight: 500 !important;
        padding: 0 6px !important;
        border-radius: 6px !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
        transition: all 0.2s ease-in-out !important;
        letter-spacing: 0.2px !important;
      }
    `;
    document.head.appendChild(mapStyle);

    // Add popup styles
    const popupStyle = document.createElement('style');
    popupStyle.textContent = `
      .custom-popup {
        transform-origin: 50% calc(100% - 8px);
        filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
      }
      
      .custom-popup.animate-popup {
        animation: none;
        opacity: 0;
        transform: translateY(5px) scale(0.98);
        transition: opacity 0.2s ease-out, transform 0.2s ease-out;
      }

      .custom-popup.mapboxgl-popup-anchor-bottom {
        opacity: 1;
        transform: translateY(0) scale(1);
      }

      .custom-popup .mapboxgl-popup-content {
        border-radius: 12px;
        padding: 0;
        background: transparent;
        box-shadow: none;
        border: none;
      }

      .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
        border-top-color: rgba(17, 17, 17, 0.8);
      }
      
      .custom-popup .mapboxgl-popup-close-button {
        padding: 8px;
        right: 8px;
        top: 8px;
        color: rgba(255, 255, 255, 0.8);
        font-size: 24px;
        font-weight: 300;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        z-index: 1;
      }
      
      .custom-popup .mapboxgl-popup-close-button:hover {
        background-color: rgba(255, 255, 255, 0.15);
        color: rgba(255, 255, 255, 1);
      }
    `;
    document.head.appendChild(popupStyle);

    return () => {
      map.remove();
      document.head.removeChild(mapStyle);
      document.head.removeChild(popupStyle);
    };
  }, [jobs, userLocation]);

  return (
    <div className="absolute inset-0 w-full h-full">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 w-full h-full"
        style={style}
      />
      {!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white p-4 text-center">
          <div>
            <p className="text-xl font-bold mb-2">Mapbox Access Token Missing</p>
            <p>Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your .env.local file</p>
          </div>
        </div>
      )}
    </div>
  );
}
