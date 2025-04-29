import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

// Mock professionals with coordinates
const professionals: { id: number; name: string; coords: [number, number] }[] = [
  { id: 1, name: 'John Smith', coords: [80.2707, 13.0827] }, // Chennai
  { id: 2, name: 'Sarah Johnson', coords: [80.0183, 12.8406] }, // Near Chennai
  { id: 3, name: 'Mike Wilson', coords: [79.9426, 13.6288] }, // Near Chennai
  { id: 4, name: 'Emma Davis', coords: [80.1627, 12.9716] }, // Near Chennai
  { id: 5, name: 'David Brown', coords: [79.8083, 12.9200] }, // Near Chennai
  { id: 6, name: 'Lisa Anderson', coords: [80.2376, 13.0674] }, // Near Chennai
];

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [80.2707, 13.0827],
      zoom: 11,
    });
    // Add markers
    professionals.forEach((pro) => {
      const marker = new mapboxgl.Marker()
        .setLngLat(pro.coords)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(pro.name))
        .addTo(map);
    });
    return () => map.remove();
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 0 }}
    />
  );
} 