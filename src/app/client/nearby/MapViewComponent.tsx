"use client";

import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

interface MapViewProps {
  professionals?: any[];
}

interface MapViewRef {
  openPin: (pinId: string) => void;
}

const MapView = forwardRef<MapViewRef, MapViewProps>(({ professionals: propProfessionals }, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const markersRef = useRef<Map<string, { marker: mapboxgl.Marker; popup: mapboxgl.Popup }>>(new Map());

  useImperativeHandle(ref, () => ({
    openPin: (pinId: string) => {
      const markerData = markersRef.current.get(pinId);
      if (markerData) {
        // Close all other popups
        markersRef.current.forEach((data, id) => {
          if (id !== pinId) {
            data.popup.remove();
          }
        });

        // Open the specific popup
        markerData.popup.addTo((markerData.marker as any).getMap()!);

        // Center map on the marker
        const map = (markerData.marker as any).getMap()!;
        map.flyTo({
          center: markerData.marker.getLngLat(),
          zoom: 15,
          duration: 1000
        });
      }
    }
  }));

  // Fetch user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);



  const [mapLoaded, setMapLoaded] = useState(false);
  const professionalsRef = useRef(propProfessionals);

  // Keep ref in sync with props
  useEffect(() => {
    professionalsRef.current = propProfessionals;
  }, [propProfessionals]);

  // Initialize map once
  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [80.2707, 13.0827], // Default to Chennai
      zoom: 11,
      minZoom: 3,
      maxZoom: 18,
      dragRotate: true,
      pitchWithRotate: true,
      touchZoomRotate: true
    });

    // Store map reference
    mapRef.current = map;

    // Add navigation controls
    const nav = new mapboxgl.NavigationControl({
      showCompass: true,
      showZoom: true,
      visualizePitch: true
    });
    map.addControl(nav, 'top-right');

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true
    });
    map.addControl(geolocate, 'top-right');

    const scale = new mapboxgl.ScaleControl({ maxWidth: 64, unit: 'metric' });
    map.addControl(scale, 'top-left');

    map.keyboard.enable();
    map.dragRotate.enable();
    map.touchZoomRotate.enableRotation();

    // Map loaded handler
    map.on('load', () => {
      setMapLoaded(true);
      const currentProfessionals = professionalsRef.current || [];

      // Add source and empty layers initially
      map.addSource('places', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: currentProfessionals.map((pro: any) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: pro.coords
            },
            properties: {
              id: pro.id,
              name: pro.name
            }
          }))
        }
      });

      map.addLayer({
        id: 'professional-heat',
        type: 'heatmap',
        source: 'places',
        maxzoom: 15,
        paint: {
          'heatmap-weight': 1,
          'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 15, 3],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(147, 51, 234, 0)',
            0.2, 'rgba(147, 51, 234, 0.2)',
            0.4, 'rgba(147, 51, 234, 0.4)',
            0.6, 'rgba(147, 51, 234, 0.6)',
            0.8, 'rgba(147, 51, 234, 0.8)',
            1, 'rgba(147, 51, 234, 1)'
          ],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 15, 20],
          'heatmap-opacity': 0.7
        }
      });

      map.addLayer({
        id: 'professional-point',
        type: 'circle',
        source: 'places',
        minzoom: 14,
        paint: {
          'circle-radius': 6,
          'circle-color': '#9333EA',
          'circle-stroke-width': 2,
          'circle-stroke-color': 'white',
          'circle-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0, 15, 1]
        }
      });
    });

    // Styles injection (moved inside to ensure single injection)
    const mapStyle = document.createElement('style');
    mapStyle.textContent = `
      .mapboxgl-ctrl-top-right { margin-top: 110px !important; }
      .mapboxgl-ctrl-top-right .mapboxgl-ctrl { margin: 10px 10px 0 0; }
      .mapboxgl-ctrl-top-left { margin-top: 110px !important; }
      .mapboxgl-ctrl-top-left .mapboxgl-ctrl { margin: 10px 0 0 10px; }
      .mapboxgl-ctrl-group { background: transparent !important; border: none !important; box-shadow: none !important; border-radius: 6px !important; transform: scale(1.01) !important; transform-origin: center !important; }
      .mapboxgl-ctrl-group button { background-color: white !important; border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important; width: 24px !important; height: 24px !important; display: flex !important; align-items: center !important; justify-content: center !important; border-radius: 4px !important; }
      .mapboxgl-ctrl button svg, .mapboxgl-ctrl-group button svg, .mapboxgl-ctrl-zoom-in .mapboxgl-ctrl-icon, .mapboxgl-ctrl-zoom-out .mapboxgl-ctrl-icon, .mapboxgl-ctrl-compass .mapboxgl-ctrl-icon, .mapboxgl-ctrl-geolocate .mapboxgl-ctrl-icon { width: 16px !important; height: 16px !important; font-size: 16px !important; fill: #374151 !important; color: #374151 !important; background-size: 16px 16px !important; }
      .mapboxgl-ctrl-zoom-in svg path, .mapboxgl-ctrl-zoom-out svg path, .mapboxgl-ctrl-compass svg path, .mapboxgl-ctrl-geolocate svg path { fill: #374151 !important; stroke: #374151 !important; stroke-width: 2 !important; }
      .mapboxgl-ctrl-icon { width: 16px !important; height: 16px !important; font-size: 16px !important; line-height: 16px !important; }
      .mapboxgl-ctrl-group button:hover { background-color: #f8f8f8 !important; transform: scale(1.02) !important; }
      .mapboxgl-ctrl-group button:last-child { border-bottom: none !important; }
      .mapboxgl-ctrl-scale { min-width: 50px !important; height: 22px !important; display: flex !important; align-items: center !important; justify-content: center !important; background-color: white !important; border: 1px solid rgba(0, 0, 0, 0.1) !important; color: #666 !important; font-size: 11px !important; font-weight: 500 !important; padding: 0 6px !important; border-radius: 6px !important; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important; transition: all 0.2s ease-in-out !important; letter-spacing: 0.2px !important; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important; }
      .mapboxgl-ctrl-scale:hover { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08) !important; transform: translateY(-1px) !important; }
      .mapboxgl-ctrl-attrib { display: none; }
    `;
    document.head.appendChild(mapStyle);

    const popupStyle = document.createElement('style');
    popupStyle.textContent = `
      .custom-popup { transform-origin: 50% calc(100% - 8px); filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3)); }
      .custom-popup.animate-popup { animation: none; opacity: 0; transform: translateY(5px) scale(0.98); transition: opacity 0.2s ease-out, transform 0.2s ease-out; }
      .custom-popup.mapboxgl-popup-anchor-bottom { opacity: 1; transform: translateY(0) scale(1); }
      .custom-popup .mapboxgl-popup-content { border-radius: 12px; padding: 0; background: transparent; box-shadow: none; border: none; transform-origin: bottom center; transition: transform 0.3s ease-out; margin-top: 5px; }
      .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip { transition: transform 0.2s ease-out; border-top-color: rgba(0, 0, 0, 0.8); filter: drop-shadow(0 -1px 2px rgba(0, 0, 0, 0.1)); }
    `;
    document.head.appendChild(popupStyle);

    return () => {
      setMapLoaded(false);
      map.remove();
      mapRef.current = null;
      document.head.removeChild(mapStyle);
      document.head.removeChild(popupStyle);
    };
  }, []);

  // Handle Updates (Markers, Professionals)
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;
    if (!map) return;

    const professionals = propProfessionals || [];

    // Update GeoJSON Source
    const source = map.getSource('places') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: professionals.map((pro: any) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: pro.coords
          },
          properties: {
            id: pro.id,
            name: pro.name
          }
        }))
      });
    }

    // Clear and Recreate Markers (DOM elements need direct management)
    markersRef.current.forEach((markerData) => {
      markerData.marker.remove();
      markerData.popup.remove();
    });
    markersRef.current.clear();

    const moveToMarker = (coords: [number, number]) => {
      map.easeTo({
        center: coords,
        offset: [0, -15],
        duration: 500,
        easing: (t: number) => t * (2 - t)
      });
    };

    // Helper to add small offset to overlapping coordinates
    const usedCoords = new Map<string, number>(); // Track how many markers at each coord
    const getAdjustedCoords = (coords: [number, number]): [number, number] => {
      const key = `${coords[0].toFixed(5)},${coords[1].toFixed(5)}`; // Round to ~1m precision
      const count = usedCoords.get(key) || 0;
      usedCoords.set(key, count + 1);

      if (count === 0) return coords; // First marker at this location - no offset

      // Add small offset in a circular pattern for subsequent markers
      const angle = (count * 137.5) * (Math.PI / 180); // Golden angle for even distribution
      const radius = 0.0001 * count; // ~11m per count
      return [
        coords[0] + radius * Math.cos(angle),
        coords[1] + radius * Math.sin(angle)
      ];
    };

    professionals.forEach((pro: any, index: number) => {
      const currentIndex = index;
      const hasNext = currentIndex < professionals.length - 1;
      const hasPrev = currentIndex > 0;

      const popup = new mapboxgl.Popup({
        offset: [0, -2],
        closeButton: false,
        closeOnClick: false,
        maxWidth: '340px',
        className: 'custom-popup animate-popup',
        anchor: 'bottom'
      }).setHTML(`
            <div class="bg-gradient-to-br from-[#111111]/95 to-[#000000]/95 backdrop-blur-sm shadow-lg rounded-2xl p-4 border border-white/10 hover:border-white/20 relative cursor-pointer" style="width: 340px;" onclick="window.location.href='/client/freelancer/${pro.id}?source=map&pinId=${pro.id}'">
              <div class="flex justify-between items-center mb-2">
                <button class="nav-btn prev-btn flex items-center justify-center w-6 h-6 rounded-full bg-black/20 hover:bg-black/30 transition-colors text-white/60 hover:text-white ${!hasPrev ? 'opacity-50 cursor-not-allowed' : ''}" ${!hasPrev ? 'disabled' : ''} data-index="${currentIndex - 1}">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div class="text-xs font-medium text-white/50">${currentIndex + 1} / ${professionals.length}</div>
                <button class="nav-btn next-btn flex items-center justify-center w-6 h-6 rounded-full bg-black/20 hover:bg-black/30 transition-colors text-white/60 hover:text-white ${!hasNext ? 'opacity-50 cursor-not-allowed' : ''}" ${!hasNext ? 'disabled' : ''} data-index="${currentIndex + 1}">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
              <div class="flex items-start gap-4 mb-3">
                <div class="flex flex-col items-center">
                  <div class="relative mb-1">
                    <div class="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20 blur-md"></div>
                    <img src="${pro.image}" alt="${pro.name}" class="relative w-16 h-16 rounded-full border-2 border-purple-200/50 object-cover" />
                  </div>
                  <div class="flex items-center gap-1 bg-yellow-500/20 rounded px-1.5 py-0.5">
                    <svg class="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                    <span class="text-xs font-bold text-white">${pro.rating}</span>
                  </div>
                  <span class="text-xs text-white/70 mt-0.5">(${pro.reviews} reviews)</span>
                </div>
                <div class="flex-1 space-y-1">
                  <h3 class="text-lg font-bold text-white leading-tight">${pro.name}</h3>
                  <div class="flex items-center gap-2 text-white/80">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <span class="text-sm">${pro.cricketRole || pro.service}</span>
                  </div>
                  <div class="flex items-center gap-2 text-white/60">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span class="text-sm truncate">${pro.location}</span>
                  </div>
                  <div class="flex items-center gap-2 text-white/60">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    <span class="text-sm">${pro.distance !== null && pro.distance !== undefined ? (pro.distance < 1 ? `${(pro.distance * 1000).toFixed(0)}m away` : `${pro.distance.toFixed(1)}km away`) : 'Distance N/A'}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between pt-2 border-t border-white/5">
                ${pro.services && pro.services.length > 0 && pro.price > 0 ? `
                  <div class="flex items-baseline gap-1"><span class="text-sm text-white/70">From</span><span class="text-xl font-bold text-white">₹${pro.price}</span></div>
                  <button class="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-lg" onclick="event.stopPropagation(); window.location.href='/client/freelancer/${pro.id}?source=map&pinId=${pro.id}'">Hire Now</button>
                ` : `
                  <div class="flex items-center gap-2 text-white/50 text-sm italic"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span>No services listed</span></div>
                  <button class="px-4 py-1.5 bg-white/10 text-white/40 rounded-lg text-xs font-medium cursor-not-allowed" disabled>Unavailable</button>
                `}
              </div>
            </div>
        `);

      // Get adjusted coordinates to prevent overlapping
      const adjustedCoords = getAdjustedCoords(pro.coords);

      const marker = new mapboxgl.Marker({
        color: "#9333EA",
        clickTolerance: 3,
        scale: 0.8
      })
        .setLngLat(adjustedCoords)
        .addTo(map);

      markersRef.current.set(pro.id.toString(), { marker, popup });

      marker.getElement().addEventListener('click', (e) => {
        e.stopPropagation();
        const existingPopups = document.getElementsByClassName('mapboxgl-popup');
        Array.from(existingPopups).forEach(p => {
          (p as HTMLElement).style.opacity = '0';
          setTimeout(() => p.remove(), 200);
        });
        popup.setLngLat(pro.coords).addTo(map);
        moveToMarker(pro.coords);

        // Add navigation listeners
        setTimeout(() => {
          const prev = document.querySelector('.custom-popup .prev-btn');
          const next = document.querySelector('.custom-popup .next-btn');

          if (prev) prev.addEventListener('click', (e) => {
            e.stopPropagation();
            popup.remove();
            const targetIdx = parseInt(prev.getAttribute('data-index') || '0');
            if (targetIdx >= 0) {
              const items = Array.from(markersRef.current.values());
              if (items[targetIdx]) items[targetIdx].marker.getElement().click();
            }
          });

          if (next) next.addEventListener('click', (e) => {
            e.stopPropagation();
            popup.remove();
            const targetIdx = parseInt(next.getAttribute('data-index') || '0');
            if (targetIdx >= 0) {
              const items = Array.from(markersRef.current.values());
              if (items[targetIdx]) items[targetIdx].marker.getElement().click();
            }
          });
        }, 100);
      });

      map.on('click', () => popup.remove());
    });

    // Handle view adjustment logic (User Location vs Professionals Center)
    if (userLocation) {
      // If user location is available, we prioritize it (per user request)
      // The userLocation effect handles flying to user.
    } else {
      // Fallback logic if no user location yet
      if (professionals.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        professionals.forEach((p: any) => bounds.extend(p.coords));
        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, { padding: 50, maxZoom: 14 });
        }
      }
    }

  }, [propProfessionals, mapLoaded]); // Re-run when professionals change or map loads

  // Handle Location Updates
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    const map = mapRef.current;

    map.flyTo({
      center: userLocation,
      zoom: 13
    });

    // Add a marker for user location? Optional but good.
    // For now, just centering.
  }, [userLocation]);

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}
    />
  );
});

MapView.displayName = 'MapView';

export default MapView; 