// Scheduled Delivery service page component
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Truck, CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

/**
 * ScheduledDeliveryPage - Planned delivery service page
 * Features:
 * - Time slot selection
 * - Advance booking options
 * - Service features
 * - Pricing details
 */
const ScheduledDeliveryPage: React.FC = () => {
  // Key features of scheduled delivery
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
      description: 'Select from bikes, cars, or mini trucks based on your package size.',
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: 'Guaranteed Delivery',
      description: 'We guarantee delivery within your selected time slot or your money back.',
    },
  ];

  // Frequently asked questions
  const faqs = [
    {
      question: 'How far in advance can I schedule a delivery?',
      answer: 'You can schedule deliveries up to 30 days in advance. This gives you plenty of time to plan and organize your logistics needs.',
    },
    {
      question: 'Can I reschedule a delivery after booking?',
      answer: 'Yes, you can reschedule a delivery up to 2 hours before the scheduled pickup time without any additional charges.',
    },
    {
      question: 'What happens if I\'m not available at the scheduled time?',
      answer: 'Our delivery partners will wait for up to 10 minutes at the pickup or drop-off location. If you\'re not available, you can reschedule (additional fees may apply) or cancel the delivery.',
    },
    {
      question: 'Are there any additional charges for scheduled deliveries?',
      answer: 'Scheduled deliveries are priced the same as instant deliveries. However, there may be peak hour surcharges depending on your selected time slot.',
    },
  ];

  return (
    <div className="min-h-screen bg-background-light">
      {/* Hero Section */}
      <div className="bg-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">Scheduled Delivery</h1>
              <p className="text-xl text-gray-200 mb-8">
                Plan ahead with our scheduled delivery service. Choose a specific date and time for your package to be picked up and delivered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/book">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    icon={<Calendar className="h-5 w-5" />}
                  >
                    Schedule Now
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
                src="https://images.unsplash.com/photo-1484807352052-23338990c6c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Scheduled delivery"
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
            <h2 className="text-3xl font-bold text-secondary">How Scheduled Delivery Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Plan your deliveries in advance with just a few simple steps.
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
                  title: 'Schedule',
                  description: 'Choose a specific date and time slot for your delivery.',
                },
                {
                  step: 3,
                  title: 'Confirm',
                  description: 'Review your booking details and confirm your scheduled delivery.',
                },
                {
                  step: 4,
                  title: 'Delivery',
                  description: 'A delivery partner will arrive at the scheduled time to pick up your package.',
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
              Our scheduled delivery service offers flexibility and reliability for your logistics needs.
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

      {/* Time Slots */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">Available Time Slots</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from a variety of time slots to fit your schedule.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-secondary mb-4">Morning Slots</h3>
                  <ul className="space-y-3">
                    {['8:00 AM - 10:00 AM', '10:00 AM - 12:00 PM'].map((slot, index) => (
                      <li key={index} className="flex items-center">
                        <Clock className="h-5 w-5 text-primary mr-2" />
                        <span>{slot}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary mb-4">Afternoon Slots</h3>
                  <ul className="space-y-3">
                    {['12:00 PM - 2:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM'].map((slot, index) => (
                      <li key={index} className="flex items-center">
                        <Clock className="h-5 w-5 text-primary mr-2" />
                        <span>{slot}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div>
                  <h3 className="text-xl font-semibold text-secondary mb-4">Evening Slots</h3>
                  <ul className="space-y-3">
                    {['6:00 PM - 8:00 PM', '8:00 PM - 10:00 PM'].map((slot, index) => (
                      <li key={index} className="flex items-center">
                        <Clock className="h-5 w-5 text-primary mr-2" />
                        <span>{slot}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-6 bg-primary/10 p-4 rounded-md">
                <p className="text-gray-700 flex items-start">
                  <AlertTriangle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Time slot availability may vary based on your location and the current demand.</span>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="py-16 bg-background-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">Perfect For</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our scheduled delivery service is ideal for a variety of situations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Business Deliveries',
                description: 'Schedule deliveries to clients or partners at specific times to ensure professional service.',
                image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              },
              {
                title: 'Gift Deliveries',
                description: 'Schedule gifts to arrive at the perfect moment for birthdays, anniversaries, or special occasions.',
                image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              },
              {
                title: 'Regular Shipments',
                description: 'Set up recurring scheduled deliveries for regular shipments to customers or partners.',
                image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              },
            ].map((useCase, index) => (
              <Card key={index} className="h-full overflow-hidden">
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
            ))}
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">Frequently Asked Questions</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our scheduled delivery service.
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
          <h2 className="text-3xl font-bold text-white mb-6">Plan Your Deliveries Today</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Take control of your logistics with our flexible scheduled delivery service.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/book">
              <Button 
                variant="primary" 
                size="lg" 
                icon={<Calendar className="h-5 w-5" />}
              >
                Schedule a Delivery
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

export default ScheduledDeliveryPage;