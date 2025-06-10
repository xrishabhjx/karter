import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  MapPin, 
  Clock, 
  Calendar, 
  Scale, 
  Box, 
  Shield, 
  CreditCard, 
  ChevronRight, 
  //Info,
  Ruler,
  Briefcase,
  Mail,
  ShoppingBag
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import LocationPicker from '../components/maps/LocationPicker';
import RouteMap from '../components/maps/RouteMap';
import usePaymentStore from '../store/usePaymentStore';
import toast from 'react-hot-toast';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface PackageType {
  id: string;
  name: string;
  icon: React.ReactNode;
  maxWeight: number;
  maxDimensions: {
    length: number;
    width: number;
    height: number;
  };
  description: string;
}

const packageTypes: PackageType[] = [
  {
    id: 'envelope',
    name: 'Envelope/Document',
    icon: <Mail className="h-8 w-8" />,
    maxWeight: 0.5,
    maxDimensions: { length: 30, width: 25, height: 2 },
    description: 'Letters, documents, certificates'
  },
  {
    id: 'small-box',
    name: 'Small Box',
    icon: <Box className="h-8 w-8" />,
    maxWeight: 5,
    maxDimensions: { length: 30, width: 30, height: 30 },
    description: 'Small electronics, books, accessories'
  },
  {
    id: 'medium-box',
    name: 'Medium Box',
    icon: <Package className="h-8 w-8" />,
    maxWeight: 10,
    maxDimensions: { length: 50, width: 50, height: 50 },
    description: 'Medium-sized items, clothing, food'
  },
  {
    id: 'large-box',
    name: 'Large Box',
    icon: <Briefcase className="h-8 w-8" />,
    maxWeight: 20,
    maxDimensions: { length: 100, width: 100, height: 100 },
    description: 'Large items, multiple boxes'
  },
  {
    id: 'bag',
    name: 'Bag/Backpack',
    icon: <ShoppingBag className="h-8 w-8" />,
    maxWeight: 15,
    maxDimensions: { length: 60, width: 40, height: 30 },
    description: 'Shopping bags, backpacks, soft items'
  }
];

const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { calculatePrice, priceBreakdown } = usePaymentStore();

  // Booking steps
  const [currentStep, setCurrentStep] = useState(1);
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [showPickupMap, setShowPickupMap] = useState(false);
  const [showDropoffMap, setShowDropoffMap] = useState(false);
  
  // Package details
  const [selectedPackageType, setSelectedPackageType] = useState<string>('');
  const [packageWeight, setPackageWeight] = useState<string>('');
  const [packageDimensions, setPackageDimensions] = useState({
    length: '',
    width: '',
    height: ''
  });
  const [packageDescription, setPackageDescription] = useState('');
  const [isFragile, setIsFragile] = useState(false);
  const [useProtection, setUseProtection] = useState(false);
  
  // Scheduling
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  
  // Contact details
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [pickupInstructions, setPickupInstructions] = useState('');
  const [dropoffInstructions, setDropoffInstructions] = useState('');

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  // Initialize locations from URL params
  useEffect(() => {
    const fromLocation = searchParams.get('from');
    const toLocation = searchParams.get('to');
    
    if (fromLocation) setPickupLocation({ lat: 0, lng: 0, address: fromLocation });
    if (toLocation) setDropoffLocation({ lat: 0, lng: 0, address: toLocation });
  }, [searchParams]);

  // Calculate price when locations change
  useEffect(() => {
    if (pickupLocation && dropoffLocation) {
      // Calculate distance between points
      const distance = 5; // Mock distance calculation
      const duration = 30; // Mock duration calculation
      calculatePrice(distance, duration, 'bike');
    }
  }, [pickupLocation, dropoffLocation, calculatePrice]);

  const handlePickupLocationSelect = (location: Location) => {
    setPickupLocation(location);
    setShowPickupMap(false);
  };

  const handleDropoffLocationSelect = (location: Location) => {
    setDropoffLocation(location);
    setShowDropoffMap(false);
  };

  const handlePackageTypeSelect = (typeId: string) => {
    setSelectedPackageType(typeId);
    // Reset dimensions if they exceed new package type limits
    const selectedType = packageTypes.find(type => type.id === typeId);
    if (selectedType) {
      setPackageDimensions(prev => ({
        length: Number(prev.length) > selectedType.maxDimensions.length ? '' : prev.length,
        width: Number(prev.width) > selectedType.maxDimensions.width ? '' : prev.width,
        height: Number(prev.height) > selectedType.maxDimensions.height ? '' : prev.height
      }));
      if (Number(packageWeight) > selectedType.maxWeight) {
  setPackageWeight('');
  toast.error(`Maximum weight for ${selectedType.name} is ${selectedType.maxWeight}kg`);
}
    }
  };

  const handleNext = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!pickupLocation || !dropoffLocation) {
        toast.error('Please select both pickup and drop-off locations');
        return;
      }
    } else if (currentStep === 2) {
      if (!selectedPackageType || !packageWeight || !packageDescription) {
        toast.error('Please fill in all package details');
        return;
      }
    } else if (currentStep === 3) {
      if (isScheduled && (!scheduledDate || !scheduledTime)) {
        toast.error('Please select scheduled date and time');
        return;
      }
    }

    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactName || !contactPhone) {
      toast.error('Please provide contact details');
      return;
    }

    try {
      // Submit booking to backend
      toast.success('Booking submitted successfully!');
      navigate('/payment/123'); // Navigate to payment page
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to submit booking. Please try again.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="relative">
              <div className="flex items-center justify-between p-4 ">
                <Input
                  label="Pickup Address"
                  placeholder="Enter complete pickup address"
                  value={pickupLocation?.address || ''}
                  onChange={(e) => setPickupLocation({ ...pickupLocation, address: e.target.value } as Location)}
                  icon={<MapPin className="h-5 w-5 text-gray-400" />}
                  required
                />
                <Button 
                  variant="text" 
                  className="ml-2 mt-6" 
                  onClick={() => setShowPickupMap(true)}
                >
                  Map
                </Button>
              </div>
            </div>
            
            {showPickupMap && (
              <div className="mt-2 mb-4">
                <LocationPicker
                  onLocationSelect={handlePickupLocationSelect}
                  title="Select Pickup Location"
                  buttonText="Confirm Pickup Location"
                />
              </div>
            )}
            
            <div className="relative">
              <div className="flex items-center justify-between p-4">
                <Input
                  label="Drop-off Address"
                  placeholder="Enter complete drop-off address"
                  value={dropoffLocation?.address || ''}
                  onChange={(e) => setDropoffLocation({ ...dropoffLocation, address: e.target.value } as Location)}
                  icon={<MapPin className="h-5 w-5 text-gray-400" />}
                  required
                />
                <Button 
                  variant="text" 
                  className="p-4" 
                  onClick={() => setShowDropoffMap(true)}
                >
                  Map
                </Button>
              </div>
            </div>
            
            {showDropoffMap && (
              <div className="mt-2 mb-4">
                <LocationPicker
                  onLocationSelect={handleDropoffLocationSelect}
                  title="Select Drop-off Location"
                  buttonText="Confirm Drop-off Location"
                />
              </div>
            )}
            
            {pickupLocation && dropoffLocation && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <h3 className="text-lg font-medium text-secondary mb-2">Delivery Route</h3>
                <RouteMap
                  pickup={pickupLocation}
                  dropoff={dropoffLocation}
                  height="300px"
                />
              </motion.div>
            )}
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-secondary mb-4">Select Package Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {packageTypes.map((type) => (
                  <motion.div
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                      selectedPackageType === type.id
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                    onClick={() => handlePackageTypeSelect(type.id)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 bg-primary/20 rounded-full mb-3">
                        {type.icon}
                      </div>
                      <h4 className="font-medium text-secondary">{type.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Up to {type.maxWeight}kg
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Package Weight (kg)"
                  type="number"
                  value={packageWeight}
                  onChange={(e) => setPackageWeight(e.target.value)}
                  icon={<Scale className="h-5 w-5 text-gray-400" />}
                  required
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Package Dimensions (cm)</h4>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="Length"
                    type="number"
                    value={packageDimensions.length}
                    onChange={(e) => setPackageDimensions(prev => ({ ...prev, length: e.target.value }))}
                    icon={<Ruler className="h-5 w-5 text-gray-400" />}
                  />
                  <Input
                    label="Width"
                    type="number"
                    value={packageDimensions.width}
                    onChange={(e) => setPackageDimensions(prev => ({ ...prev, width: e.target.value }))}
                    icon={<Ruler className="h-5 w-5 text-gray-400" />}
                  />
                  <Input
                    label="Height"
                    type="number"
                    value={packageDimensions.height}
                    onChange={(e) => setPackageDimensions(prev => ({ ...prev, height: e.target.value }))}
                    icon={<Ruler className="h-5 w-5 text-gray-400" />}
                  />
                </div>
              </div>
            </div>

            <div>
              <Input
                label="Package Description"
                placeholder="What are you sending? Please provide details."
                value={packageDescription}
                onChange={(e) => setPackageDescription(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFragile}
                  onChange={(e) => setIsFragile(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <span className="text-gray-700">Fragile Item</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useProtection}
                  onChange={(e) => setUseProtection(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <span className="text-gray-700">Add Protection Cover (+ ₹50)</span>
              </label>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-secondary mb-4">Delivery Time</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!isScheduled}
                      onChange={() => setIsScheduled(false)}
                      className="form-radio h-5 w-5 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="text-gray-700">Instant Delivery (ASAP)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={isScheduled}
                      onChange={() => setIsScheduled(true)}
                      className="form-radio h-5 w-5 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="text-gray-700">Schedule for Later</span>
                  </label>
                </div>

                {isScheduled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <Input
                      type="date"
                      label="Date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      icon={<Calendar className="h-5 w-5 text-gray-400" />}
                    />
                    <Input
                      type="time"
                      label="Time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      icon={<Clock className="h-5 w-5 text-gray-400" />}
                    />
                  </motion.div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-secondary mb-4">Pickup Contact</h3>
                <div className="space-y-4">
                  <Input
                    label="Contact Name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                  />
                  <Input
                    label="Pickup Instructions (Optional)"
                    placeholder="Any specific instructions for pickup?"
                    value={pickupInstructions}
                    onChange={(e) => setPickupInstructions(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-secondary mb-4">Drop-off Contact</h3>
                <div className="space-y-4">
                  <Input
                    label="Contact Name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                  />
                  <Input
                    label="Drop-off Instructions (Optional)"
                    placeholder="Any specific instructions for delivery?"
                    value={dropoffInstructions}
                    onChange={(e) => setDropoffInstructions(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-medium text-secondary mb-4">Booking Summary</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Pickup Location</p>
                        <p className="text-gray-700">{pickupLocation?.address}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Drop-off Location</p>
                        <p className="text-gray-700">{dropoffLocation?.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-secondary mb-2">Package Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="font-medium">{packageTypes.find(t => t.id === selectedPackageType)?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Weight</p>
                      <p className="font-medium">{packageWeight} kg</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Description</p>
                      <p className="font-medium">{packageDescription}</p>
                    </div>
                    {isFragile && (
                      <div>
                        <p className="text-amber-600 font-medium">Fragile Item</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
  <h4 className="font-medium text-secondary mb-2">Delivery Time</h4>
  <p className="text-gray-700">
    {isScheduled 
      ? `Scheduled for ${scheduledDate} at ${scheduledTime}`
      : 'Instant Delivery (ASAP)'}
  </p>
</div>


                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-secondary">Price Breakdown</h4>
                    {!promoApplied && (
                      <div className="flex">
                        <Input
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="w-40"
                        />
                        <Button
                          variant="outline"
                          className="ml-2"
                          onClick={() => {
                            toast.success('Promo code applied successfully!');
                            setPromoApplied(true);
                          }}
                          disabled={!promoCode}
                        >
                          Apply
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Fare</span>
                      <span>₹{priceBreakdown?.baseFare.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance Charge</span>
                      <span>₹{priceBreakdown?.distanceFare.toFixed(2)}</span>
                    </div>
                    {useProtection && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Protection Cover</span>
                        <span>₹50.00</span>
                      </div>
                    )}
                    {promoApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Promo Discount</span>
                        <span>-₹50.00</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">GST (18%)</span>
                      <span>₹{priceBreakdown?.tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between font-medium text-lg">
                        <span>Total</span>
                        <span className="text-secondary">₹{priceBreakdown?.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-secondary">Delivery Protection</p>
                  <p className="text-sm text-gray-600">
                    Your package is protected up to ₹10,000 against damage or loss during transit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary">Book a Delivery</h1>
          <p className="mt-2 text-gray-600">
            Fill in the details below to schedule your delivery
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 ${
                  step !== 4 ? 'relative' : ''
                }`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      currentStep >= step
                        ? 'bg-secondary text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step === 1 && <MapPin className="h-5 w-5" />}
                    {step === 2 && <Package className="h-5 w-5" />}
                    {step === 3 && <Clock className="h-5 w-5" />}
                    {step === 4 && <CreditCard className="h-5 w-5" />}
                  </div>
                  <div
                    className={`hidden md:block h-0.5 w-full ${
                      step === 4 ? 'hidden' : 'flex-grow mx-2'
                    } ${
                      currentStep > step ? 'bg-secondary' : 'bg-gray-200'
                    }`}
                  />
                  <div className="text-center mt-2">
                    <div
                      className={`text-sm font-medium ${
                        currentStep >= step ? 'text-secondary' : 'text-gray-500'
                      }`}
                    >
                      {step === 1 && 'Location'}
                      {step === 2 && 'Package'}
                      {step === 3 && 'Schedule'}
                      {step === 4 && 'Summary'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStepContent()}

            <motion.div
              className="mt-8 flex justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleNext}
                  icon={<ChevronRight className="h-5 w-5" />}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="secondary"
                  icon={<CreditCard className="h-5 w-5" />}
                >
                  Proceed to Payment
                </Button>
              )}
            </motion.div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default BookingPage;