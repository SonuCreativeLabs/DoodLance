"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { ChevronLeft, MapPin, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

export default function MapViewPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!mapContainer.current) return;
    console.log('Minimal map init');
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [80.2707, 13.0827],
      zoom: 11,
    });
    return () => map.remove();
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Map container */}
      <div
        ref={mapContainer}
        style={{ width: "100vw", height: "100vh", position: "absolute", top: 0, left: 0, zIndex: 0 }}
      />
      {/* Header */}
      <div className="absolute top-0 left-0 w-full flex flex-col gap-2 px-4 py-3 z-50 bg-black/60 backdrop-blur-md shadow-lg">
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => router.push('/client/nearby')}
            className="flex items-center justify-center w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full text-white/80 hover:text-white backdrop-blur-md shadow"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center flex-1">
            <h1 className="text-2xl font-semibold text-white drop-shadow">Nearby Professionals</h1>
            {/* Location Tab centered below title */}
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-white" />
              <select
                className="bg-transparent text-white text-sm focus:outline-none cursor-pointer appearance-none pr-6"
              >
                <option className="bg-[#1a1a1a]">Velachery</option>
              </select>
              <ChevronDown className="w-4 h-4 text-white" />
            </div>
          </div>
          {/* Filter Button */}
          <button
            onClick={() => setShowAllFilters((prev: boolean) => !prev)}
            className="flex items-center justify-center w-10 h-10 bg-black/60 hover:bg-black/80 rounded-lg text-white/80 transition-colors ml-2 border border-white/10 backdrop-blur-md shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25M6.343 6.343l-1.591 1.591M3 12h2.25m1.093 5.657l1.591 1.591M12 18.75V21m5.657-1.093l1.591-1.591M18.75 12H21m-1.093-5.657l-1.591-1.591" />
            </svg>
          </button>
        </div>
      </div>
      {/* Search Bar */}
      <div className="absolute left-0 w-full px-4 z-40" style={{ top: '8.5rem' }}>
        <Input
          type="text"
          placeholder="Search service or professionals..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-white/20 bg-black/60 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-md"
        />
      </div>
      {/* Filter Panel */}
      {showAllFilters && (
        <div className="absolute left-0 w-full px-4 z-50" style={{ top: '8.5rem' }}>
          <div className="bg-black/80 rounded-xl p-6 space-y-6 shadow-xl border border-white/10 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg text-white/80 font-semibold">Filters</span>
              <button onClick={() => setShowAllFilters(false)} className="text-white/60 hover:text-white/90 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Add your filter controls here, or copy from feed view */}
            <div className="text-white/60">(Filter controls go here...)</div>
          </div>
        </div>
      )}
      {/* Floating Feed View Button */}
      <button
        onClick={() => router.push('/client/nearby')}
        className="fixed bottom-20 right-6 z-50 bg-black/70 hover:bg-black/90 text-white/80 font-semibold px-6 py-3 rounded-full shadow-lg backdrop-blur-md transition-all duration-200"
        style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.25)' }}
      >
        Feed view
      </button>
    </div>
  );
} 