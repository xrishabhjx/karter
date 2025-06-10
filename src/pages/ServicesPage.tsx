// Main Services overview page component
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Package, Calendar, Building, Truck, MapPin, Shield, Star } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

/**
 * ServicesPage - Main services listing page
 * Features:
 * - Service categories overview
 * - Detailed service descriptions
 * - Interactive service cards
 * - Quick navigation to specific services
 */
const ServicesPage: React.FC = () => {
  // Service configurations with details and routing
  const services = [
    {
      id: 'instant-delivery',
      title: 'Instant Delivery',
      description: 'Get your packages delivered within 45 minutes in a 10 km radius.',
      icon: <Clock className="h-10 w-10 text-primary" />,
      image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      features: [
        'Delivery within 45 minutes',
        'Real-time tracking',
        'Secure handling',
        'Instant partner matching'
      ],
      link: '/services/instant-delivery'
    },
    {
      id: 'scheduled-delivery',
      title: 'Scheduled Delivery',
      description: 'Plan your deliveries in advance with flexible time slots.',
      icon: <Calendar className="h-10 w-10 text-primary" />,
      image: 'https://images.unsplash.com/photo-1484807352052-23338990c6c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      features: [
        'Advance booking',
        'Flexible time slots',
        'Professional handling',
        'Regular updates'
      ],
      link: '/services/scheduled-delivery'
    },
    {
      id: 'intercity',
      title: 'Intercity Services',
      description: 'Reliable delivery services between cities with our intercity logistics network.',
      icon: <Truck className="h-10 w-10 text-primary" />,
      image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      features: [
        'Multiple cities coverage',
        'Express & standard options',
        'Live tracking',
        'Secure transport'
      ],
      link: '/services/intercity'
    },
    {
      id: 'movers-and-packers',
      title: 'Movers & Packers',
      description: 'Professional packing and moving services for homes and offices.',
      icon: <Package className="h-10 w-10 text-primary" />,
      image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      features: [
        'Professional packing',
        'Safe transportation',
        'Insurance coverage',
        'Dedicated team'
      ],
      link: '/services/movers-and-packers'
    },
    {
      id: 'business',
      title: 'Business Solutions',
      description: 'Tailored logistics solutions for businesses of all sizes.',
      icon: <Building className="h-10 w-10 text-primary" />,
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      features: [
        'API integration',
        'Bulk deliveries',
        'Custom pricing',
        'Dedicated support'
      ],
      link: '/services/business'
    },
    {
      id: 'sos-delivery',
      title: 'SOS Delivery',
      description: 'Emergency delivery services for urgent shipments.',
      icon: <Shield className="h-10 w-10 text-primary" />,
      image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      features: [
        'Priority handling',
        'Instant matching',
        '24/7 support',
        'Express delivery'
      ],
      link: '/services/sos-delivery'
    }
  ];

  return (
    <div className="min-h-screen bg-background-light">
      {/* Hero Section */}
      <div className="bg-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h1 
                className="text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Our Services
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-200 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                From instant local deliveries to nationwide logistics solutions, we've got all your delivery needs covered.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link to="/book">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    icon={<Package className="h-5 w-5" />}
                  >
                    Book Now
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white text-white hover:bg-white hover:text-secondary"
                  >
                    Contact Sales
                  </Button>
                </Link>
              </motion.div>
            </div>
            <motion.div 
              className="hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Logistics services"
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={service.link}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <div className="h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-primary/20 rounded-full">
                          {service.icon}
                        </div>
                        <h3 className="text-xl font-bold text-secondary ml-3">
                          {service.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      <div className="space-y-2 mb-6">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-gray-600">
                            <Star className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button variant="secondary" fullWidth>
                        Learn More
                      </Button>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Experience our comprehensive logistics solutions tailored to your needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/book">
              <Button 
                variant="primary" 
                size="lg" 
                icon={<Package className="h-5 w-5" />}
              >
                Book a Service
              </Button>
            </Link>
            <Link to="/partner/register">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-secondary"
              >
                Become a Partner
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-16 bg-background-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">Why Choose KARTER</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We offer comprehensive logistics solutions designed to meet your specific needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8 text-primary" />,
                title: 'Secure Delivery',
                description: 'Your packages are fully insured and handled with utmost care'
              },
              {
                icon: <MapPin className="h-8 w-8 text-primary" />,
                title: 'Wide Coverage',
                description: 'Services available across multiple cities and regions'
              },
              {
                icon: <Star className="h-8 w-8 text-primary" />,
                title: 'Quality Service',
                description: 'Professional delivery partners and 24/7 customer support'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center p-6">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;