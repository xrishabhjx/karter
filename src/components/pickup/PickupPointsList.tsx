import React from 'react';
import { motion } from 'framer-motion';
import { Store, Building, Navigation, Star, Phone, Clock, CheckCircle, Search, Filter } from 'lucide-react';
import usePickupPointsStore from '../../store/usePickupPointsStore';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';

const PickupPointsList: React.FC = () => {
  const { points, filters, setFilters, clearFilters } = usePickupPointsStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search pickup points..."
          icon={<Search className="h-5 w-5 text-gray-400" />}
          value={filters.city}
          onChange={(e) => setFilters({ city: e.target.value })}
        />
        
        <div className="flex gap-2">
          <select
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-primary focus:border-primary"
            value={filters.type}
            onChange={(e) => setFilters({ type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="store">Stores</option>
            <option value="facility">Facilities</option>
          </select>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.isVerified}
              onChange={(e) => setFilters({ isVerified: e.target.checked })}
              className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
            />
            <span className="text-gray-700">Verified Only</span>
          </label>
          
          <Button
            variant="outline"
            onClick={clearFilters}
            icon={<Filter className="h-5 w-5" />}
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {points.map((point, index) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  {point.type === 'store' ? (
                    <Store className="h-5 w-5 text-primary mr-2" />
                  ) : (
                    <Building className="h-5 w-5 text-primary mr-2" />
                  )}
                  <div>
                    <h3 className="font-medium text-secondary">{point.name}</h3>
                    <p className="text-sm text-gray-500">{point.city}</p>
                  </div>
                </div>
                {point.isVerified && (
                  <div className="flex items-center text-green-500">
                    <CheckCircle className="h-5 w-5 mr-1" />
                    <span className="text-xs">Verified</span>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Navigation className="h-4 w-4 mr-2" />
                  <span>{point.address}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    {point.workingHours.open} - {point.workingHours.close}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{point.contactInfo.phone}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Star className="h-4 w-4 mr-2 text-yellow-400 fill-current" />
                  <span>{point.rating} • {point.totalOrders} orders</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {point.amenities.map((amenity, index) => (
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
                          width: `${(point.capacity.current / point.capacity.max) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="ml-2 text-xs text-gray-600">
                      {point.capacity.current}/{point.capacity.max}
                    </span>
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  Select Point
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PickupPointsList;