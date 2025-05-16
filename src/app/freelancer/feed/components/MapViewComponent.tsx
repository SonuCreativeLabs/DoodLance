"use client";

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Job } from '../types';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

interface MapViewProps {
  jobs: Job[];
  selectedJobId?: number;
  onMarkerClick?: (jobId: number) => void;
}

export default function MapView({ jobs, selectedJobId, onMarkerClick }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [77.5946, 12.9716], // Default to Bangalore
      zoom: 11,
      minZoom: 3,
      maxZoom: 18,
      dragRotate: true,
      pitchWithRotate: true,
      touchZoomRotate: true
    });

    // Add navigation controls
    const nav = new mapboxgl.NavigationControl({
      showCompass: true,
      showZoom: true,
      visualizePitch: true
    });
    map.addControl(nav, 'top-right');

    // Enable keyboard and touch controls
    map.keyboard.enable();
    map.dragRotate.enable();
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
      // Convert jobs to GeoJSON features
      const features: Feature<Geometry, GeoJsonProperties>[] = jobs.map(job => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point',
          // For demo, generate random coordinates around Bangalore
          coordinates: job.coords || [
            77.5946 + (Math.random() - 0.5) * 0.1,
            12.9716 + (Math.random() - 0.5) * 0.1
          ] as [number, number]
        },
        properties: {
          id: job.id,
          title: job.title,
          company: job.company
        }
      }));

      // Add source for job locations
      map.addSource('jobs', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features
        }
      });

      // Add heatmap layer
      map.addLayer({
        id: 'job-heat',
        type: 'heatmap',
        source: 'jobs',
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

      // Add circle layer for markers
      map.addLayer({
        id: 'job-point',
        type: 'circle',
        source: 'jobs',
        minzoom: 14,
        paint: {
          'circle-radius': 8,
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

      // Add markers with popups
      features.forEach((feature) => {
        const properties = feature.properties;
        if (!properties) return;
        const popup = new mapboxgl.Popup({
          offset: [0, -8],
          closeButton: true,
          closeOnClick: false,
          maxWidth: '340px',
          className: 'custom-popup animate-popup'
        })
        .setHTML(`
          <div class="bg-[#111111]/80 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <h3 class="text-white font-medium mb-1">${properties.title}</h3>
            <p class="text-white/60 text-sm">${properties.company}</p>
          </div>
        `);

        const marker = new mapboxgl.Marker({
          color: '#9333EA',
          scale: 0.8
        })
        .setLngLat((feature.geometry as any).coordinates)
        .setPopup(popup)
        .addTo(map);

        // Add click handler
        marker.getElement().addEventListener('click', () => {
          if (onMarkerClick && properties) {
            onMarkerClick(properties.id);
          }
        });
      });
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
  }, [jobs, onMarkerClick]);

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}
    />
  );
}
