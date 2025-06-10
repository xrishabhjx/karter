// Pickup Points section showcasing available locations
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Store, Building } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

/**
 * PickupPointsSection - Component displaying pickup point information
 * Features:
 * - Location availability check
 * - Partner registration CTA
 * - Service type indicators
 */
const PickupPointsSection: React.FC = () => {

  return (
    <section className="py-16 bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <MapPin className="h-8 w-8 text-secondary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-secondary mb-4">
            Check Pickup & Drop Points Availability
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Find our verified pickup and drop locations for easy package handling. Choose from our network of authorized stores and dedicated Karter facilities.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <div className="flex items-center">
              <Store className="h-5 w-5 text-primary mr-2" />
              <span className="text-gray-600">Authorized Stores</span>
            </div>
            <div className="flex items-center">
              <Building className="h-5 w-5 text-primary mr-2" />
              <span className="text-gray-600">Karter Facilities</span>
            </div>
          </div>
          <Link to="/pickup-points">
            <Button variant="secondary" size="lg">
              View All Locations
            </Button>
          </Link>
        </Card>
      </div>
    </section>
  );
};

export default PickupPointsSection;