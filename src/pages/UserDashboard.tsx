import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, X, TruckIcon, MapPin, User, CreditCard, Settings, Bell } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Initially, the deliveries state is empty.
  const [deliveries, setDeliveries] = useState<any[]>([]);

  // Use this effect to fetch real-time data when the component mounts.
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/deliveries`)
      .then((res) => res.json())
      .then((data) => setDeliveries(data))
      .catch((err) => console.error(err));
  }, []);  

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
                    <p className="text-2xl font-bold text-secondary">0</p>
                  </div>
                </div>
              </Card>
              <Card className="bg-secondary/10">
                <div className="flex items-center">
                  <div className="p-3 bg-secondary rounded-full">
                    <TruckIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Active Deliveries</p>
                    <p className="text-2xl font-bold text-secondary">0</p>
                  </div>
                </div>
              </Card>
              <Card className="bg-green-100">
                <div className="flex items-center">
                  <div className="p-3 bg-green-500 rounded-full">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-secondary">$0.00</p>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-secondary">Recent Deliveries</h2>
                <Link to="/user/deliveries">
                  <Button variant="text">View All</Button>
                </Link>
              </div>
              <div className="space-y-4">
                {deliveries.length === 0 ? (
                  <p className="text-center text-gray-600">No deliveries yet. Your deliveries will appear here in real time.</p>
                ) : (
                  deliveries.slice(0, 3).map((delivery) => (
                    <Card key={delivery.id} className="hover:shadow-md transition-shadow">
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
                                <span>{delivery.pickupLocation}</span>
                              </div>
                              <div className="flex items-start mt-1">
                                <MapPin className="h-4 w-4 text-secondary mr-1 flex-shrink-0 mt-0.5" />
                                <span>{delivery.dropLocation}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex flex-col items-end">
                          <div className="text-lg font-semibold text-secondary">
                            ${delivery.price.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {delivery.date} • {delivery.time}
                          </div>
                          <Link to={`/track/${delivery.id}`}>
                            <Button variant="text" size="sm">
                              Track
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      case 'deliveries':
        return (
          <div>
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
                <Button
                  variant="text"
                  className={`${
                    activeTab === 'deliveries-cancelled' ? 'bg-primary/20 text-secondary' : ''
                  }`}
                  onClick={() => setActiveTab('deliveries-cancelled')}
                >
                  Cancelled
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {deliveries.length === 0 ? (
                <p className="text-center text-gray-600">No deliveries available.</p>
              ) : (
                deliveries
                  .filter((delivery) => {
                    if (activeTab === 'deliveries') return true;
                    if (activeTab === 'deliveries-active')
                      return ['pending', 'accepted', 'in-progress'].includes(delivery.status);
                    if (activeTab === 'deliveries-completed') return delivery.status === 'completed';
                    if (activeTab === 'deliveries-cancelled') return delivery.status === 'cancelled';
                    return true;
                  })
                  .map((delivery) => (
                    <Card key={delivery.id} className="hover:shadow-md transition-shadow">
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
                                <span>{delivery.pickupLocation}</span>
                              </div>
                              <div className="flex items-start mt-1">
                                <MapPin className="h-4 w-4 text-secondary mr-1 flex-shrink-0 mt-0.5" />
                                <span>{delivery.dropLocation}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex flex-col items-end">
                          <div className="text-lg font-semibold text-secondary">
                            ${delivery.price.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {delivery.date} • {delivery.time}
                          </div>
                          <div className="mt-2 flex space-x-2">
                            <Link to={`/track/${delivery.id}`}>
                              <Button variant="secondary" size="sm">
                                Track
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm">
                              Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
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
                  <span>My Deliveries</span>
                </button>
                <button
                  className={`flex items-center px-4 py-3 rounded-md ${
                    activeTab === 'payments'
                      ? 'bg-primary/20 text-secondary'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('payments')}
                >
                  <CreditCard className="h-5 w-5 mr-3" />
                  <span>Payment Methods</span>
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
                    activeTab === 'notifications'
                      ? 'bg-primary/20 text-secondary'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <Bell className="h-5 w-5 mr-3" />
                  <span>Notifications</span>
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
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link to="/book">
                  <Button variant="secondary" fullWidth>
                    Book a Delivery
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 md:ml-8">
            <Card className="mb-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-secondary">
                  {activeTab === 'overview' && 'Dashboard'}
                  {activeTab.includes('deliveries') && 'My Deliveries'}
                  {activeTab === 'payments' && 'Payment Methods'}
                  {activeTab === 'profile' && 'Profile'}
                  {activeTab === 'notifications' && 'Notifications'}
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
                      {user?.name}
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

export default UserDashboard;