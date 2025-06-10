// Instant Delivery service page component
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Truck, CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

/**
 * InstantDeliveryPage - Quick delivery service page
 * Features:
 * - Service description
 * - Delivery process
 * - Pricing details
 * - FAQs
 */
const InstantDeliveryPage: React.FC = () => {
  // Key features of instant delivery service
  const features = [
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: 'Quick Matching',
      description: 'Get matched with a delivery partner within minutes of placing your order.',
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: 'Real-time Tracking',
      description: 'Track your delivery in real-time from pickup to drop-off.',
    },
    {
      icon: <Truck className="h-6 w-6 text-primary" />,
      title: 'Multiple Vehicle Options',
      description: 'Choose from bikes, cars, or mini trucks based on your package size.',
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: 'Secure Deliveries',
      description: 'All packages are handled with care and delivered securely.',
    },
  ];

  // Vehicle types and pricing plans
  const plans = [
    {
      vehicle: 'Two-Wheeler',
      icon: <Truck className="h-8 w-8 text-secondary" />,
      basePrice: '49',
      perKm: '10',
      capacity: 'Up to 5kg',
      idealFor: ['Documents', 'Food delivery', 'Small packages'],
    },
    {
      vehicle: 'Car/Auto',
      icon: <Truck className="h-8 w-8 text-secondary" />,
      basePrice: '99',
      perKm: '15',
      capacity: 'Up to 50kg',
      idealFor: ['Groceries', 'Multiple packages', 'Medium-sized items'],
      featured: true,
    },
    {
      vehicle: 'Mini Truck',
      icon: <Truck className="h-8 w-8 text-secondary" />,
      basePrice: '199',
      perKm: '25',
      capacity: 'Up to 500kg',
      idealFor: ['Furniture', 'Appliances', 'Bulk orders'],
    },
  ];

  // Frequently asked questions
  const faqs = [
    {
      question: 'How quickly can I expect my package to be delivered?',
      answer: 'Delivery times vary based on distance and traffic conditions, but most instant deliveries are completed within 1-3 hours of booking.',
    },
    {
      question: 'What is the maximum weight for instant delivery?',
      answer: 'The weight limit depends on the vehicle type you select. Bikes can carry up to 5kg, cars up to 50kg, and mini trucks up to 500kg.',
    },
    {
      question: 'Can I send multiple packages to different locations?',
      answer: 'Currently, each instant delivery booking is for a single route from one pickup location to one drop-off location. For multiple destinations, you\'ll need to create separate bookings.',
    },
    {
      question: 'What happens if no delivery partner is available?',
      answer: 'In rare cases when no delivery partners are available, you\'ll be notified immediately and can choose to wait or cancel your booking without any charges.',
    },
  ];

  return (
    <div className="min-h-screen bg-background-light">
      {/* Hero Section */}
      <div className="bg-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">Instant Delivery</h1>
              <p className="text-xl text-gray-200 mb-8">
                Need something delivered right away? Our instant delivery service connects you with nearby delivery partners who can pick up and deliver your package within hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/book">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    icon={<Clock className="h-5 w-5" />}
                  >
                    Book Now
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
                src="https://images.unsplash.com/photo-1601628828688-632f38a5a7d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Instant delivery"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">How Instant Delivery Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Get your packages delivered in just a few simple steps.
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary/30 -translate-y-1/2 z-0" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: 1,
                  title: 'Book',
                  description: 'Enter pickup and drop-off locations, package details, and select a vehicle type.',
                },
                {
                  step: 2,
                  title: 'Match',
                  description: 'We\'ll match you with the nearest available delivery partner.',
                },
                {
                  step: 3,
                  title: 'Track',
                  description: 'Track your delivery in real-time through the entire journey.',
                },
                {
                  step: 4,
                  title: 'Receive',
                  description: 'Your package is delivered to the destination quickly and securely.',
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

      {/* Features */}
      <div className="py-16 bg-background-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">Key Features</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our instant delivery service is designed to be fast, reliable, and convenient.
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

      {/* Pricing */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">Pricing</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Transparent pricing with no hidden charges. Pay only for what you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`h-full flex flex-col ${plan.featured ? 'border-2 border-primary shadow-lg' : ''}`}
              >
                {plan.featured && (
                  <div className="bg-primary text-secondary text-center py-1 font-medium">
                    Most Popular
                  </div>
                )}
                <div className={`p-6 flex flex-col h-full ${plan.featured ? 'pt-4' : ''}`}>
                  <div className="p-3 bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-2">{plan.vehicle}</h3>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-secondary">₹{plan.basePrice}</span>
                    <span className="text-gray-600"> base price</span>
                    <p className="text-gray-600">+ ₹{plan.perKm} per kilometer</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-medium text-secondary">Capacity: {plan.capacity}</p>
                  </div>
                  
                  <div className="mb-6">
                    <p className="font-medium text-secondary mb-2">Ideal for:</p>
                    <ul className="list-disc list-inside text-gray-600">
                      {plan.idealFor.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-auto">
                    <Link to="/book">
                      <Button 
                        variant={plan.featured ? "secondary" : "outline"} 
                        fullWidth
                      >
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 text-center text-gray-600">
            <p>* Prices may vary based on demand, time of day, and special requirements.</p>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="py-16 bg-background-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">Frequently Asked Questions</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our instant delivery service.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <h3 className="text-lg font-semibold text-secondary mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Experience the convenience of instant delivery with Karter. Book your first delivery today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/book">
              <Button 
                variant="primary" 
                size="lg" 
                icon={<Clock className="h-5 w-5" />}
              >
                Book Instant Delivery
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

export default InstantDeliveryPage;