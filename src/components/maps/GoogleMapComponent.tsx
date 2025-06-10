// Google Maps component for interactive location selection and display
import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import { MapPin, Search } from 'lucide-react';

// Get Google Maps API key from environment variables
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || 'AIzaSyAD0ROticpVAUup7dxlKPrYKPMiu96HwSk';

// Default map container styling
const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

// Default center coordinates (Delhi)
const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090,
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
 * Props interface for GoogleMapComponent
 * @property {Function} onLocationSelect - Callback when location is selected
 * @property {boolean} showSearchBox - Whether to show search box
 * @property {Location[]} markers - Array of markers to display
 * @property {Object} initialCenter - Initial center coordinates
 * @property {string} height - Map height
 * @property {number} zoom - Map zoom level
 * @property {boolean} draggableMarker - Whether marker is draggable
 */
interface GoogleMapComponentProps {
  onLocationSelect?: (location: Location) => void;
  showSearchBox?: boolean;
  markers?: Location[];
  initialCenter?: { lat: number; lng: number };
  height?: string;
  zoom?: number;
  draggableMarker?: boolean;
}

/**
 * GoogleMapComponent - A reusable map component with location selection
 * Features:
 * - Interactive map with markers
 * - Location search with autocomplete
 * - Reverse geocoding for clicked locations
 * - Customizable height and zoom
 * - Optional draggable markers
 */
const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  onLocationSelect,
  showSearchBox = true,
  markers = [],
  initialCenter = defaultCenter,
  height = '400px',
  zoom = 12,
  draggableMarker = true,
}) => {
  // Initialize Google Maps
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  // Component state
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(initialCenter);
  const [markerPosition, setMarkerPosition] = useState<Location | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Map load handler
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  // Map unmount handler
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Handle marker drag end event
  const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMarkerPosition({ lat, lng });
      
      // Get address from coordinates (reverse geocoding)
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const address = results[0].formatted_address;
          const location = { lat, lng, address };
          setMarkerPosition(location);
          if (onLocationSelect) {
            onLocationSelect(location);
          }
        }
      });
    }
  };

  // Handle map click event
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng && draggableMarker) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      // Get address from coordinates (reverse geocoding)
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const address = results[0].formatted_address;
          const location = { lat, lng, address };
          setMarkerPosition(location);
          if (onLocationSelect) {
            onLocationSelect(location);
          }
        }
      });
    }
  };

  // Handle place selection from autocomplete
  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address;
        
        setCenter({ lat, lng });
        setMarkerPosition({ lat, lng, address });
        
        if (map) {
          map.panTo({ lat, lng });
          map.setZoom(15);
        }
        
        if (onLocationSelect) {
          onLocationSelect({ lat, lng, address });
        }
      }
    }
  };

  // Autocomplete load handler
  const onAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  // Error and loading states
  if (loadError) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
    </div>;
  }

  return (
    <div className="w-full">
      {/* Search box */}
      {showSearchBox && (
        <div className="relative mb-4">
          <Autocomplete
            onLoad={onAutocompleteLoad}
            onPlaceChanged={handlePlaceSelect}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                placeholder="Search for a location"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </Autocomplete>
        </div>
      )}
      
      {/* Map container */}
      <div className="rounded-lg overflow-hidden shadow-md" style={{ height }}>
        <GoogleMap
          mapContainerStyle={{ ...mapContainerStyle, height }}
          center={center}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
          options={{
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            zoomControl: true,
          }}
        >
          {/* User-selected marker */}
          {markerPosition && (
            <Marker
              position={markerPosition}
              draggable={draggableMarker}
              onDragEnd={handleMarkerDragEnd}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new google.maps.Size(40, 40),
              }}
            />
          )}
          
          {/* Additional markers */}
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new google.maps.Size(40, 40),
              }}
            />
          ))}
        </GoogleMap>
      </div>
      
      {/* Selected location address */}
      {markerPosition && markerPosition.address && (
        <div className="mt-2 flex items-start">
          <MapPin className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-gray-700">{markerPosition.address}</p>
        </div>
      )}
    </div>
  );
};

export default GoogleMapComponent;