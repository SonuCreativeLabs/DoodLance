'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Next.js
const icon = L.icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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
    // This is a mock implementation
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Plumbing Repair',
        price: 150,
        location: [37.7749, -122.4194],
        category: 'plumbing',
        rating: 4.5,
      },
      // Add more mock jobs here
    ];

    setJobs(mockJobs);
  }, [filters]);

  if (!userLocation) {
    return <div className="h-full flex items-center justify-center">Loading map...</div>;
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