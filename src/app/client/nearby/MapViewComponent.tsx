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

    // Add markers for each professional
    professionals.forEach((pro) => {
      // Create a popup with more information
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '300px',
        className: 'custom-popup'
      }).setHTML(`
        <div class="p-3 text-black">
          <h3 class="font-bold text-lg mb-1">${pro.name}</h3>
          <p class="text-gray-600 mb-2">${pro.service}</p>
          <div class="flex items-center gap-1 text-sm">
            <span class="text-yellow-500">⭐</span>
            <span class="font-medium">${pro.rating}</span>
            <span class="text-gray-500">(${pro.reviews} reviews)</span>
          </div>
          <p class="text-gray-600 text-sm mt-1">📍 ${pro.location}</p>
        </div>
      `);

      // Create and add the marker
      const marker = new mapboxgl.Marker({
        color: "#9333EA",
      })
        .setLngLat(pro.coords)
        .setPopup(popup)
        .addTo(map);

      // Add hover effect
      marker.getElement().addEventListener('mouseenter', () => popup.addTo(map));
      marker.getElement().addEventListener('mouseleave', () => {
        setTimeout(() => {
          if (!popup.isOpen()) popup.remove();
        }, 300);
      });
    });

    // Add custom styles for popups
    const style = document.createElement('style');
    style.textContent = `
      .custom-popup .mapboxgl-popup-content {
        border-radius: 12px;
        padding: 0;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }
      .custom-popup .mapboxgl-popup-close-button {
        padding: 4px 8px;
        right: 4px;
        top: 4px;
        color: #666;
        font-size: 16px;
        border-radius: 50%;
        transition: all 0.2s;
      }
      .custom-popup .mapboxgl-popup-close-button:hover {
        background-color: #f3f4f6;
        color: #000;
      }
    `;
    document.head.appendChild(style);

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