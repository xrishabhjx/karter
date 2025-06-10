import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Target, TruckIcon, Star, Package, MapPin, Clock } from 'lucide-react';
import Card from '../components/common/Card';

const AboutPage: React.FC = () => {
  const stats = [
    { label: 'Cities Covered', value: '35+' },
    { label: 'Happy Customers', value: '10K+' },
    { label: 'Delivery Partners', value: '1000+' },
    { label: 'Daily Deliveries', value: '500+' }
  ];

  const values = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Trust & Reliability',
      description: 'Building lasting relationships through consistent, dependable service.'
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Customer First',
      description: 'Your satisfaction is our top priority in everything we do.'
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: 'Innovation',
      description: 'Continuously improving our technology and services.'
    }
  ];

  const team = [
    {
      name: 'Rahul Kumar',
      role: 'Chief Executive Officer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Priya Sharma',
      role: 'Chief Operations Officer',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Amit Patel',
      role: 'Chief Technology Officer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
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
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Redefining Logistics
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-200 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                At Karter, we are redefining transportation and logistics with a seamless, tech-driven approach. Whether you need intracity, intercity, or interstate transport, we connect businesses and individuals with reliable, cost-effective, and efficient logistics solutions.
              </motion.p>
            </div>
            <motion.div 
              className="hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="KARTER Logistics"
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-4xl mx-auto">
            <p className="text-gray-600 mb-8">
              Our platform ensures that every shipment is handled with speed, transparency, and reliability. We eliminate inefficiencies in traditional logistics by leveraging smart route optimization, real-time tracking, and a dynamic pricing model that benefits both shippers and transport providers.
            </p>
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-bold text-secondary text-center mb-8">Why Choose Karter?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Clock className="h-8 w-8 text-primary" />,
                  title: 'On-Demand & Scheduled',
                  description: 'Flexible options tailored to your needs'
                },
                {
                  icon: <Package className="h-8 w-8 text-primary" />,
                  title: 'Affordable & Transparent',
                  description: 'No hidden fees, just competitive rates'
                },
                {
                  icon: <MapPin className="h-8 w-8 text-primary" />,
                  title: 'Live Tracking',
                  description: 'Know where your shipment is at all times'
                },
                {
                  icon: <Shield className="h-8 w-8 text-primary" />,
                  title: 'Trusted Network',
                  description: 'Verified drivers and reliable service'
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

      {/* Mission Statement */}
      <div className="py-16 bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-gray-200 mb-8">
              At Karter, we believe logistics should be simple, efficient, and hassle-free. Whether you're moving goods across the city or across states, we've got you covered.
            </p>
            <p className="text-2xl font-bold text-primary">
              🚀 Join the future of logistics with Karter today!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;