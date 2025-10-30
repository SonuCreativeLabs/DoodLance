import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: string;
}

export function MapModal({ isOpen, onClose, location }: MapModalProps) {
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

        // Add fullscreen control
        const fullscreen = new mapboxgl.FullscreenControl();
        map.addControl(fullscreen, 'top-right');

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

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMapError(null);
      setMapLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#111111] via-[#0f0f0f] to-[#111111] border border-gray-600/30 shadow-lg max-w-4xl w-full max-h-[80vh]"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Location: {location}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-800">
            {mapLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-white">Loading map...</div>
              </div>
            )}

            {mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-red-400 text-center">
                  <p>{mapError}</p>
                  <p className="text-sm mt-2">Please check your internet connection and try again.</p>
                </div>
              </div>
            )}

            <div
              ref={mapRef}
              className="w-full h-full"
              style={{ display: mapLoading || mapError ? 'none' : 'block' }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
