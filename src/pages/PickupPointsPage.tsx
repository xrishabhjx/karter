import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Building, MapPin, Star, Shield, Clock, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const PickupPointsPage: React.FC = () => {
  const pickupPoints = [
    {
      id: '1',
      name: 'Central Store',
      type: 'store',
      address: 'Shop 123, Main Market, Sector 18, Noida',
      workingHours: '9:00 AM - 9:00 PM',
      rating: 4.8,
      totalOrders: 1250,
      amenities: ['24/7 Security', 'CCTV', 'Parking Available'],
      image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '2',
      name: 'Karter Hub',
      type: 'facility',
      address: 'Warehouse 7, Industrial Area Phase 2, Noida',
      workingHours: '8:00 AM - 10:00 PM',
      rating: 4.9,
      totalOrders: 3500,
      amenities: ['Loading Dock', 'Cold Storage', '24/7 Operations', 'Forklift'],
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '3',
      name: 'Express Point',
      type: 'store',
      address: 'Shop 45, Connaught Place, New Delhi',
      workingHours: '10:00 AM - 8:00 PM',
      rating: 4.7,
      totalOrders: 980,
      amenities: ['Express Pickup', 'Digital Lockers', 'Secure Storage'],
      image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ];

  const benefits = [
    {
      title: 'Additional Revenue',
      description: 'Earn commission on every package handled through your location'
    },
    {
      title: 'Increased Footfall',
      description: 'Get more customers visiting your store for pickups and drops'
    },
    {
      title: 'Zero Investment',
      description: 'No setup costs or infrastructure investment required'
    },
    {
      title: 'Easy Integration',
      description: 'Simple process to start accepting packages within 24 hours'
    }
  ];

  return (
    <div className="min-h-screen bg-background-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-secondary hover:text-primary">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Home
          </Link>
          
          <h1 className="text-3xl font-bold text-secondary mt-4">Pickup & Drop Points</h1>
          <p className="text-gray-600">
            Find convenient pickup and drop-off locations near you
          </p>
        </div>

        {/* Partner CTA */}
        <Card className="mb-12 bg-gradient-to-r from-secondary to-secondary-dark text-white p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Become a Pickup Point Partner</h2>
              <p className="text-gray-200 mb-6">
                Join our network of pickup points and grow your business. Perfect for retail stores, shops, and commercial spaces.
              </p>
              <Link to="/pickup-points/register">
                <Button 
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="h-5 w-5" />}
                >
                  Partner with Us
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <h3 className="font-semibold text-primary mb-2">{benefit.title}</h3>
                  <p className="text-gray-200 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Pickup Points List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pickupPoints.map((point, index) => (
            <motion.div
              key={point.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <div className="h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={point.image}
                    alt={point.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {point.type === 'store' ? (
                        <Store className="h-5 w-5 text-primary mr-2" />
                      ) : (
                        <Building className="h-5 w-5 text-primary mr-2" />
                      )}
                      <h3 className="font-semibold text-secondary">{point.name}</h3>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm">{point.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0 mt-1" />
                      <span className="text-sm">{point.address}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">{point.workingHours}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Shield className="h-4 w-4 mr-2" />
                      <span className="text-sm">{point.totalOrders}+ deliveries</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {point.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-secondary rounded-md text-xs"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4">
                    <Button variant="secondary" fullWidth>
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Requirements Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-secondary mb-8 text-center">Partner Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Location',
                description: 'Commercial space in a high-footfall area with easy accessibility',
                icon: <MapPin className="h-6 w-6 text-primary" />
              },
              {
                title: 'Business Hours',
                description: 'Regular business hours (minimum 8 hours per day)',
                icon: <Clock className="h-6 w-6 text-primary" />
              },
              {
                title: 'Storage Space',
                description: 'Dedicated secure space for package storage',
                icon: <Building className="h-6 w-6 text-primary" />
              }
            ].map((req, index) => (
              <Card key={index} className="text-center p-6">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {req.icon}
                </div>
                <h3 className="font-semibold text-secondary mb-2">{req.title}</h3>
                <p className="text-gray-600 text-sm">{req.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupPointsPage;