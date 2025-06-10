import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft } from 'lucide-react';

const LocationsPage: React.FC = () => {
  const locations = [
    {
      city: 'Delhi NCR',
      locations: 25,
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      city: 'Kanpur',
      image: 'https://images.unsplash.com/photo-1627894006066-b45b63f3a950?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      city: 'Bangalore',
      locations: 30,
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      city: 'Mumbai',
      locations: 28,
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
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
          
          <h1 className="text-3xl font-bold text-secondary mt-4">Our Service Locations</h1>
          <p className="text-gray-600">
            Find KARTER services in these major cities across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {locations.map((location, index) => (
            <motion.div
              key={location.city}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={location.image}
                  alt={location.city}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-secondary mb-2">{location.city}</h3>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 text-primary mr-2" />
                  <span>{location.locations} Pickup Points</span>
                </div>
                <p className="text-gray-600">
                  Full service available with instant delivery, scheduled pickups, and intercity shipping.
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationsPage;