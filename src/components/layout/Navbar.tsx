// Navigation bar component providing main site navigation and user controls
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

/**
 * Main navigation component that includes:
 * - Logo and branding
 * - Main navigation links
 * - User authentication controls
 * - Mobile responsive menu
 * - Active route highlighting
 */
const Navbar: React.FC = () => {
  // State and hooks
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle user logout
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  // Main navigation links configuration
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Enterprise', path: '/enterprise' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center">
              <img 
                src="https://i.ibb.co/Jt2xF1B/karter-logo.png" 
                alt="KARTER Logo" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-2xl font-bold text-secondary">KARTER</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navLinks.map((link) => (
              <motion.div
                key={link.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.path}
                  className={`px-3 py-2 text-base font-semibold transition-colors duration-200 ${
                    location.pathname === link.path
                      ? 'text-secondary border-b-2 border-secondary'
                      : 'text-gray-600 hover:text-secondary'
                  }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}

            {/* Authentication Section */}
            {isAuthenticated ? (
              <div className="ml-6 flex items-center space-x-6">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={user?.role === 'partner' ? '/partner/dashboard' : '/user/dashboard'}
                    className="text-base font-semibold text-gray-600 hover:text-secondary transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="text-base font-semibold text-gray-600 hover:text-secondary transition-colors duration-200"
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <div className="ml-6 flex items-center space-x-6">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="text-base font-semibold text-gray-600 hover:text-secondary transition-colors duration-200"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="px-6 py-2.5 text-base font-bold text-white bg-secondary rounded-md hover:bg-secondary-dark transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-secondary transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white border-t border-gray-200"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              <motion.div
                key={link.name}
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.path}
                  className={`block px-3 py-2 text-base font-semibold ${
                    location.pathname === link.path
                      ? 'text-secondary'
                      : 'text-gray-600 hover:text-secondary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}

            {/* Mobile Authentication Links */}
            {isAuthenticated ? (
              <>
                <motion.div
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={user?.role === 'partner' ? '/partner/dashboard' : '/user/dashboard'}
                    className="block px-3 py-2 text-base font-semibold text-gray-600 hover:text-secondary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-semibold text-gray-600 hover:text-secondary"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.div
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-semibold text-gray-600 hover:text-secondary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-base font-bold text-white bg-secondary rounded-md hover:bg-secondary-dark"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;