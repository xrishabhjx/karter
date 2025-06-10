// Hero section component for the homepage
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, Navigation, Search, Truck, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';

/**
 * Hero - Main landing section component
 * Features:
 * - Location search with suggestions
 * - Animated transitions
 * - Quick booking functionality
 * - Responsive design
 */
const Hero: React.FC = () => {
  // State for location inputs and suggestions
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [activeInput, setActiveInput] = useState<'from' | 'to' | null>(null);
  
  // Refs for handling click outside suggestions
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);
  const fromSuggestionsRef = useRef<HTMLDivElement>(null);
  const toSuggestionsRef = useRef<HTMLDivElement>(null);

  // Sample locations for suggestions (in production, this would come from an API)
  // Sample locations for suggestions
  const locations = [
    'Delhi', 'New Delhi', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad',
    'Kanpur', 'Lucknow', 'Agra', 'Varanasi', 'Allahabad', 'Meerut',
    'Bangalore', 'Mumbai', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'
  ];

  const handleFromLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromLocation(value);
    
    if (value.length > 1) {
      const filtered = locations.filter(location => 
        location.toLowerCase().includes(value.toLowerCase())
      );
      setFromSuggestions(filtered.slice(0, 5));
      setShowFromSuggestions(true);
    } else {
      setShowFromSuggestions(false);
    }
  };

  const handleToLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToLocation(value);
    
    if (value.length > 1) {
      const filtered = locations.filter(location => 
        location.toLowerCase().includes(value.toLowerCase())
      );
      setToSuggestions(filtered.slice(0, 5));
      setShowToSuggestions(true);
    } else {
      setShowToSuggestions(false);
    }
  };

  const selectFromSuggestion = (suggestion: string) => {
    setFromLocation(suggestion);
    setShowFromSuggestions(false);
    setActiveInput(null);
    if (toInputRef.current) {
      toInputRef.current.focus();
    }
  };

  const selectToSuggestion = (suggestion: string) => {
    setToLocation(suggestion);
    setShowToSuggestions(false);
    setActiveInput(null);
  };

  const handleBookDelivery = () => {
    window.location.href = `/book?from=${encodeURIComponent(fromLocation)}&to=${encodeURIComponent(toLocation)}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromSuggestionsRef.current && !fromSuggestionsRef.current.contains(event.target as Node) && 
          fromInputRef.current && !fromInputRef.current.contains(event.target as Node)) {
        setShowFromSuggestions(false);
        if (activeInput === 'from') setActiveInput(null);
      }
      
      if (toSuggestionsRef.current && !toSuggestionsRef.current.contains(event.target as Node) && 
          toInputRef.current && !toInputRef.current.contains(event.target as Node)) {
        setShowToSuggestions(false);
        if (activeInput === 'to') setActiveInput(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeInput]);

  return (
    <div className="relative bg-background-light overflow-hidden">
      <div className="relative overflow-hidden">
        <motion.div
          className="absolute top-4 left-0 w-full"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <Truck className="h-10 w-10 text-primary" />
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-background-light sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-background-light transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <div className="pt-10 sm:pt-16 lg:pt-8 xl:pt-16">
              <div className="sm:text-center lg:text-left px-4 sm:px-8 xl:pl-0">
                <motion.h1 
                  className="text-4xl tracking-tight font-extrabold text-secondary sm:text-5xl md:text-6xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="block">Kuch Bhejna Hai?</span>
                  <span className="block text-primary">KARTER Karo..!</span>
                </motion.h1>
                <motion.p 
                  className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Get anything delivered in 45 minutes within 10 km. Fast, reliable logistics solutions with instant matching and verified delivery partners.
                </motion.p>
                
                <motion.div 
                  className="mt-6 bg-white p-6 rounded-xl shadow-location border-2 border-primary/20 relative z-20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <motion.div 
                    className="absolute -top-3 left-4 bg-primary text-secondary px-4 py-1 rounded-full text-sm font-bold shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Book Now
                  </motion.div>
                  
                  <div className="mb-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <input
                        ref={fromInputRef}
                        type="text"
                        placeholder="Enter pickup location"
                        className="pl-10 pr-12 py-4 w-full rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg shadow-sm transition-all duration-200"
                        value={fromLocation}
                        onChange={handleFromLocationChange}
                        onFocus={() => setActiveInput('from')}
                      />
                      {fromLocation && (
                        <button 
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          onClick={() => setFromLocation('')}
                        >
                          <span className="sr-only">Clear</span>
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    
                    {showFromSuggestions && fromSuggestions.length > 0 && (
                      <motion.div 
                        ref={fromSuggestionsRef}
                        className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {fromSuggestions.map((suggestion, index) => (
                          <motion.div 
                            key={index}
                            className="px-4 py-3 hover:bg-primary/10 cursor-pointer flex items-center"
                            onClick={() => selectFromSuggestion(suggestion)}
                            whileHover={{ x: 5 }}
                          >
                            <MapPin className="h-4 w-4 text-primary mr-2" />
                            <span className="text-gray-700">{suggestion}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>

                 

                  <div className="mb-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-secondary" />
                      </div>
                      <input
                        ref={toInputRef}
                        type="text"
                        placeholder="Enter destination location"
                        className="pl-10 pr-12 py-4 w-full rounded-lg border-2 border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-lg shadow-sm transition-all duration-200"
                        value={toLocation}
                        onChange={handleToLocationChange}
                        onFocus={() => setActiveInput('to')}
                      />
                      {toLocation && (
                        <button 
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          onClick={() => setToLocation('')}
                        >
                          <span className="sr-only">Clear</span>
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    
                    {showToSuggestions && toSuggestions.length > 0 && (
                      <motion.div 
                        ref={toSuggestionsRef}
                        className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {toSuggestions.map((suggestion, index) => (
                          <motion.div 
                            key={index}
                            className="px-4 py-3 hover:bg-primary/10 cursor-pointer flex items-center"
                            onClick={() => selectToSuggestion(suggestion)}
                            whileHover={{ x: 5 }}
                          >
                            <MapPin className="h-4 w-4 text-secondary mr-2" />
                            <span className="text-gray-700">{suggestion}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                  
                  <motion.button
                    onClick={handleBookDelivery}
                    disabled={!fromLocation || !toLocation}
                    className={`w-full py-4 px-6 rounded-lg text-white font-medium flex items-center justify-center transition-all duration-300 ${
                      fromLocation && toLocation 
                        ? 'bg-secondary hover:bg-secondary-dark shadow-lg' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    whileHover={fromLocation && toLocation ? { scale: 1.02 } : undefined}
                    whileTap={fromLocation && toLocation ? { scale: 0.98 } : undefined}
                  >
                    <Package className="h-5 w-5 mr-2" />
                    Book Delivery Now
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </motion.button>
                </motion.div>
                
                <motion.div 
                  className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Link to="/book">
                    <Button 
                      variant="secondary" 
                      size="lg" 
                      icon={<Package className="h-5 w-5" />}
                    >
                      Book a Delivery
                    </Button>
                  </Link>
                  <Link to="/partner/register">
                    <Button 
                      variant="outline" 
                      size="lg"
                    >
                      Become a Partner
                    </Button>
                  </Link>
                  <Link to="/track">
                    <Button 
                      variant="text" 
                      size="lg" 
                      className="sm:ml-2"
                    >
                      Track Shipment
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        
        <motion.div 
          className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full rounded-lg shadow-xl"
            src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
            alt="Logistics delivery"
          />
        </motion.div>
        
        <div className="bg-white py-6 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/locations">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-secondary">Available Locations</h3>
                      <p className="text-gray-600">Delhi NCR • Kanpur • Bangalore • Mumbai</p>
                    </div>
                  </div>
                  <div className="text-primary font-bold">
                    View All
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;