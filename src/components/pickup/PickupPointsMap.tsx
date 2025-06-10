import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Store, Building, Navigation, Star, Phone, Clock, CheckCircle } from 'lucide-react';
import usePickupPointsStore from '../../store/usePickupPointsStore';
import Button from '../common/Button';
import Card from '../common/Card';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || 'AIzaSyAD0ROticpVAUup7dxlKPrYKPMiu96HwSk';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090,
};

const PickupPointsMap: React.FC = () => {
  const { points, selectedPoint, setSelectedPoint } = usePickupPointsStore();
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

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
    <div className="relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
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
        {points.map((point) => (
          <Marker
            key={point.id}
            position={point.coordinates}
            icon={{
              url: point.type === 'store' 
                ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new google.maps.Size(40, 40),
            }}
            onClick={() => setSelectedPoint(point)}
          />
        ))}

        {selectedPoint && (
          <InfoWindow
            position={selectedPoint.coordinates}
            onCloseClick={() => setSelectedPoint(null)}
          >
            <Card className="min-w-[300px]">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  {selectedPoint.type === 'store' ? (
                    <Store className="h-5 w-5 text-primary mr-2" />
                  ) : (
                    <Building className="h-5 w-5 text-primary mr-2" />
                  )}
                  <h3 className="font-medium text-secondary">{selectedPoint.name}</h3>
                </div>
                {selectedPoint.isVerified && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>

              <div className="mt-2 space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Navigation className="h-4 w-4 mr-2" />
                  <span>{selectedPoint.address}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    {selectedPoint.workingHours.open} - {selectedPoint.workingHours.close}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{selectedPoint.contactInfo.phone}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Star className="h-4 w-4 mr-2 text-yellow-400 fill-current" />
                  <span>{selectedPoint.rating} • {selectedPoint.totalOrders} orders</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {selectedPoint.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-secondary rounded-md text-xs"
                  >
                    {amenity}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Current Capacity</p>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ 
                          width: `${(selectedPoint.capacity.current / selectedPoint.capacity.max) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="ml-2 text-xs text-gray-600">
                      {selectedPoint.capacity.current}/{selectedPoint.capacity.max}
                    </span>
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  Select Point
                </Button>
              </div>
            </Card>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default PickupPointsMap;