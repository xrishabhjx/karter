import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <motion.div 
              className="flex items-center mb-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src="https://i.ibb.co/Jt2xF1B/karter-logo.png" 
                alt="KARTER Logo" 
                className="h-12 w-auto"
              />
              <span className="ml-2 text-2xl font-bold text-white">KARTER</span>
            </motion.div>
            <p className="text-gray-300 mb-4">
              Get anything delivered in 45 minutes within 10 km. Fast, reliable logistics solutions with instant matching, verified partners, and cost-effective pricing.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="#" 
                className="text-gray-300 hover:text-primary"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a 
                href="#" 
                className="text-gray-300 hover:text-primary"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a 
                href="https://www.instagram.com/karter_delivery" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a 
                href="#" 
                className="text-gray-300 hover:text-primary"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin size={20} />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/" className="text-gray-300 hover:text-primary">Home</Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/services" className="text-gray-300 hover:text-primary">Services</Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/about" className="text-gray-300 hover:text-primary">About Us</Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/contact" className="text-gray-300 hover:text-primary">Contact</Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/partner/register" className="text-gray-300 hover:text-primary">Become a Partner</Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/track" className="text-gray-300 hover:text-primary">Track Shipment</Link>
              </motion.li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Our Services</h3>
            <ul className="space-y-2">
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/services/instant-delivery" className="text-gray-300 hover:text-primary">Instant Delivery</Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/services/scheduled-delivery" className="text-gray-300 hover:text-primary">Scheduled Delivery</Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/services/intercity" className="text-gray-300 hover:text-primary">Intercity</Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/services/movers-and-packers" className="text-gray-300 hover:text-primary">Movers & Packers</Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/services/business" className="text-gray-300 hover:text-primary">Business Solutions</Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/services/sos-delivery" className="text-gray-300 hover:text-primary">SOS Delivery</Link>
              </motion.li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <motion.li 
                className="flex items-start"
                whileHover={{ x: 5 }}
              >
                <MapPin className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>Delhi NCR | Kanpur | Bangalore | Mumbai</span>
              </motion.li>
              <motion.li 
                className="flex items-center"
                whileHover={{ x: 5 }}
              >
                <Phone className="h-5 w-5 text-primary mr-2" />
                <span>+91 6394185553</span>
              </motion.li>
              <motion.li 
                className="flex items-center"
                whileHover={{ x: 5 }}
              >
                <Mail className="h-5 w-5 text-primary mr-2" />
                <span>ceo@karter.co.in</span>
              </motion.li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              &copy; {new Date().getFullYear()} KARTER Logistics. All rights reserved.
            </p>
            <p className="text-gray-300 text-sm mt-2 md:mt-0">
              Powered by Leaselink Technologies Private Limited
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <motion.li whileHover={{ y: -2 }}>
                  <Link to="/privacy" className="text-gray-300 hover:text-primary text-sm">
                    Privacy Policy
                  </Link>
                </motion.li>
                <motion.li whileHover={{ y: -2 }}>
                  <Link to="/terms" className="text-gray-300 hover:text-primary text-sm">
                    Terms of Service
                  </Link>
                </motion.li>
                <motion.li whileHover={{ y: -2 }}>
                  <Link to="/faq" className="text-gray-300 hover:text-primary text-sm">
                    FAQ
                  </Link>
                </motion.li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;