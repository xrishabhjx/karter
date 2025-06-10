import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, X, TruckIcon, MapPin, User, CreditCard, Settings, Bell, Navigation } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import GoogleMapComponent from '../components/maps/GoogleMapComponent';
import RouteMap from '../components/maps/RouteMap';

interface Delivery {
  id: string;
  status: string;
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
  date: string;
  time: string;
  price: number;
  customer: string;
  customerPhone: string;
}

const PartnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isOnline, setIsOnline] = useState(true);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  // Mock data - in a real app, this would be fetched from an API
  const deliveries: Delivery[] = [
    {
      id: 'KTR12345678',
      status: 'in-progress',
      pickupLocation: {
        address: 'Sector 18, Noida, UP',
        lat: 28.5697,
        lng: 77.3183
      },
      dropLocation: {
        address: 'Connaught Place, New Delhi',
        lat: 28.6289,
        lng: 77.2091
      },
      date: '2023-06-15',
      time: '14:30',
      price: 149.99,
      customer: 'Amit Sharma',
      customerPhone: '+91 9876543210'
    },
    {
      id: 'KTR87654321',
      status: 'pending',
      pickupLocation: {
        address: 'Lajpat Nagar, New Delhi',
        lat: 28.5709,
        lng: 77.2373
      },
      dropLocation: {
        address: 'Saket, New Delhi',
        lat: 28.5244,
        lng: 77.2167
      },
      date: '2023-06-15',
      time: '16:00',
      price: 99.50,
      customer: 'Priya Patel',
      customerPhone: '+91 9876543211'
    },
    {
      id: 'KTR24681357',
      status: 'completed',
      pickupLocation: {
        address: 'Karol Bagh, New Delhi',
        lat: 28.6619,
        lng: 77.1921
      },
      dropLocation: {
        address: 'Dwarka, New Delhi',
        lat: 28.5921,
        lng: 77.0460
      },
      date: '2023-06-14',
      time: '11:30',
      price: 199.75,
      customer: 'Rahul Singh',
      customerPhone: '+91 9876543212'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'accepted':
        return 'bg-blue-500';
      case 'in-progress':
        return 'bg-primary';
      case 'completed':
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
      case 'accepted':
        return <TruckIcon className="h-5 w-5 text-blue-500" />;
      case 'in-progress':
        return <TruckIcon className="h-5 w-5 text-primary" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleDeliverySelect = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-primary/10">
                <div className="flex items-center">
                  <div className="p-3 bg-primary rounded-full">
                    <Package className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Deliveries</p>
                    <p className="text-2xl font-bold text-secondary">124</p>
                  </div>
                </div>
              </Card>
              <Card className="bg-secondary/10">
                <div className="flex items-center">
                  <div className="p-3 bg-secondary rounded-full">
                    <TruckIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Today's Deliveries</p>
                    <p className="text-2xl font-bold text-secondary">3</p>
                  </div>
                </div>
              </Card>
              <Card className="bg-green-100">
                <div className="flex items-center">
                  <div className="p-3 bg-green-500 rounded-full">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-secondary">₹12,345</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-secondary">Your Status</h2>
                <div className="flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-gray-700">{isOnline ? 'Online' : 'Offline'}</span>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Button
                    variant={isOnline ? "secondary" : "outline"}
                    fullWidth
                    onClick={() => setIsOnline(true)}
                  >
                    Go Online
                  </Button>
                </div>
                <div className="flex-1">
                  <Button
                    variant={!isOnline ? "secondary" : "outline"}
                    fullWidth
                    onClick={() => setIsOnline(false)}
                  >
                    Go Offline
                  </Button>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-600 text-sm">
                  {isOnline 
                    ? 'You are currently online and available to receive delivery requests.' 
                    : 'You are currently offline and will not receive any delivery requests.'}
                </p>
              </div>
            </Card>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-secondary">Current Location</h2>
              </div>
              <Card>
                <GoogleMapComponent
                  height="300px"
                  zoom={13}
                  initialCenter={{ lat: 28.6139, lng: 77.2090 }}
                  markers={[{ lat: 28.6139, lng: 77.2090 }]}
                  showSearchBox={false}
                />
              </Card>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-secondary">Active Deliveries</h2>
                <Link to="/partner/deliveries">
                  <Button variant="text">View All</Button>
                </Link>
              </div>
              <div className="space-y-4">
                {deliveries.filter(d => d.status === 'in-progress' || d.status === 'pending').map((delivery) => (
                  <Card 
                    key={delivery.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleDeliverySelect(delivery)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start">
                        <div className="mr-4">
                          {getStatusIcon(delivery.status)}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium text-secondary">{delivery.id}</h3>
                            <span
                              className={`ml-2 inline-block w-2 h-2 rounded-full ${getStatusColor(
                                delivery.status
                              )}`}
                            ></span>
                            <span className="ml-1 text-sm text-gray-500 capitalize">
                              {delivery.status.replace('-', ' ')}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-gray-600">
                            <div className="flex items-start mt-1">
                              <MapPin className="h-4 w-4 text-primary mr-1 flex-shrink-0 mt-0.5" />
                              <span>{delivery.pickupLocation.address}</span>
                            </div>
                            <div className="flex items-start mt-1">
                              <MapPin className="h-4 w-4 text-secondary mr-1 flex-shrink-0 mt-0.5" />
                              <span>{delivery.dropLocation.address}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex flex-col items-end">
                        <div className="text-lg font-semibold text-secondary">
                          ₹{delivery.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {delivery.date} • {delivery.time}
                        </div>
                        <div className="mt-2 flex space-x-2">
                          <Button variant="secondary" size="sm">
                            Navigate
                          </Button>
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );
      case 'deliveries':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="mb-6">
                <div className="flex space-x-4">
                  <Button
                    variant="text"
                    className={`${
                      !activeTab.includes('-') ? 'bg-primary/20 text-secondary' : ''
                    }`}
                    onClick={() => setActiveTab('deliveries')}
                  >
                    All
                  </Button>
                  <Button
                    variant="text"
                    className={`${
                      activeTab === 'deliveries-active' ? 'bg-primary/20 text-secondary' : ''
                    }`}
                    onClick={() => setActiveTab('deliveries-active')}
                  >
                    Active
                  </Button>
                  <Button
                    variant="text"
                    className={`${
                      activeTab === 'deliveries-completed' ? 'bg-primary/20 text-secondary' : ''
                    }`}
                    onClick={() => setActiveTab('deliveries-completed')}
                  >
                    Completed
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {deliveries
                  .filter((delivery) => {
                    if (activeTab === 'deliveries') return true;
                    if (activeTab === 'deliveries-active')
                      return ['pending', 'accepted', 'in-progress'].includes(delivery.status);
                    if (activeTab === 'deliveries-completed') return delivery.status === 'completed';
                    return true;
                  })
                  .map((delivery) => (
                    <Card 
                      key={delivery.id} 
                      className={`hover:shadow-md transition-shadow cursor-pointer ${
                        selectedDelivery?.id === delivery.id ? 'border-2 border-primary' : ''
                      }`}
                      onClick={() => handleDeliverySelect(delivery)}
                    >
                      <div className="flex items-start">
                        <div className="mr-4">
                          {getStatusIcon(delivery.status)}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium text-secondary">{delivery.id}</h3>
                            <span
                              className={`ml-2 inline-block w-2 h-2 rounded-full ${getStatusColor(
                                delivery.status
                              )}`}
                            ></span>
                            <span className="ml-1 text-sm text-gray-500 capitalize">
                              {delivery.status.replace('-', ' ')}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-gray-600">
                            <div className="flex items-start mt-1">
                              <MapPin className="h-4 w-4 text-primary mr-1 flex-shrink-0 mt-0.5" />
                              <span className="truncate">{delivery.pickupLocation.address}</span>
                            </div>
                            <div className="flex items-start mt-1">
                              <MapPin className="h-4 w-4 text-secondary mr-1 flex-shrink-0 mt-0.5" />
                              <span className="truncate">{delivery.dropLocation.address}</span>
                            </div>
                          </div>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-gray-500 text-sm">{delivery.date} • {delivery.time}</span>
                            <span className="font-semibold text-secondary">₹{delivery.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
            
            <div className="lg:col-span-2">
              {selectedDelivery ? (
                <Card>
                  <div className="mb-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-secondary">Delivery Details</h3>
                      <div className="flex items-center">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusColor(selectedDelivery.status)}`}></span>
                        <span className="text-gray-700 capitalize">{selectedDelivery.status.replace('-', ' ')}</span>
                      </div>
                    </div>
                    <p className="text-gray-500">ID: {selectedDelivery.id}</p>
                  </div>
                  
                  <div className="mb-6">
                    <RouteMap
                      pickup={selectedDelivery.pickupLocation}
                      dropoff={selectedDelivery.dropLocation}
                      height="300px"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-100 p-3 rounded-md">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Pickup Location</p>
                          <p className="text-gray-700">{selectedDelivery.pickupLocation.address}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-100 p-3 rounded-md">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Drop-off Location</p>
                          <p className="text-gray-700">{selectedDelivery.dropLocation.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-secondary mb-2">Customer Information</h4>
                    <div className="bg-gray-100 p-3 rounded-md">
                      <div className="flex items-start">
                        <User className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Customer</p>
                          <p className="text-gray-700">{selectedDelivery.customer}</p>
                          <p className="text-gray-700">{selectedDelivery.customerPhone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-secondary mb-2">Delivery Information</h4>
                    <div className="bg-gray-100 p-3 rounded-md">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="text-gray-700">{selectedDelivery.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Time</p>
                          <p className="text-gray-700">{selectedDelivery.time}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Payment</p>
                          <p className="text-gray-700">₹{selectedDelivery.price.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Payment Method</p>
                          <p className="text-gray-700">Online Payment</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="secondary"
                      fullWidth
                      icon={<Navigation className="h-5 w-5 mr-2" />}
                    >
                      Navigate
                    </Button>
                    
                    {selectedDelivery.status === 'pending' && (
                      <Button
                        variant="outline"
                        fullWidth
                      >
                        Accept Delivery
                      </Button>
                    )}
                    
                    {selectedDelivery.status === 'in-progress' && (
                      <Button
                        variant="outline"
                        fullWidth
                      >
                        Mark as Delivered
                      </Button>
                    )}
                  </div>
                </Card>
              ) : (
                <Card className="flex flex-col items-center justify-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-gray-600 text-center">
                    Select a delivery from the list to view details
                  </p>
                </Card>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background-light py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 mb-8 md:mb-0">
            <Card className="sticky top-24">
              <div className="flex flex-col space-y-1">
                <button
                  className={`flex items-center px-4 py-3 rounded-md ${
                    activeTab === 'overview'
                      ? 'bg-primary/20 text-secondary'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  <Package className="h-5 w-5 mr-3" />
                  <span>Overview</span>
                </button>
                <button
                  className={`flex items-center px-4 py-3 rounded-md ${
                    activeTab.includes('deliveries')
                      ? 'bg-primary/20 text-secondary'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('deliveries')}
                >
                  <TruckIcon className="h-5 w-5 mr-3" />
                  <span>Deliveries</span>
                </button>
                <button
                  className={`flex items-center px-4 py-3 rounded-md ${
                    activeTab === 'earnings'
                      ? 'bg-primary/20 text-secondary'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('earnings')}
                >
                  <CreditCard className="h-5 w-5 mr-3" />
                  <span>Earnings</span>
                </button>
                <button
                  className={`flex items-center px-4 py-3 rounded-md ${
                    activeTab === 'profile'
                      ? 'bg-primary/20 text-secondary'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User className="h-5 w-5 mr-3" />
                  <span>Profile</span>
                </button>
                <button
                  className={`flex items-center px-4 py-3 rounded-md ${
                    activeTab === 'settings'
                      ? 'bg-primary/20 text-secondary'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  <span>Settings</span>
                </button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 md:ml-8">
            <Card className="mb-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-secondary">
                  {activeTab === 'overview' && 'Partner Dashboard'}
                  {activeTab.includes('deliveries') && 'Deliveries'}
                  {activeTab === 'earnings' && 'Earnings'}
                  {activeTab === 'profile' && 'Profile'}
                  {activeTab === 'settings' && 'Settings'}
                </h1>
                <div className="flex items-center">
                  <div className="relative">
                    <Bell className="h-6 w-6 text-gray-500 cursor-pointer" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  </div>
                  <div className="ml-4 flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                    <span className="ml-2 text-gray-700 font-medium hidden md:block">
                      {user?.name || 'Partner'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;