"use client";

import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { professionals } from './mockData';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [80.2707, 13.0827], // Chennai center
      zoom: 11,
    });

    // Add custom styles for popups
    const style = document.createElement('style');
    style.textContent = `
      .custom-popup {
        transform-origin: 50% calc(100% - 8px);
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
        transform-origin: bottom center;
        transition: transform 0.3s ease-out;
      }

      .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
        transition: transform 0.2s ease-out;
      }
      
      .custom-popup .mapboxgl-popup-close-button {
        padding: 8px;
        right: 12px;
        top: 12px;
        color: rgba(255, 255, 255, 0.8);
        font-size: 24px;
        font-weight: 300;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        z-index: 1;
        line-height: 0;
      }
      
      .custom-popup .mapboxgl-popup-close-button:hover {
        background-color: rgba(255, 255, 255, 0.15);
        color: rgba(255, 255, 255, 1);
        transform: scale(1.1);
      }
      
      .custom-popup .mapboxgl-popup-tip {
        border-top-color: #111111;
        border-width: 8px;
        filter: drop-shadow(0 -1px 2px rgba(0, 0, 0, 0.1));
      }
    `;
    document.head.appendChild(style);

    // Function to smoothly move between markers
    const moveToMarker = (coords: [number, number]) => {
      map.easeTo({
        center: coords,
        offset: [0, -80],
        duration: 500,
        easing: (t) => {
          return t * (2 - t);
        }
      });
    };

    // Add markers for each professional
    professionals.forEach((pro) => {
      // Create a popup with more information
      const popup = new mapboxgl.Popup({
        offset: [0, -8],
        closeButton: true,
        closeOnClick: false,
        maxWidth: '340px',
        className: 'custom-popup animate-popup',
        anchor: 'bottom'
      }).setHTML(`
        <div class="bg-[#111111] shadow-lg rounded-xl p-4 border border-white/10 relative">
          <div class="flex items-start gap-4">
            <div class="relative flex flex-col items-center w-20">
              <div class="relative mt-2">
                <div class="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20 blur-md"></div>
                <img
                  src="${pro.image}"
                  alt="${pro.name}"
                  class="w-16 h-16 rounded-full border-2 border-purple-200/50 relative z-10"
                />
              </div>
              <div class="flex flex-col items-center mt-3">
                <div class="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1">
                  <svg class="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span class="text-sm font-bold text-white">${pro.rating}</span>
                </div>
                <span class="text-xs text-white/70 mt-1">(${pro.reviews} reviews)</span>
              </div>
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-lg text-white leading-tight mb-1">${pro.name}</h3>
              </div>
              <div class="flex items-center text-sm text-white/80 mt-1 font-medium">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>${pro.service}</span>
              </div>
              <div class="flex items-center text-sm text-white/60 mt-1">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>${pro.location}</span>
              </div>
              <div class="flex items-center text-sm text-white/60 mt-1">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>${pro.responseTime}</span>
              </div>
              <div class="mt-4 flex gap-2">
                <button class="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white py-1 px-3 rounded-full text-xs font-medium transition-all duration-300 hover:shadow-lg hover:from-purple-700 hover:to-purple-500">
                  Book Now
                </button>
                <button class="flex-1 bg-gradient-to-r from-purple-600/20 to-purple-400/20 hover:from-purple-600/30 hover:to-purple-400/30 text-purple-100 py-1 px-3 rounded-full text-xs font-medium transition-all duration-300 border border-white/10">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      `);

      // Create and add the marker
      const marker = new mapboxgl.Marker({
        color: "#9333EA",
        clickTolerance: 3
      })
        .setLngLat(pro.coords)
        .addTo(map);

      // Add click event to show popup
      marker.getElement().addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Remove any existing popups with fade out
        const existingPopups = document.getElementsByClassName('mapboxgl-popup');
        Array.from(existingPopups).forEach(popup => {
          (popup as HTMLElement).style.opacity = '0';
          (popup as HTMLElement).style.transform = 'translateY(5px) scale(0.98)';
          setTimeout(() => popup.remove(), 200);
        });
        
        // Show new popup
        popup.setLngLat(pro.coords).addTo(map);
        
        // Move map to center on marker
        moveToMarker(pro.coords);
      });

      // Optional: Remove popup when clicking elsewhere on the map
      map.on('click', () => {
        popup.remove();
      });
    });

    return () => {
      map.remove();
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}
    />
  );
} 