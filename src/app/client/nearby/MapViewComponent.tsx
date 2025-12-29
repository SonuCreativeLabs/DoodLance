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

  // Function to calculate center of professionals
  const calculateCenter = (professionals: any[]) => {
    if (!professionals || professionals.length === 0) {
      return [80.2707, 13.0827]; // Default Chennai center
    }

    if (professionals.length === 1) {
      return professionals[0].coords || [80.2707, 13.0827];
    }

    // Calculate average coordinates
    const totalCoords = professionals.reduce(
      (acc, pro) => {
        const coords = pro.coords || [80.2707, 13.0827];
        return [acc[0] + coords[0], acc[1] + coords[1]];
      },
      [0, 0]
    );

    return [
      totalCoords[0] / professionals.length,
      totalCoords[1] / professionals.length
    ];
  };

  // Function to calculate appropriate zoom level
  const calculateZoom = (professionals: any[]) => {
    if (!professionals || professionals.length === 0) return 11;
    if (professionals.length === 1) return 14; // Zoom in closer for single professional
    if (professionals.length <= 3) return 12;
    if (professionals.length <= 6) return 11;
    return 10; // Zoom out for many professionals
  };

  // Re-render map when professionals change
  useEffect(() => {
    if (!mapContainer.current) return;

    // Mock data removed
    const professionals = propProfessionals || [];

    if (!professionals) return;

    // Calculate center and zoom for filtered professionals
    const center = calculateCenter(professionals);
    const zoom = calculateZoom(professionals);

    // Initialize map
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center as [number, number],
      zoom: zoom,
      minZoom: 3,
      maxZoom: 18,
      dragRotate: true,
      pitchWithRotate: true,
      touchZoomRotate: true
    });

    // Store map reference for cleanup
    (mapContainer.current as any)._mapboxMap = map;

    // Add navigation controls with all features enabled
    const nav = new mapboxgl.NavigationControl({
      showCompass: true,
      showZoom: true,
      visualizePitch: true
    });
    map.addControl(nav, 'top-right');

    // Enable keyboard controls for rotation
    map.keyboard.enable();

    // Add double-click-and-drag handler for rotation
    map.dragRotate.enable();

    // Add touch rotation handler
    map.touchZoomRotate.enableRotation();

    // Add geolocation control
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });
    map.addControl(geolocate, 'top-right');

    // Add scale control
    const scale = new mapboxgl.ScaleControl({
      maxWidth: 64,
      unit: 'metric'
    });
    map.addControl(scale, 'top-left');

    // Wait for map to load before adding markers
    map.on('load', () => {
      // Add custom map features
      map.addSource('places', {
        type: 'geojson',
        data: {
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
        }
      });

      // Add a heatmap layer to show concentration of professionals
      map.addLayer({
        id: 'professional-heat',
        type: 'heatmap',
        source: 'places',
        maxzoom: 15,
        paint: {
          'heatmap-weight': 1,
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 1,
            15, 3
          ],
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
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 2,
            15, 20
          ],
          'heatmap-opacity': 0.7
        }
      });

      // Add circle layer for better visibility at high zoom levels
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
          'circle-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            14, 0,
            15, 1
          ]
        }
      });
    });

    // Clear existing markers
    markersRef.current.forEach((markerData) => {
      markerData.marker.remove();
      markerData.popup.remove();
    });
    markersRef.current.clear();

    // Add markers for each professional
    professionals.forEach((pro: any, index: number) => {
      const currentIndex = index;
      const hasNext = currentIndex < professionals.length - 1;
      const hasPrev = currentIndex > 0;

      // Create a popup with more information
      const popup = new mapboxgl.Popup({
        offset: [0, -2], // Moved 5% down (from -5 to -2)
        closeButton: false, // Disable default close button
        closeOnClick: false,
        maxWidth: '340px',
        className: 'custom-popup animate-popup',
        anchor: 'bottom'
      }).setHTML(`
        <div class="bg-gradient-to-br from-[#111111]/95 to-[#000000]/95 backdrop-blur-sm shadow-lg rounded-2xl p-4 border border-white/10 hover:border-white/20 relative cursor-pointer" style="width: 340px;" onclick="window.location.href='/client/freelancer/${pro.id}?source=map&pinId=${pro.id}'">
          <!-- Minimal Navigation Arrows -->
          <div class="flex justify-between items-center mb-2">
            <button class="nav-btn prev-btn flex items-center justify-center w-6 h-6 rounded-full bg-black/20 hover:bg-black/30 transition-colors text-white/60 hover:text-white ${!hasPrev ? 'opacity-50 cursor-not-allowed' : ''}"
                    ${!hasPrev ? 'disabled' : ''} data-index="${currentIndex - 1}">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="text-xs font-medium text-white/50">${currentIndex + 1} / ${professionals.length}</div>
            <button class="nav-btn next-btn flex items-center justify-center w-6 h-6 rounded-full bg-black/20 hover:bg-black/30 transition-colors text-white/60 hover:text-white ${!hasNext ? 'opacity-50 cursor-not-allowed' : ''}"
                    ${!hasNext ? 'disabled' : ''} data-index="${currentIndex + 1}">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- Profile Section - List View Style -->
          <div class="flex items-start gap-4 mb-3">
            <!-- Left: Avatar with Rating Below -->
            <div class="flex flex-col items-center">
              <div class="relative mb-1">
                <div class="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20 blur-md"></div>
                <img
                  src="${pro.image}"
                  alt="${pro.name}"
                  class="relative w-16 h-16 rounded-full border-2 border-purple-200/50 object-cover"
                />
              </div>
              <div class="flex items-center gap-1 bg-yellow-500/20 rounded px-1.5 py-0.5">
                <svg class="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span class="text-xs font-bold text-white">${pro.rating}</span>
              </div>
              <span class="text-xs text-white/70 mt-0.5">(${pro.reviews} reviews)</span>
            </div>

            <!-- Right: Info -->
            <div class="flex-1 space-y-1">
              <h3 class="text-lg font-bold text-white leading-tight">${pro.name}</h3>

              <div class="flex items-center gap-2 text-white/80">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="text-sm">${pro.cricketRole || pro.service}</span>
              </div>

              <div class="flex items-center gap-2 text-white/60">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-sm truncate">${pro.location}${pro.distance ? `<span style="opacity: 0.3; margin: 0 4px; font-size: 10px;">|</span>${pro.distance < 1 ? `${(pro.distance * 1000).toFixed(0)}m` : `${pro.distance.toFixed(1)}km`} away` : ''}</span>
              </div>

              <div class="flex items-center gap-2 text-white/60">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm">${pro.responseTime}</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-2 border-t border-white/5">
            <div class="flex items-baseline gap-1">
              <span class="text-sm text-white/70">From</span>
              <span class="text-xl font-bold text-white">₹${pro.price}</span>
            </div>
            <button class="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-lg" onclick="event.stopPropagation(); window.location.href='/client/freelancer/${pro.id}?source=map&pinId=${pro.id}'">
              Hire Now
            </button>
          </div>
        </div>
      `);

      // Create and add the marker
      const marker = new mapboxgl.Marker({
        color: "#9333EA",
        clickTolerance: 3,
        scale: 0.8 // Slightly smaller markers for better aesthetics
      })
        .setLngLat(pro.coords)
        .addTo(map);

      // Store marker and popup in ref for later access
      markersRef.current.set(pro.id.toString(), { marker, popup });

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

        // Add navigation button event listeners
        setTimeout(() => {
          const prevBtn = document.querySelector('.custom-popup .prev-btn');
          const nextBtn = document.querySelector('.custom-popup .next-btn');

          if (prevBtn && !prevBtn.hasAttribute('disabled')) {
            prevBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              const targetIndex = parseInt(prevBtn.getAttribute('data-index') || '0');
              if (targetIndex >= 0 && targetIndex < professionals.length) {
                // Remove current popup
                popup.remove();
                // Trigger click on the previous marker
                const markers = document.querySelectorAll('.mapboxgl-marker');
                if (markers[targetIndex]) {
                  (markers[targetIndex] as HTMLElement).click();
                }
              }
            });
          }

          if (nextBtn && !nextBtn.hasAttribute('disabled')) {
            nextBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              const targetIndex = parseInt(nextBtn.getAttribute('data-index') || '0');
              if (targetIndex >= 0 && targetIndex < professionals.length) {
                // Remove current popup
                popup.remove();
                // Trigger click on the next marker
                const markers = document.querySelectorAll('.mapboxgl-marker');
                if (markers[targetIndex]) {
                  (markers[targetIndex] as HTMLElement).click();
                }
              }
            });
          }
        }, 100);

        // Move map to center on marker
        moveToMarker(pro.coords);
      });

      // Optional: Remove popup when clicking elsewhere on the map
      map.on('click', () => {
        popup.remove();
      });
    });

    // Add custom styles for map controls
    const mapStyle = document.createElement('style');
    mapStyle.textContent = `
      .mapboxgl-ctrl-top-right {
        margin-top: 110px !important;
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
        background: transparent !important; /* Remove background layer */
        border: none !important; /* Remove border */
        box-shadow: none !important; /* Remove shadow */
        border-radius: 6px !important;
        transform: scale(1.01) !important; /* Minimal 1% scaling */
        transform-origin: center !important;
      }

      .mapboxgl-ctrl-group button {
        background-color: white !important; /* White button background */
        border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important; /* Very subtle border */
        width: 24px !important; /* Further reduced size */
        height: 24px !important; /* Further reduced size */
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 4px !important;
      }

      /* More aggressive icon sizing for all map controls */
      .mapboxgl-ctrl button svg,
      .mapboxgl-ctrl-group button svg,
      .mapboxgl-ctrl-zoom-in .mapboxgl-ctrl-icon,
      .mapboxgl-ctrl-zoom-out .mapboxgl-ctrl-icon,
      .mapboxgl-ctrl-compass .mapboxgl-ctrl-icon,
      .mapboxgl-ctrl-geolocate .mapboxgl-ctrl-icon {
        width: 16px !important; /* Adjusted for smaller button size */
        height: 16px !important; /* Adjusted for smaller button size */
        font-size: 16px !important; /* For icon fonts */
        fill: #374151 !important;
        color: #374151 !important;
        background-size: 16px 16px !important;
      }

      /* Specific targeting for different icon types */
      .mapboxgl-ctrl-zoom-in svg path,
      .mapboxgl-ctrl-zoom-out svg path,
      .mapboxgl-ctrl-compass svg path,
      .mapboxgl-ctrl-geolocate svg path {
        fill: #374151 !important;
        stroke: #374151 !important;
        stroke-width: 2 !important;
      }

      /* Force size on the icon containers themselves */
      .mapboxgl-ctrl-icon {
        width: 16px !important;
        height: 16px !important;
        font-size: 16px !important;
        line-height: 16px !important;
      }

      .mapboxgl-ctrl-group button:hover {
        background-color: #f8f8f8 !important; /* Light gray hover */
        transform: scale(1.02) !important; /* Slight hover effect */
      }

      .mapboxgl-ctrl-group button:last-child {
        border-bottom: none !important;
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
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
      }

      .mapboxgl-ctrl-scale:hover {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08) !important;
        transform: translateY(-1px) !important;
      }

      .mapboxgl-ctrl-attrib {
        display: none;
      }
    `;
    document.head.appendChild(mapStyle);

    // Add custom styles for popups
    const style = document.createElement('style');
    style.textContent = `
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
        transform-origin: bottom center;
        transition: transform 0.3s ease-out;
        margin-top: 5px; /* Spacing from marker */
      }

      .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
        transition: transform 0.2s ease-out;
        border-top-color: rgba(0, 0, 0, 0.8);
        filter: drop-shadow(0 -1px 2px rgba(0, 0, 0, 0.1));
      }
    `;
    document.head.appendChild(style);

    // Function to smoothly move between markers
    const moveToMarker = (coords: [number, number]) => {
      map.easeTo({
        center: coords,
        offset: [0, -15], // Adjusted for new popup position (from -20 to -15)
        duration: 500,
        easing: (t) => {
          return t * (2 - t);
        }
      });
    };

    return () => {
      map.remove();
      document.head.removeChild(style);
      document.head.removeChild(mapStyle);
    };
  }, [propProfessionals]); // Re-run when professionals prop changes

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}
    />
  );
});

MapView.displayName = 'MapView';

export default MapView; 