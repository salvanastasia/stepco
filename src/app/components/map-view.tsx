import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const [position, setPosition] = useState<[number, number]>([37.7749, -122.4194]);
  const pathRef = useRef<[number, number][]>([[37.7749, -122.4194]]);

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: position,
      zoom: 15,
      zoomControl: true,
      attributionControl: false,
    });

    leafletMapRef.current = map;

    // Add dark tile layer - CartoDB Dark Matter
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Create custom blue marker icon
    const blueIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 20px;
          height: 20px;
          background: #4285F4;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(66, 133, 244, 0.5);
        "></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    // Add marker
    markerRef.current = L.marker(position, { icon: blueIcon }).addTo(map);

    // Add polyline for path
    polylineRef.current = L.polyline([position], {
      color: '#ffffff',
      weight: 4,
      opacity: 0.9,
    }).addTo(map);

    // Simulate walking movement
    let angle = 0;
    const interval = setInterval(() => {
      const [lat, lng] = pathRef.current[pathRef.current.length - 1];
      
      // Create walking pattern
      angle += 0.1;
      const newLat = lat + Math.sin(angle) * 0.0002;
      const newLng = lng + Math.cos(angle) * 0.0002;
      const newPos: [number, number] = [newLat, newLng];

      pathRef.current.push(newPos);
      
      // Keep only last 100 points
      if (pathRef.current.length > 100) {
        pathRef.current.shift();
      }

      setPosition(newPos);

      // Update marker and path
      if (markerRef.current && polylineRef.current && leafletMapRef.current) {
        markerRef.current.setLatLng(newPos);
        polylineRef.current.setLatLngs(pathRef.current);
        leafletMapRef.current.panTo(newPos, { animate: true, duration: 0.5 });
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="size-full relative bg-[#0a0a0a]">
      <div 
        ref={mapRef} 
        className="size-full"
        style={{ 
          width: '100%', 
          height: '100%',
          background: '#0a0a0a'
        }}
      />
      
      <div className="absolute top-8 left-8 bg-[#2a2a2a] rounded-lg px-4 py-3 border border-[#3a3a3a] z-[1000]">
        <div className="text-white text-sm font-['JetBrains_Mono']">Walking Route</div>
        <div className="text-[#999] text-xs mt-1 font-['JetBrains_Mono']">
          {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </div>
      </div>

      <style>{`
        .leaflet-container {
          background: #0a0a0a;
        }
        .leaflet-tile-pane {
          filter: brightness(0.9) contrast(1.1);
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
