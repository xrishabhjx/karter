// SOS (Emergency) Delivery service page component
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Shield, MapPin, Phone, CheckCircle, AlertTriangle, Truck, Package } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

/**
 * SOSDeliveryPage - Emergency delivery service page
 * Features:
 * - Urgent delivery options
 * - Priority handling
 * - Express service details
 * - Use cases
 */
const SOSDeliveryPage: React.FC = () => {
  // Key features of SOS delivery
  const features = [
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: '45-Minute Delivery',
      description: 'Lightning-fast delivery within 10 km radius for your urgent needs'
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: 'Priority Handling',
      description: 'Your package gets top priority with dedicated delivery partners'
    },
    {
      icon: <Truck className="h-6 w-6 text-primary" />,
      title: 'Instant Matching',
      description: 'Immediate assignment of nearest available delivery partner'
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for your urgent deliveries'
    }
  ];

  // Common use cases for SOS delivery
  const useCases = [
    {
      title: 'Medical Supplies',
      description: 'Emergency delivery of medicines and medical supplies',
      image: 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Important Documents',
      description: 'Time-sensitive documents and legal papers',
      image: 'https://images.unsplash.com/photo-1568219656418-15c329312bf1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Forgotten Items',
      description: 'Quick retrieval of forgotten items from home or office',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-background-light">
      {/* Hero Section */}
      <div className="bg-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-bold mb-4">SOS Delivery Service</h1>
                <p className="text-xl text-gray-200 mb-8">
                  Need something delivered urgently? Get lightning-fast delivery within 45 minutes in a 10 km radius. Available 24/7 for your emergency delivery needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/book">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      icon={<Package className="h-5 w-5" />}
                    >
                      Book SOS Delivery
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-white text-white hover:bg-white hover:text-secondary"
                      icon={<Phone className="h-5 w-5" />}
                    >
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
            <div className="hidden lg:block">
              <motion.img
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="SOS Delivery"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">Why Choose SOS Delivery</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              When every minute counts, trust our SOS delivery service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="p-3 bg-primary/20 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-background-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">How SOS Delivery Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Get your urgent deliveries in just a few simple steps
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary/30 -translate-y-1/2 z-0" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: 1,
                  title: 'Book',
                  description: 'Enter pickup and drop-off locations',
                  icon: <MapPin className="h-6 w-6 text-white" />
                },
                {
                  step: 2,
                  title: 'Match',
                  description: 'Get instantly matched with a nearby partner',
                  icon: <Truck className="h-6 w-6 text-white" />
                },
                {
                  step: 3,
                  title: 'Track',
                  description: 'Real-time tracking of your delivery',
                  icon: <Package className="h-6 w-6 text-white" />
                },
                {
                  step: 4,
                  title: 'Deliver',
                  description: 'Delivery within 45 minutes',
                  icon: <CheckCircle className="h-6 w-6 text-white" />
                }
              ].map((step) => (
                <div key={step.step} className="relative z-10 flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary text-white mb-4 relative">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">Perfect For</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Common scenarios where our SOS delivery service comes in handy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={useCase.image}
                      alt={useCase.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-secondary mb-2">{useCase.title}</h3>
                    <p className="text-gray-600">{useCase.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="py-16 bg-background-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-primary mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-secondary mb-4">Important Information</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>Service available within 10 km radius only</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>45-minute delivery guarantee applies to normal traffic conditions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>Additional charges may apply for priority handling</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>24/7 service availability in selected areas</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Need Something Delivered Fast?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Don't wait! Get your urgent deliveries handled within 45 minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/book">
              <Button 
                variant="primary" 
                size="lg" 
                icon={<Package className="h-5 w-5" />}
              >
                Book SOS Delivery
              </Button>
            </Link>
            <Link to="/track">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-secondary"
              >
                Track Delivery
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOSDeliveryPage;