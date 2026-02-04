import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface FriendFindingViewProps {
  friendName: string;
  friendAvatar: string;
  onClose: () => void;
  theme?: 'bw' | 'bo';
}

export default function FriendFindingView({ friendName, friendAvatar, onClose, theme = 'bw' }: FriendFindingViewProps) {
  const [distance, setDistance] = useState(150); // meters
  const [direction, setDirection] = useState(0); // degrees
  const [directionText, setDirectionText] = useState('ahead');
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const friendMarkerRef = useRef<L.Marker | null>(null);

  const accentColor = theme === 'bo' ? '#ff4400' : '#ffffff';
  
  // User location (center of map)
  const userLocation: [number, number] = [40.7580, -73.9855]; // NYC coordinates
  
  // Friend location (slightly offset)
  const [friendLocation, setFriendLocation] = useState<[number, number]>([40.7590, -73.9865]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: userLocation,
      zoom: 16,
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      attributionControl: false,
    });

    leafletMapRef.current = map;

    // Add dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Create custom markers
    const userIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="width: 40px; height: 40px; background: ${accentColor}; border-radius: 50%; border: 3px solid #1a1a1a; display: flex; align-items: center; justify-content: center; font-family: 'DM Mono', monospace; font-weight: bold; font-size: 12px; color: #1a1a1a;">YOU</div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const friendIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="width: 40px; height: 40px; border-radius: 50%; border: 3px solid ${accentColor}; overflow: hidden;"><img src="${friendAvatar}" style="width: 100%; height: 100%; object-fit: cover;" /></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    // Add markers
    userMarkerRef.current = L.marker(userLocation, { icon: userIcon }).addTo(map);
    friendMarkerRef.current = L.marker(friendLocation, { icon: friendIcon }).addTo(map);

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Simulate friend getting closer and direction changes
  useEffect(() => {
    const interval = setInterval(() => {
      setDistance(prev => {
        const newDist = Math.max(1, prev - Math.random() * 10);
        return newDist;
      });
      
      setDirection(prev => (prev + Math.random() * 20 - 10) % 360);
      
      // Update direction text based on angle
      const angle = direction;
      if (angle > 337.5 || angle <= 22.5) {
        setDirectionText('ahead');
      } else if (angle > 22.5 && angle <= 67.5) {
        setDirectionText('to your right');
      } else if (angle > 67.5 && angle <= 112.5) {
        setDirectionText('to your right');
      } else if (angle > 112.5 && angle <= 157.5) {
        setDirectionText('behind you');
      } else if (angle > 157.5 && angle <= 202.5) {
        setDirectionText('behind you');
      } else if (angle > 202.5 && angle <= 247.5) {
        setDirectionText('to your left');
      } else if (angle > 247.5 && angle <= 292.5) {
        setDirectionText('to your left');
      } else {
        setDirectionText('ahead');
      }

      // Update friend location to get closer
      setFriendLocation(prev => {
        const [lat, lng] = prev;
        const deltaLat = (userLocation[0] - lat) * 0.05;
        const deltaLng = (userLocation[1] - lng) * 0.05;
        const newLoc: [number, number] = [lat + deltaLat, lng + deltaLng];
        
        // Update marker position
        if (friendMarkerRef.current) {
          friendMarkerRef.current.setLatLng(newLoc);
        }
        
        return newLoc;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [direction]);

  // Get display text for distance
  const getDistanceText = () => {
    if (distance < 2) return 'nearby';
    if (distance < 100) return `${Math.round(distance)} m`;
    return `${Math.round(distance)} m`;
  };

  const getDistanceCategory = () => {
    if (distance < 5) return 'nearby';
    if (distance < 50) return 'close';
    return 'far';
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#1a1a1a]">
      {/* Top Half - Map */}
      <div className="h-1/2 relative">
        <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      </div>

      {/* Bottom Half - AirTag Finding Interface */}
      <div className="h-1/2 relative flex flex-col items-center justify-between p-8">
        {/* Header */}
        <div className="text-center">
          <p className="text-[#999] text-xs uppercase tracking-wider font-['DM_Mono'] mb-2">
            Finding
          </p>
          <h1 className="text-2xl font-light font-['Archivo']" style={{ color: accentColor }}>
            {friendName}
          </h1>
        </div>

        {/* Directional Arrow and Distance */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            {/* Arrow */}
            <motion.div
              animate={{ rotate: direction }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="mb-8"
            >
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M60 10 L40 50 L55 50 L55 110 L65 110 L65 50 L80 50 Z"
                  fill={accentColor}
                  opacity={getDistanceCategory() === 'nearby' ? 1 : 0.9}
                />
              </svg>
            </motion.div>

            {/* Distance */}
            <div className="space-y-1">
              <p className="text-6xl font-light font-['Archivo']" style={{ color: accentColor }}>
                {distance < 2 ? '1' : Math.round(distance)}
                {distance >= 2 && <span className="text-3xl text-[#999]"> m</span>}
              </p>
              <p className="text-xl text-[#999] font-light font-['DM_Mono']">
                {directionText}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex items-center justify-between w-full max-w-[200px]">
          <button
            onClick={onClose}
            className="w-14 h-14 rounded-full bg-[#2a2a2a] flex items-center justify-center hover:bg-[#333] transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#999" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <button
            className="w-14 h-14 rounded-full bg-[#2a2a2a] flex items-center justify-center hover:bg-[#333] transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C12 2 8 5 8 9C8 11 9.5 12.5 11.5 13L10 22L14 22L12.5 13C14.5 12.5 16 11 16 9C16 5 12 2 12 2Z" stroke="#999" strokeWidth="1.5" fill="#999" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}