import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Truck,
  Clock,
  User,
  Phone,
  Package,
  CheckCircle,
  AlertTriangle,
  Star,
  MessageCircle,
  Navigation,
  ChevronRight,
  Shield
} from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import RouteMap from '../components/maps/RouteMap';
import toast from 'react-hot-toast';

interface DeliveryStatus {
  id: string;
  status: 'pending' | 'searching' | 'accepted' | 'picked-up' | 'in-transit' | 'arriving' | 'delivered' | 'cancelled';
  pickupLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  dropLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  currentLocation?: {
    address: string;
    lat: number;
    lng: number;
  };
  estimatedDelivery: string;
  partner?: {
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
    image?: string;
  };
  timeline: {
    status: string;
    time: string;
    completed: boolean;
    description?: string;
    location?: {
      address: string;
      lat: number;
      lng: number;
    };
  }[];
  packageDetails: {
    type: string;
    weight: string;
    description: string;
    isFragile: boolean;
  };
  price: {
    base: number;
    distance: number;
    tax: number;
    total: number;
  };
}

const TrackingPage: React.FC = () => {
  const [trackingId, setTrackingId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackingData, setTrackingData] = useState<DeliveryStatus | null>(null);
  const [activeTab, setActiveTab] = useState<'status' | 'details' | 'partner'>('status');
  const [showContactPartner, setShowContactPartner] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      toast.error('Please enter a tracking ID');
      return;
    }

    setIsTracking(true);
    setTrackingData(null);

    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data
      setTrackingData({
        id: trackingId,
        status: 'in-transit',
        pickupLocation: {
          address: 'Sector 18, Noida, UP',
          lat: 28.5697,
          lng: 77.3183,
        },
        dropLocation: {
          address: 'Connaught Place, New Delhi',
          lat: 28.6289,
          lng: 77.2091,
        },
        currentLocation: {
          address: 'Akshardham, Delhi',
          lat: 28.6127,
          lng: 77.2773,
        },
        estimatedDelivery: '2:45 PM',
        partner: {
          name: 'Rajesh Kumar',
          phone: '+91 9876543210',
          vehicle: 'Two-Wheeler',
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        timeline: [
          { 
            status: 'Order Placed',
            time: '12:30 PM',
            completed: true,
            description: 'Your order has been confirmed'
          },
          { 
            status: 'Partner Assigned',
            time: '12:35 PM',
            completed: true,
            description: 'Rajesh Kumar has been assigned to your delivery'
          },
          { 
            status: 'Pickup in Progress',
            time: '12:45 PM',
            completed: true,
            description: 'Partner is heading to pickup location'
          },
          { 
            status: 'Package Picked Up',
            time: '1:00 PM',
            completed: true,
            description: 'Package has been picked up successfully'
          },
          { 
            status: 'In Transit',
            time: '1:05 PM',
            completed: true,
            description: 'Package is on the way to destination'
          },
          { 
            status: 'Arriving at Destination',
            time: '2:30 PM',
            completed: false,
            description: 'Partner is approaching the delivery location'
          },
          { 
            status: 'Delivered',
            time: '2:45 PM',
            completed: false,
            description: 'Package will be delivered'
          },
        ],
        packageDetails: {
          type: 'Small Box',
          weight: '2.5 kg',
          description: 'Electronics - Handle with care',
          isFragile: true,
        },
        price: {
          base: 49,
          distance: 75,
          tax: 22.32,
          total: 146.32,
        },
      });
    } catch (error) {
      console.error('Tracking error:', error);
      toast.error('Failed to fetch tracking information');
    } finally {
      setIsTracking(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'searching':
        return 'bg-blue-500';
      case 'accepted':
        return 'bg-blue-500';
      case 'picked-up':
        return 'bg-primary';
      case 'in-transit':
        return 'bg-primary';
      case 'arriving':
        return 'bg-green-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'searching':
        return <Search className="h-5 w-5 text-blue-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'picked-up':
        return <Package className="h-5 w-5 text-primary" />;
      case 'in-transit':
        return <Truck className="h-5 w-5 text-primary" />;
      case 'arriving':
        return <MapPin className="h-5 w-5 text-green-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleContactPartner = () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    toast.success('Message sent to partner');
    setMessage('');
    setShowContactPartner(false);
  };

  return (
    <div className="min-h-screen bg-background-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary">Track Your Shipment</h1>
          <p className="mt-2 text-gray-600">
            Enter your tracking ID to get real-time updates on your delivery
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Enter Tracking ID (e.g., KTR12345678)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                icon={<Search className="h-5 w-5 text-gray-400" />}
                fullWidth
              />
              <Button 
                type="submit" 
                variant="secondary" 
                disabled={isTracking}
                icon={isTracking ? undefined : <ChevronRight className="h-5 w-5" />}
              >
                {isTracking ? 'Tracking...' : 'Track'}
              </Button>
            </div>
          </form>

          {isTracking && !trackingData && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
              <p className="mt-4 text-gray-600">Fetching tracking information...</p>
            </div>
          )}

          {!trackingData && !isTracking && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Enter your tracking ID to see delivery updates</p>
            </div>
          )}

          {trackingData && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-secondary">
                    Tracking ID: {trackingData.id}
                  </h2>
                  <div className="flex items-center mt-1">
                    <span className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(trackingData.status)}`}></span>
                    <span className="text-gray-700 capitalize">{trackingData.status.replace('-', ' ')}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-sm text-gray-500">Estimated Delivery</p>
                  <p className="text-lg font-semibold text-secondary">{trackingData.estimatedDelivery}</p>
                </div>
              </div>

              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  <button
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'status'
                        ? 'border-secondary text-secondary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('status')}
                  >
                    Delivery Status
                  </button>
                  <button
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'details'
                        ? 'border-secondary text-secondary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('details')}
                  >
                    Package Details
                  </button>
                  {trackingData.partner && (
                    <button
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'partner'
                          ? 'border-secondary text-secondary'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                      onClick={() => setActiveTab('partner')}
                    >
                      Delivery Partner
                    </button>
                  )}
                </nav>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'status' && (
                  <motion.div
                    key="status"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="bg-gray-100 p-4 rounded-md">
                      <h3 className="text-lg font-medium text-secondary mb-4">Live Tracking</h3>
                      <RouteMap
                        pickup={trackingData.pickupLocation}
                        dropoff={trackingData.dropLocation}
                        currentLocation={trackingData.currentLocation}
                        height="400px"
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-secondary mb-4">Delivery Timeline</h3>
                      <div className="relative space-y-6">
                        {trackingData.timeline.map((item, index) => (
                          <div key={index} className="relative flex items-start">
                            <div className="absolute top-0 left-2 h-full">
                              {index < trackingData.timeline.length - 1 && (
                                <div className={`w-0.5 h-full ${
                                  item.completed ? 'bg-primary' : 'bg-gray-300'
                                }`} />
                              )}
                            </div>
                            <div className={`relative flex items-center justify-center w-5 h-5 rounded-full ${
                              item.completed ? 'bg-primary' : 'bg-gray-300'
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                item.completed ? 'bg-white' : 'bg-gray-400'
                              }`} />
                            </div>
                            <div className="ml-4 min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {item.status}
                              </div>
                              <div className="mt-1 text-sm text-gray-500">
                                {item.description}
                              </div>
                              <div className="mt-1 text-xs text-gray-400">
                                {item.time}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Pickup Location</p>
                            <p className="text-gray-700">{trackingData.pickupLocation.address}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Drop-off Location</p>
                            <p className="text-gray-700">{trackingData.dropLocation.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-secondary mb-4">Package Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Type</p>
                          <p className="font-medium">{trackingData.packageDetails.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Weight</p>
                          <p className="font-medium">{trackingData.packageDetails.weight}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="font-medium">{trackingData.packageDetails.description}</p>
                        </div>
                        {trackingData.packageDetails.isFragile && (
                          <div className="col-span-2">
                            <p className="text-amber-600 font-medium flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Fragile Item
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-secondary mb-4">Price Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Base Fare</span>
                          <span>₹{trackingData.price.base.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Distance Charge</span>
                          <span>₹{trackingData.price.distance.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tax</span>
                          <span>₹{trackingData.price.tax.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2">
                          <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span>₹{trackingData.price.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'partner' && trackingData.partner && (
                  <motion.div
                    key="partner"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-center">
                        <img
                          src={trackingData.partner.image}
                          alt={trackingData.partner.name}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                        <div className="ml-4">
                          <h4 className="font-medium text-secondary">{trackingData.partner.name}</h4>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm text-gray-600">{trackingData.partner.rating}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{trackingData.partner.vehicle}</p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col sm:flex-row gap-4">
                        <Button
                          variant="secondary"
                          icon={<Phone className="h-5 w-5" />}
                          onClick={() => window.location.href = `tel:${trackingData.partner.phone}`}
                        >
                          Call Partner
                        </Button>
                        <Button
                          variant="outline"
                          icon={<MessageCircle className="h-5 w-5" />}
                          onClick={() => setShowContactPartner(true)}
                        >
                          Message Partner
                        </Button>
                      </div>
                    </div>

                    {showContactPartner && (
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-secondary mb-2">Message Partner</h4>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type your message here..."
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                          rows={3}
                        />
                        <div className="mt-4 flex justify-end space-x-4">
                          <Button
                            variant="outline"
                            onClick={() => setShowContactPartner(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={handleContactPartner}
                          >
                            Send Message
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="bg-primary/10 p-4 rounded-lg">
                      <div className="flex items-start">
                        <Shield className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-secondary">Verified Partner</p>
                          <p className="text-sm text-gray-600">
                            Our delivery partner has been verified and trained to ensure safe and secure deliveries.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TrackingPage;