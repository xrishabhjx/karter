import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, TruckIcon, BarChart, Users, Shield, Settings, CheckCircle, Package, MapPin, Phone, Mail, Clock } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import toast from 'react-hot-toast';

const EnterprisePage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    requirements: ''
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const features = [
    {
      icon: <TruckIcon className="h-6 w-6 text-primary" />,
      title: 'Dedicated Fleet',
      description: 'Access to a dedicated fleet of delivery vehicles customized for your business needs.',
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: 'Real-time Tracking',
      description: 'Monitor your deliveries in real-time with our advanced tracking system.',
    },
    {
      icon: <BarChart className="h-6 w-6 text-primary" />,
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics and reporting to track deliveries and optimize logistics.',
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: 'Enterprise Security',
      description: 'Enhanced security features and dedicated account management for businesses.',
    },
  ];

  const industries = [
    {
      name: 'E-commerce & Retail',
      icon: Package,
      description: 'Fast and reliable delivery for online stores and retail businesses.',
    },
    {
      name: 'Food & Beverages',
      icon: TruckIcon,
      description: 'Temperature-controlled delivery for restaurants and cloud kitchens.',
    },
    {
      name: 'Healthcare & Pharma',
      icon: Shield,
      description: 'Secure and timely delivery of medical supplies and pharmaceuticals.',
    },
    {
      name: 'Electronics & Tech',
      icon: Settings,
      description: 'Safe handling and delivery of electronic goods and devices.',
    },
  ];

  const metrics = [
    { value: '8+', label: 'Cities Covered' },
    { value: '750+', label: 'Deliveries Completed' },
    { value: '50+', label: 'Business Clients' },
    { value: '99.9%', label: 'On-time Delivery' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send form data to email service
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/enterprise`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.fullName,
          company: formData.companyName,
          email: formData.email,
          phone: formData.phone,
          message: formData.requirements,
          subject: 'New Enterprise Inquiry'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setShowSuccess(true);
      toast.success('Your request has been submitted successfully!');
      
      // Reset form
      setFormData({
        fullName: '',
        companyName: '',
        email: '',
        phone: '',
        requirements: ''
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleDemo = () => {
    // Open Calendly or similar scheduling tool
    window.open('https://calendly.com/karter-enterprise/demo', '_blank');
  };

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
                Enterprise Logistics Solutions
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-200 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Transform your business logistics with KARTER's enterprise-grade delivery solutions. Scale efficiently with our dedicated fleet and advanced technology.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link to="#contact-form">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    icon={<Building className="h-5 w-5" />}
                  >
                    Contact Sales
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white hover:text-secondary"
                  onClick={handleScheduleDemo}
                >
                  Schedule Demo
                </Button>
              </motion.div>
            </div>
            <motion.div 
              className="hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Enterprise logistics"
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">Why Choose KARTER</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Leading the way in modern logistics solutions with innovative technology and reliable service.
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

      {/* Industries Section */}
      <div className="py-16 bg-background-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">Industries We Serve</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored logistics solutions for various industry verticals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="p-3 bg-primary/20 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    <industry.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-2">{industry.name}</h3>
                  <p className="text-gray-600">{industry.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="py-16 bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">{metric.value}</div>
                <div className="text-gray-300">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact-form" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-secondary mb-6">Get Started with KARTER Enterprise</h2>
              <p className="text-xl text-gray-600 mb-8">
                Transform your logistics operations with our enterprise solutions. Contact our sales team to learn more.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-primary mr-3" />
                  <span>+91 6394185553</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-primary mr-3" />
                  <span>enterprise@karter.co.in</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-primary mr-3" />
                  <span>Delhi NCR | Kanpur | Bangalore | Mumbai</span>
                </div>
              </div>
            </div>
            <Card>
              <form onSubmit={handleSubmit} className="space-y-4">
                {showSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                      <p className="text-green-700">
                        Thank you for your interest! Our team will contact you shortly.
                      </p>
                    </div>
                  </div>
                )}
                
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  required
                />
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Business Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  required
                />
                <textarea
                  name="requirements"
                  placeholder="Tell us about your requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  required
                ></textarea>
                <Button 
                  variant="secondary" 
                  fullWidth 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterprisePage;