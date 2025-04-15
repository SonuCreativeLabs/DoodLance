"use client";

import { useState } from 'react';
import { Map, Marker, Popup } from 'react-map-gl';
import type { ViewStateChangeEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

interface Gig {
  id: string;
  title: string;
  description: string;
  budget: {
    min: number;
    max: number;
  };
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

interface LocalMapProps {
  gigs: Gig[];
  onMarkerClick?: (gigId: string) => void;
  selectedGigId?: string | null;
}

export default function LocalMap({ gigs, onMarkerClick, selectedGigId }: LocalMapProps) {
  const [viewState, setViewState] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 12,
    bearing: 0,
    pitch: 0
  });

  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);

  const handleMarkerClick = (gig: Gig) => {
    setSelectedGig(gig);
    onMarkerClick?.(gig.id);
  };

  const handleMapClick = () => {
    setSelectedGig(null);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Map
        {...viewState}
        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
        onClick={handleMapClick}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        {gigs.map(gig => (
          <Marker
            key={gig.id}
            latitude={gig.location.lat}
            longitude={gig.location.lng}
          >
            <div 
              className={`w-6 h-6 rounded-full cursor-pointer transition-all duration-200 ${
                selectedGigId === gig.id 
                  ? 'bg-primary scale-125' 
                  : 'bg-primary/80 hover:bg-primary'
              }`}
              onClick={() => handleMarkerClick(gig)}
            />
          </Marker>
        ))}

        {selectedGig && (
          <Popup
            latitude={selectedGig.location.lat}
            longitude={selectedGig.location.lng}
            onClose={() => setSelectedGig(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="p-2">
              <h3 className="font-semibold">{selectedGig.title}</h3>
              <p className="text-sm text-gray-600">${selectedGig.budget.min} - ${selectedGig.budget.max}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
} 