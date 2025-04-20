'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Gig {
  id: string;
  title: string;
  description: string;
  distance: number;
  postedTime: string;
  budget: {
    min: number;
    max: number;
  };
  category: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  client: {
    id: string;
    name: string;
    rating: number;
    completedJobs: number;
  };
}

interface LocalMapProps {
  gigs: Gig[];
  onMarkerClick: (gigId: string) => void;
  selectedGigId: string | null;
}

export function LocalMap({ gigs, onMarkerClick, selectedGigId }: LocalMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [80.2707, 13.0827], // Default to Chennai
      zoom: 12
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for each gig
    gigs.forEach(gig => {
      const marker = new mapboxgl.Marker({
        color: selectedGigId === gig.id ? '#FF6B6B' : '#4ECDC4'
      })
        .setLngLat([gig.location.lng, gig.location.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-semibold">${gig.title}</h3>
                <p class="text-sm">${gig.location.address}</p>
                <p class="text-sm">₹${gig.budget.min} - ₹${gig.budget.max}</p>
              </div>
            `)
        )
        .addTo(map.current!);

      marker.getElement().addEventListener('click', () => {
        onMarkerClick(gig.id);
      });

      markers.current.push(marker);
    });

    // If a gig is selected, center the map on it
    if (selectedGigId) {
      const selectedGig = gigs.find(gig => gig.id === selectedGigId);
      if (selectedGig) {
        map.current.flyTo({
          center: [selectedGig.location.lng, selectedGig.location.lat],
          zoom: 15
        });
      }
    }
  }, [gigs, selectedGigId, onMarkerClick]);

  return (
    <div ref={mapContainer} className="w-full h-full" />
  );
} 