// Location picker component with map integration
import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import GoogleMapComponent from './GoogleMapComponent';
import Button from '../common/Button';

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
 * Props interface for LocationPicker
 * @property {Function} onLocationSelect - Callback when location is selected
 * @property {Location} initialLocation - Initial location to display
 * @property {string} buttonText - Custom button text
 * @property {string} title - Custom title
 */
interface LocationPickerProps {
  onLocationSelect: (location: Location) => void;
  initialLocation?: Location;
  buttonText?: string;
  title?: string;
}

/**
 * LocationPicker - A component for selecting locations using Google Maps
 * Features:
 * - Interactive map for location selection
 * - Display selected location details
 * - Customizable button text and title
 * - Initial location support
 */
const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLocation,
  buttonText = 'Confirm Location',
  title = 'Select Location',
}) => {
  // Track selected location
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    initialLocation || null
  );

  // Handle location selection from map
  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  // Handle confirm button click
  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-secondary mb-4">{title}</h3>
      
      {/* Map component */}
      <GoogleMapComponent
        onLocationSelect={handleLocationSelect}
        initialCenter={initialLocation ?? { lat: 0, lng: 0 }}
        height="300px"
        zoom={13}
      />
      
      {/* Selected location display */}
      {selectedLocation?.address && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Selected Location</p>
              <p className="text-gray-700">{selectedLocation.address}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirmation button */}
      <div className="mt-4">
        <Button
          variant="secondary"
          fullWidth
          disabled={!selectedLocation}
          onClick={handleConfirm}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default LocationPicker;