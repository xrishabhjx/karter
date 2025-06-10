// Movers and Packers service page component
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Truck, Package, Shield, Clock, CheckCircle, MapPin, Phone, Calendar } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

/**
 * MoversAndPackersPage - Relocation services page
 * Features:
 * - Service types (home/office)
 * - Process explanation
 * - Storage solutions
 * - Professional team details
 */
const MoversAndPackersPage: React.FC = () => {
  // Available services configuration
  const services = [
    {
      title: 'Home Relocation',
      description: 'Complete packing and moving services for your entire home',
      icon: <Box className="h-6 w-6 text-primary" />,
      features: [
        'Professional packing of all items',
        'Safe loading and unloading',
        'Furniture disassembly and assembly',
        'Dedicated moving truck',
        'Insurance coverage'
      ],
      image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Office Relocation',
      description: 'Specialized services for office and commercial moves',
      icon: <Truck className="h-6 w-6 text-primary" />,
      features: [
        'Minimal business disruption',
        'IT equipment handling',
        'Furniture installation',
        'Weekend moving options',
        'Project management'
      ],
      image: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Storage Solutions',
      description: 'Secure storage facilities for short and long-term needs',
      icon: <Package className="h-6 w-6 text-primary" />,
      features: [
        'Climate-controlled units',
        '24/7 security',
        'Flexible duration',
        'Easy access',
        'Inventory management'
      ],
      image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ];

  // Key features of moving service
  const features = [
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: 'Professional Team',
      description: 'Trained and verified moving professionals'
    },
    {
      icon: <Box className="h-6 w-6 text-primary" />,
      title: 'Quality Packing',
      description: 'High-quality packing materials and techniques'
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: 'Timely Service',
      description: 'On-time pickup and delivery guaranteed'
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: 'Insurance Coverage',
      description: 'Full insurance coverage for your belongings'
    }
  ];

  return (
    <div className="min-h-screen bg-background-light">
      {/* Hero Section */}
      <div className="bg-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">Professional Movers & Packers</h1>
              <p className="text-xl text-gray-200 mb-8">
                Expert moving and packing services for homes and offices. We handle your belongings with care and ensure a smooth relocation experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/book">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    icon={<Calendar className="h-5 w-5" />}
                  >
                    Schedule Move
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white text-white hover:bg-white hover:text-secondary"
                  >
                    Get Quote
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1600518464441-9154a4dea21b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Moving services"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">Our Moving Services</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive moving solutions tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-primary/20 rounded-full">
                        {service.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-secondary ml-3">{service.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-background-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">Why Choose Us</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Experience hassle-free moving with our professional services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to your hassle-free move
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary/30 -translate-y-1/2 z-0" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: 1,
                  title: 'Book Survey',
                  description: 'Schedule a free pre-move survey',
                },
                {
                  step: 2,
                  title: 'Get Quote',
                  description: 'Receive detailed cost estimate',
                },
                {
                  step: 3,
                  title: 'Schedule Move',
                  description: 'Pick your preferred moving date',
                },
                {
                  step: 4,
                  title: 'Move Day',
                  description: 'Professional packing and moving',
                },
              ].map((step) => (
                <div key={step.step} className="relative z-10 flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary text-white mb-4 relative">
                    <span className="text-xl font-bold">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Move?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Get a free quote for your move and experience our professional service
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/book">
              <Button 
                variant="primary" 
                size="lg" 
                icon={<Calendar className="h-5 w-5" />}
              >
                Schedule Move
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-secondary"
                icon={<Phone className="h-5 w-5" />}
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoversAndPackersPage;