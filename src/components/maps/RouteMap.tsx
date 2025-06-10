// Route map component for displaying delivery routes
import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { MapPin, Truck } from 'lucide-react';

// Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyBhDgRLxRlCWsRkGlpDN9lMWXfZZWzGWEY';

// Default map container styling
const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

/**
 * Location interface defining the structure of location data
 * @property {number} lat - Latitude
 * @property {number} lng - Longitude
 * @property {string} address - Optional address string
 */
interface Location {
  lat: number;
  lng: number;
  address?: string;
}

/**
 * Props interface for RouteMap
 * @property {Location} pickup - Pickup location
 * @property {Location} dropoff - Drop-off location
 * @property {Location} currentLocation - Current location (optional)
 * @property {string} height - Map height
 * @property {boolean} showInfo - Whether to show route information
 */
interface RouteMapProps {
  pickup: Location;
  dropoff: Location;
  currentLocation?: Location;
  height?: string;
  showInfo?: boolean;
}

/**
 * RouteMap - A component for displaying delivery routes with directions
 * Features:
 * - Shows pickup and drop-off locations
 * - Displays route between locations
 * - Optional current location marker
 * - Route distance and duration information
 * - Customizable height
 */
const RouteMap: React.FC<RouteMapProps> = ({
  pickup,
  dropoff,
  currentLocation,
  height = '400px',
  showInfo = true,
}) => {
  // Initialize Google Maps
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  // Component state
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');

  // Calculate route when locations change
  useEffect(() => {
    if (isLoaded && pickup && dropoff) {
      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: { lat: pickup.lat, lng: pickup.lng },
          destination: { lat: dropoff.lat, lng: dropoff.lng },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
            
            // Extract distance and duration
            const route = result.routes[0];
            if (route && route.legs && route.legs[0]) {
              setDistance(route.legs[0].distance?.text || '');
              setDuration(route.legs[0].duration?.text || '');
            }
          } else {
            console.error(`Directions request failed: ${status}`);
          }
        }
      );
    }
  }, [isLoaded, pickup, dropoff]);

  // Map load handler
  const onLoad = React.useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  // Map unmount handler
  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

  // Error and loading states
  if (loadError) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Map container */}
      <div className="rounded-lg overflow-hidden shadow-md" style={{ height }}>
        <GoogleMap
          mapContainerStyle={{ ...mapContainerStyle, height }}
          center={{ lat: (pickup.lat + dropoff.lat) / 2, lng: (pickup.lng + dropoff.lng) / 2 }}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            zoomControl: true,
          }}
        >
          {/* Pickup marker */}
          <Marker
            position={{ lat: pickup.lat, lng: pickup.lng }}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
              scaledSize: new google.maps.Size(40, 40),
            }}
          />
          
          {/* Dropoff marker */}
          <Marker
            position={{ lat: dropoff.lat, lng: dropoff.lng }}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new google.maps.Size(40, 40),
            }}
          />
          
          {/* Current location marker (if provided) */}
          {currentLocation && (
            <Marker
              position={{ lat: currentLocation.lat, lng: currentLocation.lng }}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new google.maps.Size(40, 40),
              }}
            />
          )}
          
          {/* Route directions */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: '#FFCC00',
                  strokeWeight: 5,
                },
              }}
            />
          )}
        </GoogleMap>
      </div>
      
      {/* Route information */}
      {showInfo && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-100 p-3 rounded-md">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Pickup Location</p>
                <p className="text-gray-700">{pickup.address || 'Pickup point'}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-100 p-3 rounded-md">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Drop-off Location</p>
                <p className="text-gray-700">{dropoff.address || 'Drop-off point'}</p>
              </div>
            </div>
          </div>
          
          {distance && duration && (
            <div className="bg-primary/10 p-3 rounded-md md:col-span-2">
              <div className="flex items-start">
                <Truck className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Trip Details</p>
                  <p className="text-gray-700">
                    Distance: <span className="font-medium">{distance}</span> • 
                    Estimated Time: <span className="font-medium">{duration}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RouteMap;