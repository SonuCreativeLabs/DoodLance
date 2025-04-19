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
    latitude: 13.0827,  // Chennai latitude
    longitude: 80.2707, // Chennai longitude
    zoom: 11,
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
    <div className="w-full h-[calc(100vh-4rem)]">
      <Map
        {...viewState}
        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
        onClick={handleMapClick}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        style={{ width: '100%', height: '100%' }}
        reuseMaps={true}
      >
        {gigs.map(gig => (
          <Marker
            key={gig.id}
            latitude={gig.location.lat}
            longitude={gig.location.lng}
            anchor="bottom"
          >
            <div 
              className={`w-8 h-8 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center ${
                selectedGigId === gig.id 
                  ? 'bg-accent shadow-lg scale-125' 
                  : 'bg-primary hover:bg-primary-dark'
              }`}
              onClick={() => handleMarkerClick(gig)}
            >
              <MapPin className="w-4 h-4 text-white" />
            </div>
          </Marker>
        ))}

        {selectedGig && (
          <Popup
            latitude={selectedGig.location.lat}
            longitude={selectedGig.location.lng}
            onClose={() => setSelectedGig(null)}
            closeButton={true}
            closeOnClick={false}
            anchor="bottom"
            className="rounded-lg overflow-hidden"
          >
            <div className="p-3 min-w-[200px] bg-gradient-to-b from-primary to-primary-dark text-white">
              <h3 className="font-semibold text-sm">{selectedGig.title}</h3>
              <p className="text-xs text-white/90">${selectedGig.budget.min} - ${selectedGig.budget.max}</p>
              <p className="text-xs text-white/80 mt-1">{selectedGig.location.address}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
} 