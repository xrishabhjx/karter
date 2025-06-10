// Features section component showcasing key platform capabilities
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, DollarSign, Shield, Truck, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../common/Card';

/**
 * Props interface for individual feature items
 * @property {React.ReactNode} icon - Feature icon
 * @property {string} title - Feature title
 * @property {string} description - Feature description
 * @property {string} link - Navigation link
 */
interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

/**
 * Feature - Individual feature card component
 * Displays a single platform feature with icon, title, and description
 */
const Feature: React.FC<FeatureProps> = ({ icon, title, description, link }) => {
  return (
    <Link to={link}>
      <Card className="flex flex-col items-center text-center p-6 h-full hover:bg-primary/5" hoverable>
        <motion.div 
          className="p-3 bg-primary/20 rounded-full mb-4"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-semibold text-secondary mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </Card>
    </Link>
  );
};

/**
 * Features - Main features section component
 * Displays a grid of key platform features with animations
 */
const Features: React.FC = () => {
  // Feature items configuration
  const features = [
    {
      icon: <Clock className="h-6 w-6 text-secondary" />,
      title: 'Fast Delivery',
      description: 'Get anything delivered in 45 minutes within 10 km radius.',
      link: '/services/instant-delivery'
    },
    {
      icon: <DollarSign className="h-6 w-6 text-secondary" />,
      title: 'Affordable Pricing',
      description: 'Transparent pricing with no hidden charges. Pay only for what you need.',
      link: '/services/custom-bidding'
    },
    {
      icon: <Shield className="h-6 w-6 text-secondary" />,
      title: 'Verified Partners',
      description: 'All our delivery partners are verified and trained to ensure safe and secure deliveries.',
      link: '/partner/register'
    },
    {
      icon: <Truck className="h-6 w-6 text-secondary" />,
      title: 'Multiple Vehicle Options',
      description: 'Choose from bikes, cars, or mini trucks based on your package size.',
      link: '/services/vehicles'
    },
    {
      icon: <MapPin className="h-6 w-6 text-secondary" />,
      title: 'Real-time Tracking',
      description: 'Track your shipment in real-time and get live updates on delivery status.',
      link: '/track'
    },
    {
      icon: <Calendar className="h-6 w-6 text-secondary" />,
      title: 'Interstate Delivery',
      description: 'Reliable delivery services between cities with our intercity logistics network.',
      link: '/services/intercity'
    },
  ];

  return (
    <section className="py-16 bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-secondary">Why Choose KARTER?</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            We offer a comprehensive logistics solution designed to make your deliveries faster, safer, and more affordable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Feature
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                link={feature.link}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;