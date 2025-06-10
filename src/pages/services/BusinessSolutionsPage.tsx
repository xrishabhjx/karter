// Business Solutions page component showcasing enterprise offerings
import React from 'react';
import { Link } from 'react-router-dom';
import { Building, TruckIcon, BarChart, Users, Shield, Settings, CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

/**
 * BusinessSolutionsPage - Enterprise solutions and services page
 * Features:
 * - Service features showcase
 * - Pricing plans
 * - Case studies
 * - Integration options
 * - Enterprise benefits
 */
const BusinessSolutionsPage: React.FC = () => {
  // Key features of business solutions
  const features = [
    {
      icon: <TruckIcon className="h-6 w-6 text-primary" />,
      title: 'Dedicated Fleet',
      description: 'Access to a dedicated fleet of delivery vehicles for your business needs.',
    },
    {
      icon: <BarChart className="h-6 w-6 text-primary" />,
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics and reporting to track deliveries and optimize logistics.',
    },
    {
      icon: <Settings className="h-6 w-6 text-primary" />,
      title: 'API Integration',
      description: 'Seamlessly integrate Karter with your existing systems via our robust API.',
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: 'Enterprise Security',
      description: 'Enhanced security features and dedicated account management for businesses.',
    },
  ];

  // Pricing plan configurations
  const plans = [
    {
      name: 'Startup',
      price: '₹2,999',
      period: 'per month',
      description: 'Perfect for small businesses with occasional delivery needs.',
      features: [
        'Up to 50 deliveries per month',
        'Basic analytics dashboard',
        'Email support',
        'Standard delivery vehicles',
        '24-hour delivery window',
      ],
      cta: 'Get Started',
    },
    {
      name: 'Business',
      price: '₹5,999',
      period: 'per month',
      description: 'Ideal for growing businesses with regular delivery requirements.',
      features: [
        'Up to 200 deliveries per month',
        'Advanced analytics and reporting',
        'Priority email and phone support',
        'Priority access to delivery partners',
        'Same-day delivery options',
        'Basic API access',
      ],
      featured: true,
      cta: 'Choose Business',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'Tailored solutions for large businesses with complex logistics needs.',
      features: [
        'Unlimited deliveries',
        'Dedicated account manager',
        '24/7 priority support',
        'Dedicated fleet options',
        'Custom delivery windows',
        'Full API integration',
        'White-labeled tracking',
      ],
      cta: 'Contact Sales',
    },
  ];

  // Case studies showcasing success stories
  const caseStudies = [
    {
      company: 'FreshEats',
      industry: 'Food Delivery',
      challenge: 'Needed reliable same-day delivery for perishable items across the city.',
      solution: 'Implemented Karter Business plan with dedicated refrigerated vehicles and 2-hour delivery windows.',
      result: '30% reduction in delivery costs and 98% on-time delivery rate.',
      logo: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
      company: 'TechGadgets',
      industry: 'Electronics Retail',
      challenge: 'Wanted to offer same-day delivery to compete with larger online retailers.',
      solution: 'Integrated Karter API with their e-commerce platform for seamless order fulfillment.',
      result: '40% increase in local sales and improved customer satisfaction scores.',
      logo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-background-light">
      {/* Hero Section */}
      <div className="bg-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">Business Solutions</h1>
              <p className="text-xl text-gray-200 mb-8">
                Streamline your logistics operations with Karter's comprehensive business solutions. From small startups to large enterprises, we have tailored plans to meet your specific needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    icon={<Building className="h-5 w-5" />}
                  >
                    Contact Sales
                  </Button>
                </Link>
                <Link to="/services/business#pricing">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white text-white hover:bg-white hover:text-secondary"
                  >
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Business logistics solutions"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">Key Features</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our business solutions offer powerful features to streamline your logistics operations.
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

      {/* Benefits */}
      <div className="py-16 bg-background-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Business benefits"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-secondary mb-6">Why Choose Karter for Business?</h2>
              <div className="space-y-6">
                {[
                  {
                    title: 'Cost Efficiency',
                    description: 'Reduce your logistics costs by up to 30% with our optimized delivery network and volume-based pricing.',
                  },
                  {
                    title: 'Scalability',
                    description: 'Easily scale your delivery operations up or down based on your business needs without investing in your own fleet.',
                  },
                  {
                    title: 'Reliability',
                    description: 'Ensure consistent, on-time deliveries with our network of verified delivery partners and real-time tracking.',
                  },
                  {
                    title: 'Customer Experience',
                    description: 'Enhance your customer experience with branded tracking, delivery updates, and flexible delivery options.',
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex">
                    <div className="p-1 bg-primary/20 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-secondary" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-secondary">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">Business Plans</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that best fits your business needs and scale as you grow.
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
                  <h3 className="text-2xl font-semibold text-secondary mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-secondary">{plan.price}</span>
                    <span className="text-gray-600"> {plan.period}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6 flex-grow">
                    <p className="font-medium text-secondary mb-2">Features:</p>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link to="/contact">
                    <Button 
                      variant={plan.featured ? "secondary" : "outline"} 
                      fullWidth
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 text-center text-gray-600">
            <p>All plans include access to our web dashboard and mobile app. Contact us for custom requirements.</p>
          </div>
        </div>
      </div>

      {/* Case Studies */}
      <div className="py-16 bg-background-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">Success Stories</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              See how businesses like yours have transformed their logistics with Karter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <Card key={index} className="h-full">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-white rounded-full overflow-hidden flex items-center justify-center border border-gray-200">
                    <img
                      src={study.logo}
                      alt={study.company}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-secondary">{study.company}</h3>
                    <p className="text-gray-600">{study.industry}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-secondary">Challenge:</p>
                    <p className="text-gray-600">{study.challenge}</p>
                  </div>
                  <div>
                    <p className="font-medium text-secondary">Solution:</p>
                    <p className="text-gray-600">{study.solution}</p>
                  </div>
                  <div>
                    <p className="font-medium text-secondary">Result:</p>
                    <p className="text-gray-600">{study.result}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Integration */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-secondary mb-6">Seamless Integration</h2>
              <p className="text-gray-600 mb-6">
                Our robust API and pre-built integrations make it easy to connect Karter with your existing systems.
              </p>
              
              <div className="space-y-4">
                <div className="bg-primary/10 p-4 rounded-md">
                  <h3 className="text-lg font-semibold text-secondary mb-2">E-commerce Platforms</h3>
                  <p className="text-gray-600">
                    Integrate with popular platforms like Shopify, WooCommerce, and Magento to automate order fulfillment.
                  </p>
                </div>
                
                <div className="bg-primary/10 p-4 rounded-md">
                  <h3 className="text-lg font-semibold text-secondary mb-2">CRM Systems</h3>
                  <p className="text-gray-600">
                    Connect with Salesforce, HubSpot, and other CRM systems to streamline customer communication.
                  </p>
                </div>
                
                <div className="bg-primary/10 p-4 rounded-md">
                  <h3 className="text-lg font-semibold text-secondary mb-2">Custom Solutions</h3>
                  <p className="text-gray-600">
                    Our development team can create custom integrations for your proprietary systems.
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Link to="/developers">
                  <Button variant="secondary">
                    Explore API Documentation
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="API integration"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Logistics?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Contact our sales team today to discuss how Karter can help streamline your business deliveries.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact">
              <Button 
                variant="primary" 
                size="lg" 
                icon={<Building className="h-5 w-5" />}
              >
                Contact Sales
              </Button>
            </Link>
            <Link to="/book">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-secondary"
              >
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSolutionsPage;