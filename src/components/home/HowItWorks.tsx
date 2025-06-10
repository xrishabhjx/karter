// How It Works section explaining the delivery process
import React from 'react';
import { MapPin, Truck, CreditCard, CheckCircle } from 'lucide-react';

/**
 * HowItWorks - Component explaining the delivery process
 * Features:
 * - Step-by-step guide
 * - Visual process flow
 * - Connecting line between steps
 */
const HowItWorks: React.FC = () => {
  // Steps in the delivery process
  const steps = [
    {
      icon: <MapPin className="h-10 w-10 text-primary" />,
      title: 'Enter Location Details',
      description: 'Provide pickup and drop-off locations along with package details.',
    },
    {
      icon: <Truck className="h-10 w-10 text-primary" />,
      title: 'Get Matched with a Partner',
      description: 'Our system matches you with the nearest available delivery partner.',
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: 'Make Payment',
      description: 'Choose your preferred payment method and complete the transaction.',
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: 'Track & Receive',
      description: 'Track your delivery in real-time and receive your package within 45 minutes.',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary">How It Works</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Booking a delivery with KARTER is simple and straightforward. Follow these steps to get started.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary/30 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative z-10 flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary text-white mb-4 relative">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-secondary font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-secondary mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;