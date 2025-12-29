'use client';

import { useEffect, useState } from 'react';

// Dynamic import to handle missing dependency gracefully
let MapContainer: any = null;
let TileLayer: any = null;
let Marker: any = null;
let Popup: any = null;
let L: any = null;

try {
  const leaflet = require('react-leaflet');
  const leafletLib = require('leaflet');
  MapContainer = leaflet.MapContainer;
  TileLayer = leaflet.TileLayer;
  Marker = leaflet.Marker;
  Popup = leaflet.Popup;
  L = leafletLib.default || leafletLib;

  // Import CSS if available
  try {
    require('leaflet/dist/leaflet.css');
  } catch (e) {
    // CSS not available, continue
  }
} catch (e) {
  // react-leaflet not available, component will show fallback
}

// Fix for default marker icons in Next.js - only create if L is available
const icon = L ? L.icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
}) : null;

interface MapViewProps {
  filters: {
    radius: number;
    category: string;
    priceRange: [number, number];
    rating: number;
  };
}

interface Job {
  id: string;
  title: string;
  price: number;
  location: [number, number];
  category: string;
  rating: number;
}

export function MapView({ filters }: MapViewProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Get user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );

    // TODO: Fetch jobs from API based on filters
    // TODO: Fetch jobs from API based on filters
    setJobs([]);


  }, [filters]);

  if (!userLocation) {
    return <div className="h-full flex items-center justify-center">Loading map...</div>;
  }

  // If map components are not available, show fallback
  if (!MapContainer || !TileLayer || !Marker || !Popup) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-center p-6">
          <div className="text-4xl mb-4">🗺️</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Map View Unavailable</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Map functionality is currently disabled. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <MapContainer
        center={[userLocation[0], userLocation[1]]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        <Marker position={[userLocation[0], userLocation[1]]} icon={icon}>
          <Popup>Your Location</Popup>
        </Marker>

        {/* Job markers */}
        {jobs.map((job) => (
          <Marker key={job.id} position={[job.location[0], job.location[1]]} icon={icon}>
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{job.title}</h3>
                <p>${job.price}</p>
                <p>{job.category}</p>
                <p>Rating: {job.rating} stars</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
} 