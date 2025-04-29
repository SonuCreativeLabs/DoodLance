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
      style: 'mapbox://styles/mapbox/streets-v12', // Default Mapbox style
      center: [80.2707, 13.0827], // Chennai center
      zoom: 11,
    });

    // Add markers for each professional
    professionals.forEach((pro) => {
      // Create a popup with more information
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="color: black;">
          <strong>${pro.name}</strong><br/>
          ${pro.service}<br/>
          <small>⭐ ${pro.rating} (${pro.reviews} reviews)</small><br/>
          <small>📍 ${pro.location}</small>
        </div>
      `);

      // Create and add the marker
      new mapboxgl.Marker({
        color: "#9333EA", // Purple color to match theme
      })
        .setLngLat(pro.coords)
        .setPopup(popup)
        .addTo(map);
    });

    return () => map.remove();
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}
    />
  );
} 