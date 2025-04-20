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
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
      if (!token) {
        console.error('Mapbox token is not defined');
        return;
      }

      mapboxgl.accessToken = token;

      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [80.2707, 13.0827], // Default to Chennai
        zoom: 12,
        maxZoom: 16,
        minZoom: 9
      });

      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

      newMap.on('load', () => {
        setMapLoaded(true);
        newMap.addLayer({
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 12,
          'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.6
          }
        });
      });

      map.current = newMap;

      return () => {
        newMap.remove();
        map.current = null;
        setMapLoaded(false);
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, []);

  // Handle markers
  useEffect(() => {
    const currentMap = map.current;
    if (!currentMap || !mapLoaded) return;

    try {
      // Clear existing markers
      markers.current.forEach(marker => marker.remove());
      markers.current = [];

      // Add markers for each gig
      gigs.forEach(gig => {
        try {
          const marker = new mapboxgl.Marker({
            color: selectedGigId === gig.id ? '#FF6B6B' : '#00FF9D',
            scale: 1.2
          })
            .setLngLat([gig.location.lng, gig.location.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25, className: 'dark-theme-popup' })
                .setHTML(`
                  <div class="p-3 bg-gray-800 text-white rounded-lg shadow-lg">
                    <h3 class="font-semibold text-lg mb-2">${gig.title}</h3>
                    <p class="text-gray-300 mb-1">${gig.location.address}</p>
                    <p class="text-green-400 font-medium">₹${gig.budget.min} - ₹${gig.budget.max}</p>
                  </div>
                `)
            )
            .addTo(currentMap);

          marker.getElement().addEventListener('click', () => {
            onMarkerClick(gig.id);
          });

          markers.current.push(marker);
        } catch (error) {
          console.error(`Error adding marker for gig ${gig.id}:`, error);
        }
      });

      // If a gig is selected, center the map on it
      if (selectedGigId) {
        const selectedGig = gigs.find(gig => gig.id === selectedGigId);
        if (selectedGig) {
          currentMap.flyTo({
            center: [selectedGig.location.lng, selectedGig.location.lat],
            zoom: 15
          });
        }
      }
    } catch (error) {
      console.error('Error updating markers:', error);
    }
  }, [gigs, selectedGigId, onMarkerClick, mapLoaded]);

  return (
    <div ref={mapContainer} className="absolute inset-0 bg-gray-900" style={{ minHeight: '100%' }} />
  );
} 