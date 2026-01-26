import { useEffect, useRef, useState } from 'react';

// Google Maps API key - replace with your own key
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

// Dark map style
const darkMapStyle = [
  {
    "featureType": "all",
    "elementType": "labels.text.fill",
    "stylers": [
      { "saturation": 36 },
      { "color": "#000000" },
      { "lightness": 40 }
    ]
  },
  {
    "featureType": "all",
    "elementType": "labels.text.stroke",
    "stylers": [
      { "visibility": "on" },
      { "color": "#000000" },
      { "lightness": 16 }
    ]
  },
  {
    "featureType": "all",
    "elementType": "labels.icon",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#000000" },
      { "lightness": 20 }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      { "color": "#000000" },
      { "lightness": 17 },
      { "weight": 1.2 }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [
      { "color": "#000000" },
      { "lightness": 20 }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      { "color": "#000000" },
      { "lightness": 21 }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#000000" },
      { "lightness": 17 }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      { "color": "#000000" },
      { "lightness": 29 },
      { "weight": 0.2 }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      { "color": "#000000" },
      { "lightness": 18 }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [
      { "color": "#000000" },
      { "lightness": 16 }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      { "color": "#000000" },
      { "lightness": 19 }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      { "color": "#000000" },
      { "lightness": 17 }
    ]
  }
];

export default function MapView() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pathCoords, setPathCoords] = useState<{ lat: number; lng: number }[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setError('Failed to load Google Maps');
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current || mapRef.current) return;

    const map = new google.maps.Map(mapContainerRef.current, {
      center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
      zoom: 15,
      styles: darkMapStyle,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    mapRef.current = map;
  }, [isLoaded]);

  // Track user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setPosition(newPos);
        setPathCoords(prev => [...prev, newPos]);
        setError(null);
      },
      (err) => {
        console.error('Geolocation error:', err.message);
        setError(`Unable to get your location: ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Update map when position changes
  useEffect(() => {
    if (!mapRef.current || !position) return;

    const map = mapRef.current;

    // Update or create marker
    if (markerRef.current) {
      markerRef.current.setPosition(position);
    } else {
      markerRef.current = new google.maps.Marker({
        position,
        map,
        title: 'Your Location',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        }
      });
    }

    // Center map on new position
    map.setCenter(position);

    // Update path
    if (pathCoords.length > 1) {
      if (polylineRef.current) {
        polylineRef.current.setPath(pathCoords);
      } else {
        polylineRef.current = new google.maps.Polyline({
          path: pathCoords,
          geodesic: true,
          strokeColor: '#ffffff',
          strokeOpacity: 0.8,
          strokeWeight: 4,
          map,
        });
      }
    }
  }, [position, pathCoords]);

  if (!isLoaded) {
    return (
      <div className="size-full flex items-center justify-center bg-[#1a1a1a]">
        <div className="text-white text-center">
          <p className="text-lg mb-2">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full relative">
      <div ref={mapContainerRef} className="size-full" />
      
      <div className="absolute top-8 left-8 bg-[#2a2a2a] rounded-lg px-4 py-3 border border-[#3a3a3a] font-mono z-[1000]">
        <div className="text-white text-sm">
          {position ? 'Current Location' : 'Getting location...'}
        </div>
        <div className="text-[#999] text-xs mt-1">
          {position ? (
            `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`
          ) : error ? (
            error
          ) : (
            'Please allow location access'
          )}
        </div>
      </div>
    </div>
  );
}
