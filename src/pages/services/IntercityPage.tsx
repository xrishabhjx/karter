// Intercity delivery service page component
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Truck, CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

/**
 * IntercityPage - Long-distance delivery service page
 * Features:
 * - Service options
 * - Coverage areas
 * - Pricing details
 * - City network display
 */
const IntercityPage: React.FC = () => {
  // Key features of intercity service
  const features = [
    {
      icon: <Calendar className="h-6 w-6 text-primary" />,
      title: 'Plan Ahead',
      description: 'Schedule deliveries up to 30 days in advance for better planning.',
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: 'Time Flexibility',
      description: 'Choose specific time slots that work best for you and your recipients.',
    },
    {
      icon: <Truck className="h-6 w-6 text-primary" />,
      title: 'Multiple Vehicle Options',
      description: 'Select from cars, vans, and trucks based on your package size.',
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: 'Guaranteed Delivery',
      description: 'We guarantee delivery within your selected time slot or your money back.',
    },
  ];

  // List of cities where service is available
  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
    'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
    'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara',
    'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad',
    'Meerut', 'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad',
    'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi'
  ];

  return (
    <div className="min-h-screen bg-background-light">
      {/* Hero Section */}
      <div className="bg-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">Intercity Logistics</h1>
              <p className="text-xl text-gray-200 mb-8">
                Reliable and efficient delivery services between cities and metropolitan areas. Connect businesses and individuals across the country with our intercity logistics solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/book">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    icon={<Truck className="h-5 w-5" />}
                  >
                    Book Intercity Delivery
                  </Button>
                </Link>
                <Link to="/track">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white text-white hover:bg-white hover:text-secondary"
                  >
                    Track Shipment
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Intercity logistics"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Service Options */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">Choose Your Service</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Select the service level that meets your needs and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Express Intercity Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-secondary to-secondary-dark text-white overflow-hidden">
                <div className="h-48 relative">
                  <img
                    src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                    alt="Express Delivery"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-secondary font-bold px-4 py-2 rounded-full">
                    Premium
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4">Express Intercity</h3>
                  <p className="text-gray-200 mb-6">
                    Our fastest intercity service with priority handling and expedited transport.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Same-day or next-day delivery</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Priority loading and unloading</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Real-time tracking with detailed updates</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Insurance up to ₹50,000 included</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 p-4 rounded-md backdrop-blur-sm mb-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-200">Starting from</p>
                      <p className="text-4xl font-bold">₹2,499</p>
                      <p className="text-sm text-gray-200">per delivery</p>
                    </div>
                  </div>
                  
                  <Link to="/book">
                    <Button variant="primary" fullWidth>
                      Book Express Delivery
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>

            {/* Standard Intercity Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-2 border-secondary overflow-hidden">
                <div className="h-48 relative">
                  <img
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                    alt="Standard Delivery"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-secondary text-white font-bold px-4 py-2 rounded-full">
                    Standard
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-secondary mb-4">Standard Intercity</h3>
                  <p className="text-gray-600 mb-6">
                    Cost-effective intercity delivery with reliable service and flexible scheduling.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">1-2 day delivery timeframe</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">Scheduled pickup and delivery</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">Standard tracking updates</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">Insurance up to ₹25,000 included</span>
                    </div>
                  </div>
                  
                  <div className="bg-secondary/5 p-4 rounded-md mb-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Starting from</p>
                      <p className="text-4xl font-bold text-secondary">₹1,499</p>
                      <p className="text-sm text-gray-600">per delivery</p>
                    </div>
                  </div>
                  
                  <Link to="/book">
                    <Button variant="secondary" fullWidth>
                      Book Standard Delivery
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-background-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">Key Features</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our intercity logistics service offers reliable and flexible options for your cross-city shipping needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="h-full">
                <div className="p-3 bg-primary/20 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-secondary mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Coverage Area */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">Coverage Area</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We currently serve 35+ major cities across India, with new locations being added regularly.
            </p>
          </div>

          <Card>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cities.map((city, index) => (
                <motion.div
                  key={city}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center p-3 bg-primary/10 rounded-lg"
                >
                  <MapPin className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span className="text-gray-700 text-sm font-medium">{city}</span>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 bg-primary/10 p-4 rounded-md">
              <p className="text-gray-700 flex items-start">
                <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                <span>Don't see your city? Contact us to check availability or request service in your area.</span>
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Ship Between Cities?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Book your first intercity delivery today and experience the convenience of our nationwide logistics network.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/book">
              <Button 
                variant="primary" 
                size="lg" 
                icon={<Truck className="h-5 w-5" />}
              >
                Book Intercity Delivery
              </Button>
            </Link>
            <Link to="/register">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-secondary"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntercityPage;