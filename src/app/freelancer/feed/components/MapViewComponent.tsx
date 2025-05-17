"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
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
  const [isLocating, setIsLocating] = useState(false);

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

    // Initialize map without attribution control
    map.addControl(new mapboxgl.NavigationControl({
      showCompass: false,
      showZoom: true,
      visualizePitch: false
    }), 'bottom-right');
    
    // Add compact geolocation control
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: false,
      showUserHeading: false,
      showAccuracyCircle: false,
      fitBoundsOptions: { maxZoom: 15 }
    });
    
    geolocate.on('geolocate', () => {
      setIsLocating(true);
      setTimeout(() => setIsLocating(false), 2000);
    });
    
    map.addControl(geolocate, 'bottom-right');
    
    // Remove default attribution
    document.querySelector('.mapboxgl-ctrl-attrib')?.remove();

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
      // Create custom pin element
      const el = document.createElement('div');
      el.className = 'job-pin cursor-pointer transition-all duration-200 hover:scale-110';
      el.innerHTML = `
        <div class="relative">
          <div class="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-20" style="animation-duration: 2s;"></div>
          <div class="relative w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white shadow-md">
            <span class="relative z-10">₹${job.budget}</span>
            <div class="absolute bottom-0 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-purple-500 transform translate-y-1"></div>
          </div>
        </div>
      `;

      // Create popup that will be shown on click
      const popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        closeOnMove: false,
        maxWidth: '340px',
        className: 'job-card-popup',
        offset: [0, -8],
        anchor: 'bottom'
      }).setHTML(`
        <div class="bg-[#111111] shadow-lg rounded-xl p-3 border border-white/10 relative backdrop-blur-xl bg-black/80 before:absolute before:inset-0 before:bg-gradient-to-b before:from-purple-500/10 before:to-transparent before:rounded-xl before:pointer-events-none">
          <div class="flex items-start gap-3">
            <div class="relative">
              <div class="relative">
                <div class="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20 blur-md"></div>
                <div class="absolute inset-0 bg-gradient-to-br from-purple-400/50 to-purple-600/50 rounded-full animate-pulse" style="animation-duration: 3s;"></div>
                <div class="w-12 h-12 rounded-full border-2 border-purple-200/50 relative z-10 flex items-center justify-center bg-purple-900/50 text-white text-xl font-bold shadow-xl ring-2 ring-purple-500/20 ring-offset-2 ring-offset-black/50">
                  ${job.client.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
            <div class="flex-1 -mt-1">
              <h3 class="font-bold text-base text-white leading-tight drop-shadow-sm">${job.title}</h3>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-xs text-white/80">${job.client}</span>
                <span class="text-white/20">•</span>
                <div class="flex items-center gap-1">
                  <svg class="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span class="text-xs font-bold text-white">${job.clientRating}</span>
                </div>
              </div>
              <div class="flex items-center text-xs text-white/60 mt-1">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="mr-2">${job.distance} km</span>
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>${job.posted}</span>
              </div>
              <p class="text-xs text-white/70 line-clamp-2 mt-2">${job.description}</p>
              
              <!-- Skills/Tags - Horizontal Layout -->
              <div class="flex flex-wrap gap-1.5 mt-2">
                ${job.skills.slice(0, 3).map(skill => `
                  <span class="text-[10px] bg-black/30 text-white/80 px-2 py-0.5 rounded-full border border-white/5">
                    ${skill}
                  </span>
                `).join('')}
                ${job.skills.length > 3 ? `
                  <span class="text-[10px] bg-black/20 text-white/60 px-2 py-0.5 rounded-full">
                    +${job.skills.length - 3}
                  </span>
                ` : ''}
              </div>
              
              <!-- Price and Action Buttons -->
              <div class="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-bold text-purple-400">₹${job.budget.toLocaleString('en-IN')}</span>
                  <span class="text-xs text-white/50">•</span>
                  <span class="text-xs text-white/60">${job.duration}</span>
                </div>
                <div class="flex items-center gap-2">
                  <button class="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1.5 rounded-full font-medium transition-colors">
                    View
                  </button>
                  <button class="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded-full font-medium transition-colors">
                    Apply
                  </button>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      `);

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat(job.coords)
        .setPopup(popup)
        .addTo(map);

      // Only show popup on click
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close any open popups first
        document.querySelectorAll('.mapboxgl-popup').forEach(p => p.remove());
        // Open this popup
        marker.togglePopup();
      });
    });

    // Add custom styles for map controls and popups
    const mapStyle = document.createElement('style');
    mapStyle.textContent = `
      /* Popup animations and styles */
      @keyframes popupFadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-popup {
        animation: popupFadeIn 0.2s ease-out forwards;
      }
      .custom-popup .mapboxgl-popup-content {
        background: transparent;
        padding: 0;
        box-shadow: none;
      }
      .custom-popup .mapboxgl-popup-close-button {
        color: rgba(255, 255, 255, 0.7);
        font-size: 20px;
        padding: 8px;
        right: 4px;
        top: 4px;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }
      .custom-popup .mapboxgl-popup-close-button:hover {
        color: white;
        background: rgba(0, 0, 0, 0.9);
      }

      /* Job pin styles */
      .job-pin {
        transform-origin: 50% 100%;
        will-change: transform;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      }
      
      .job-pin:hover {
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
      }
      
      .job-pin .animate-ping {
        animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
      }
      
      @keyframes ping {
        75%, 100% {
          transform: scale(1.5);
          opacity: 0;
        }
      }
      
      /* Job card popup styles */
      .job-card-popup {
        transform-origin: 50% 100%;
      }
      
      .job-card-popup .mapboxgl-popup-content {
        background: transparent !important;
        padding: 0 !important;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
        border-radius: 16px !important;
        overflow: visible !important;
      }
      
      .job-card-popup .mapboxgl-popup-tip {
        display: none !important;
      }
      
      .job-card-popup .mapboxgl-popup-close-button {
        color: white !important;
        background: rgba(0, 0, 0, 0.7) !important;
        border-radius: 50% !important;
        width: 24px !important;
        height: 24px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 16px !important;
        right: 8px !important;
        top: 8px !important;
        transition: all 0.2s ease !important;
      }
      
      .job-card-popup .mapboxgl-popup-close-button:hover {
        background: rgba(0, 0, 0, 0.9) !important;
        transform: scale(1.1) !important;
      }
      
      /* Map controls */
      .mapboxgl-ctrl-bottom-right {
        right: 8px !important;
        bottom: 80px !important;
      }

      .mapboxgl-ctrl-bottom-right .mapboxgl-ctrl {
        margin: 0 0 6px 0 !important;
        float: right;
        clear: both;
        box-shadow: 0 1px 2px rgba(0,0,0,0.15) !important;
        border-radius: 6px !important;
        overflow: hidden;
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
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
        border-radius: 6px !important;
        padding: 1px !important;
      }

      .mapboxgl-ctrl-group button {
        width: 28px !important;
        height: 28px !important;
        background-color: white !important;
        border: none !important;
        border-radius: 4px !important;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin: 0;
      }
      
      .mapboxgl-ctrl-group button + button {
        border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
      }

      .mapboxgl-ctrl-group button:hover {
        background-color: #f8f8f8 !important;
      }
      
      .mapboxgl-ctrl-geolocate {
        width: 28px !important;
        height: 28px !important;
      }
      
      .mapboxgl-ctrl-geolocate .mapboxgl-ctrl-icon {
        width: 100% !important;
        height: 100% !important;
        background-size: 16px !important;
        opacity: 0.8;
      }
      
      .mapboxgl-ctrl-geolocate:hover .mapboxgl-ctrl-icon {
        opacity: 1;
      }
      
      .mapboxgl-ctrl-zoom-in,
      .mapboxgl-ctrl-zoom-out {
        width: 28px !important;
        height: 28px !important;
        background-size: 16px !important;
        opacity: 0.8;
      }
      
      .mapboxgl-ctrl-zoom-in:hover,
      .mapboxgl-ctrl-zoom-out:hover {
        opacity: 1;
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
