import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { X, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface FullScreenMapProps {
  isOpen: boolean;
  onClose: () => void;
  location: string;
}

export function FullScreenMap({ isOpen, onClose, location }: FullScreenMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapLoading, setMapLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || mapInstance.current || !mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      setMapError('Mapbox access token is not configured');
      return;
    }

    mapboxgl.accessToken = token;
    setMapLoading(true);

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [80.2707, 13.0827], // Default center (Chennai)
      zoom: 12,
      attributionControl: false
    });

    mapInstance.current = map;

    const onLoad = async () => {
      try {
        // Add navigation control
        const nav = new mapboxgl.NavigationControl({
          showCompass: false,
          visualizePitch: false
        });
        map.addControl(nav, 'top-right');

        // Add geolocation control
        const geolocate = new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
          showUserHeading: true,
          showUserLocation: true,
          fitBoundsOptions: { maxZoom: 15 }
        });
        map.addControl(geolocate, 'top-right');

        // Add scale control
        const scale = new mapboxgl.ScaleControl({ maxWidth: 120, unit: 'metric' });
        map.addControl(scale, 'bottom-left');

        // Geocode the location
        try {
          const resp = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${token}&limit=1`
          );
          const data = await resp.json();
          const feature = data?.features?.[0];
          if (feature?.center && Array.isArray(feature.center)) {
            const [lng, lat] = feature.center;
            map.flyTo({ center: [lng, lat], zoom: 13, essential: true });
            new mapboxgl.Marker({ color: '#1d59eb' }).setLngLat([lng, lat]).addTo(map);
          }
        } catch (e) {
          setMapError('Failed to locate the address on the map');
        } finally {
          setMapLoading(false);
        }
      } catch (e) {
        setMapLoading(false);
      }
    };

    map.on('load', onLoad);
    const onError = () => setMapLoading(false);
    map.on('error', onError);

    return () => {
      map.off('load', onLoad);
      map.off('error', onError);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [isOpen, location]);

  useEffect(() => {
    if (!isOpen) return;

    // Add custom styles for map controls
    const styleId = 'fullscreen-map-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
      .fullscreen-map .mapboxgl-ctrl-top-right {
        top: 10% !important;
        right: 10px !important;
      }
      
      /* Increase button sizes */
      .fullscreen-map .mapboxgl-ctrl button {
        width: 36px !important;
        height: 36px !important;
        font-size: 14px !important;
      }
      
      .fullscreen-map .mapboxgl-ctrl-group button {
        width: 36px !important;
        height: 36px !important;
        font-size: 14px !important;
      }
      
      /* Increase zoom in/out icon sizes */
      .fullscreen-map .mapboxgl-ctrl-group button:nth-child(1) .mapboxgl-ctrl-icon,
      .fullscreen-map .mapboxgl-ctrl-group button:nth-child(2) .mapboxgl-ctrl-icon {
        width: 16px !important;
        height: 16px !important;
      }
      
      /* Hide Mapbox watermark and attribution */
      .fullscreen-map .mapboxgl-ctrl-logo,
      .fullscreen-map .mapboxgl-ctrl-attrib,
      .fullscreen-map .mapbox-improve-map {
        display: none !important;
      }
    `;

    return () => {
      // Cleanup styles when component unmounts
      const element = document.getElementById(styleId);
      if (element) {
        document.head.removeChild(element);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-white text-lg font-medium">Location: {location}</h2>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="w-full h-full relative">
        {mapLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-white text-lg">Loading map...</div>
          </div>
        )}

        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center text-white">
              <div className="text-red-400 text-lg mb-2">⚠️ {mapError}</div>
              <div className="text-sm opacity-80">Please check your internet connection and try again.</div>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div
          ref={mapRef}
          className="w-full h-full fullscreen-map"
          style={{ display: mapLoading || mapError ? 'none' : 'block' }}
        />
      </div>
    </motion.div>
  );
}
