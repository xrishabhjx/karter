// Call-to-Action section component for the homepage
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, Navigation } from 'lucide-react';
import Button from '../common/Button';

/**
 * CTASection - Main call-to-action component for booking deliveries
 * Features:
 * - Location search with suggestions
 * - Interactive booking form
 * - Real-time validation
 * - Quick booking flow
 */
const CTASection: React.FC = () => {
  // State for location inputs and suggestions
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  
  // Refs for handling click outside suggestions
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);
  const fromSuggestionsRef = useRef<HTMLDivElement>(null);
  const toSuggestionsRef = useRef<HTMLDivElement>(null);

  // Sample locations for suggestions (in production, this would come from an API)
  const locations = [
    'Delhi', 'New Delhi', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad',
    'Kanpur', 'Lucknow', 'Agra', 'Varanasi', 'Allahabad', 'Meerut',
    'Bangalore', 'Mumbai', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'
  ];

  // Handle changes in pickup location input
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

  // Handle changes in drop-off location input
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

  // Handle selection from location suggestions
  const selectFromSuggestion = (suggestion: string) => {
    setFromLocation(suggestion);
    setShowFromSuggestions(false);
  };

  // Handle selection from drop-off suggestions
  const selectToSuggestion = (suggestion: string) => {
    setToLocation(suggestion);
    setShowToSuggestions(false);
  };

  // Navigate to booking page with selected locations
  const handleBookDelivery = () => {
    // Navigate to booking page with locations as query params
    window.location.href = `/book?from=${encodeURIComponent(fromLocation)}&to=${encodeURIComponent(toLocation)}`;
  };

  // Close suggestions when clicking outside
  // Handle clicks outside suggestion boxes to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromSuggestionsRef.current && !fromSuggestionsRef.current.contains(event.target as Node) && 
          fromInputRef.current && !fromInputRef.current.contains(event.target as Node)) {
        setShowFromSuggestions(false);
      }
      
      if (toSuggestionsRef.current && !toSuggestionsRef.current.contains(event.target as Node) && 
          toInputRef.current && !toInputRef.current.contains(event.target as Node)) {
        setShowToSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-secondary to-secondary-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">Kuch Bhejna Hai? KARTER Karo..!</h2>
            <p className="mt-4 text-xl text-gray-200">
              Get anything delivered in 45 minutes within 10 km. Join thousands of satisfied customers and partners who have made KARTER their go-to logistics platform.
            </p>
            
            {/* Enhanced Location Pointers */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-lg border border-primary/20 relative">
              <div className="absolute -top-3 left-4 bg-primary text-secondary px-3 py-1 rounded-full text-sm font-semibold">
                Book Now
              </div>
              
              <div className="mb-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <input
                  ref={fromInputRef}
                  type="text"
                  placeholder="Enter pickup location"
                  className="pl-10 pr-4 py-3 w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary transition-all duration-200 bg-gray-50 hover:bg-white"
                  value={fromLocation}
                  onChange={handleFromLocationChange}
                />
                {fromLocation && (
                  <button 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setFromLocation('')}
                  >
                    <span className="sr-only">Clear</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
              {showFromSuggestions && fromSuggestions.length > 0 && (
                <div 
                  ref={fromSuggestionsRef}
                  className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  {fromSuggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="px-4 py-2 hover:bg-primary/10 cursor-pointer flex items-center"
                      onClick={() => selectFromSuggestion(suggestion)}
                    >
                      <MapPin className="h-4 w-4 text-primary mr-2" />
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="w-full border-t border-dashed border-gray-300 my-3 relative">
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full border border-gray-300">
                  <Navigation className="h-5 w-5 text-secondary rotate-90" />
                </div>
              </div>
              
              <div className="mb-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-secondary" />
                </div>
                <input
                  ref={toInputRef}
                  type="text"
                  placeholder="Enter destination location"
                  className="pl-10 pr-4 py-3 w-full rounded-md border-gray-300 shadow-sm focus:ring-secondary focus:border-secondary transition-all duration-200 bg-gray-50 hover:bg-white"
                  value={toLocation}
                  onChange={handleToLocationChange}
                />
                {toLocation && (
                  <button 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setToLocation('')}
                  >
                    <span className="sr-only">Clear</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
              {showToSuggestions && toSuggestions.length > 0 && (
                <div 
                  ref={toSuggestionsRef}
                  className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  {toSuggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="px-4 py-2 hover:bg-primary/10 cursor-pointer flex items-center"
                      onClick={() => selectToSuggestion(suggestion)}
                    >
                      <MapPin className="h-4 w-4 text-secondary mr-2" />
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <button
                onClick={handleBookDelivery}
                disabled={!fromLocation || !toLocation}
                className={`w-full py-3 px-4 rounded-md text-white font-medium flex items-center justify-center transition-all duration-200 ${
                  fromLocation && toLocation 
                    ? 'bg-primary hover:bg-primary-dark text-secondary' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <Package className="h-5 w-5 mr-2" />
                Book Delivery Now
              </button>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link to="/book">
                <Button 
                  variant="primary" 
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
                  className="border-white text-white hover:bg-white hover:text-secondary"
                >
                  Become a Partner
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col items-center sm:items-start bg-secondary-dark/30 p-4 rounded-lg backdrop-blur-sm">
                <p className="text-3xl font-bold text-primary">45 min</p>
                <p className="text-white">Delivery Time</p>
              </div>
              <div className="flex flex-col items-center sm:items-start bg-secondary-dark/30 p-4 rounded-lg backdrop-blur-sm">
                <p className="text-3xl font-bold text-primary">10 km</p>
                <p className="text-white">Delivery Radius</p>
              </div>
              <div className="flex flex-col items-center sm:items-start bg-secondary-dark/30 p-4 rounded-lg backdrop-blur-sm">
                <p className="text-3xl font-bold text-primary">4+</p>
                <p className="text-white">Cities Covered</p>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
              alt="Logistics delivery"
              className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;