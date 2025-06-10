import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Upload, 
  FileText, 
  CreditCard, 
  Truck,
  ArrowLeft,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PartnerRegistrationPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Documents
    aadhaarNumber: '',
    aadhaarFront: '',
    aadhaarBack: '',
    licenseNumber: '',
    licenseFront: '',
    licenseBack: '',
    licenseExpiry: '',
    profilePhoto: '',
    
    // Vehicle Information
    vehicleType: '',
    vehicleModel: '',
    registrationNumber: '',
    registrationImage: '',
    insuranceNumber: '',
    insuranceExpiry: '',
    insuranceImage: '',
    
    // Bank Details
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
  });

  const vehicleTypes = [
    { id: 'bike', name: 'Two-Wheeler', description: 'Motorcycle/Scooter' },
    { id: 'auto', name: 'Auto Rickshaw', description: 'Three-wheeler' },
    { id: 'car', name: 'Car', description: 'Four-wheeler' },
    { id: 'van', name: 'Van', description: 'Small commercial vehicle' },
    { id: 'truck', name: 'Mini Truck', description: 'Small truck' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (field: string) => {
    // In a real app, this would handle file upload to cloud storage
    toast.success('File uploaded successfully');
    handleInputChange(field, 'uploaded_file_url');
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.fullName && formData.email && formData.phone && formData.address);
      case 2:
        return !!(formData.aadhaarNumber && formData.licenseNumber);
      case 3:
        return !!(formData.vehicleType && formData.vehicleModel && formData.registrationNumber);
      case 4:
        return !!(formData.accountHolderName && formData.accountNumber && formData.ifscCode);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast.error('Please fill in all required fields');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would submit to the backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Partner registration submitted successfully!');
      setCurrentStep(5);
    } catch (error) {
      toast.error('Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                icon={<User className="h-5 w-5 text-gray-400" />}
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                icon={<Mail className="h-5 w-5 text-gray-400" />}
                required
              />
            </div>
            
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              icon={<Phone className="h-5 w-5 text-gray-400" />}
              required
            />
            
            <Input
              label="Complete Address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              icon={<MapPin className="h-5 w-5 text-gray-400" />}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
              />
              <Input
                label="State"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                required
              />
              <Input
                label="PIN Code"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary">Document Verification</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-secondary mb-4">Aadhaar Card</h3>
                <Input
                  label="Aadhaar Number"
                  value={formData.aadhaarNumber}
                  onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                  placeholder="1234 5678 9012"
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aadhaar Front Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <Button
                        variant="outline"
                        onClick={() => handleFileUpload('aadhaarFront')}
                      >
                        Upload Front
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aadhaar Back Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <Button
                        variant="outline"
                        onClick={() => handleFileUpload('aadhaarBack')}
                      >
                        Upload Back
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-secondary mb-4">Driving License</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="License Number"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    required
                  />
                  <Input
                    label="License Expiry Date"
                    type="date"
                    value={formData.licenseExpiry}
                    onChange={(e) => handleInputChange('licenseExpiry', e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Front Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <Button
                        variant="outline"
                        onClick={() => handleFileUpload('licenseFront')}
                      >
                        Upload Front
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Back Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <Button
                        variant="outline"
                        onClick={() => handleFileUpload('licenseBack')}
                      >
                        Upload Back
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-secondary mb-4">Profile Photo</h3>
                <div className="max-w-xs">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <Button
                      variant="outline"
                      onClick={() => handleFileUpload('profilePhoto')}
                    >
                      Upload Photo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary">Vehicle Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Select Vehicle Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicleTypes.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                      formData.vehicleType === vehicle.id
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                    onClick={() => handleInputChange('vehicleType', vehicle.id)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Truck className="h-8 w-8 text-secondary mb-2" />
                      <h4 className="font-medium text-secondary">{vehicle.name}</h4>
                      <p className="text-sm text-gray-500">{vehicle.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Vehicle Model"
                value={formData.vehicleModel}
                onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                placeholder="e.g., Honda Activa, Maruti Swift"
                required
              />
              <Input
                label="Registration Number"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                placeholder="e.g., DL01AB1234"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Certificate
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <Button
                  variant="outline"
                  onClick={() => handleFileUpload('registrationImage')}
                >
                  Upload RC
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Insurance Number"
                value={formData.insuranceNumber}
                onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
                required
              />
              <Input
                label="Insurance Expiry Date"
                type="date"
                value={formData.insuranceExpiry}
                onChange={(e) => handleInputChange('insuranceExpiry', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insurance Certificate
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <Button
                  variant="outline"
                  onClick={() => handleFileUpload('insuranceImage')}
                >
                  Upload Insurance
                </Button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary">Bank Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Account Holder Name"
                value={formData.accountHolderName}
                onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                icon={<User className="h-5 w-5 text-gray-400" />}
                required
              />
              <Input
                label="Bank Name"
                value={formData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Account Number"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                icon={<CreditCard className="h-5 w-5 text-gray-400" />}
                required
              />
              <Input
                label="IFSC Code"
                value={formData.ifscCode}
                onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                required
              />
            </div>

            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-secondary">Important Note</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Your bank details will be used for payment settlements. Please ensure all information is accurate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-secondary">Registration Submitted!</h2>
            
            <p className="text-gray-600 max-w-md mx-auto">
              Your partner registration has been submitted successfully. Our team will review your application and get back to you within 24-48 hours.
            </p>
            
            <div className="bg-primary/10 p-4 rounded-lg">
              <h3 className="font-medium text-secondary mb-2">What's Next?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Document verification (24-48 hours)</li>
                <li>• Background check</li>
                <li>• Account activation</li>
                <li>• Welcome kit and training materials</li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                onClick={() => navigate('/partner/dashboard')}
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background-light py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Card className="text-center p-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">
              Please login to continue with partner registration.
            </p>
            <Link to="/login">
              <Button variant="secondary" fullWidth>
                Login
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-secondary hover:text-primary">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Home
          </Link>
          
          <h1 className="text-3xl font-bold text-secondary mt-4">Become a Delivery Partner</h1>
          <p className="text-gray-600">
            Join our network of delivery partners and start earning today
          </p>
        </div>

        {/* Progress Steps */}
        {currentStep < 5 && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex-1 ${step !== 4 ? 'relative' : ''}`}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        currentStep >= step
                          ? 'bg-secondary text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step === 1 && <User className="h-5 w-5" />}
                      {step === 2 && <FileText className="h-5 w-5" />}
                      {step === 3 && <Truck className="h-5 w-5" />}
                      {step === 4 && <CreditCard className="h-5 w-5" />}
                    </div>
                    {step !== 4 && (
                      <div
                        className={`hidden md:block h-0.5 w-full mt-5 ${
                          currentStep > step ? 'bg-secondary' : 'bg-gray-200'
                        }`}
                      />
                    )}
                    <div className="text-center mt-2">
                      <div
                        className={`text-sm font-medium ${
                          currentStep >= step ? 'text-secondary' : 'text-gray-500'
                        }`}
                      >
                        {step === 1 && 'Personal'}
                        {step === 2 && 'Documents'}
                        {step === 3 && 'Vehicle'}
                        {step === 4 && 'Bank Details'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Card>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {renderStepContent()}

            {currentStep < 5 && (
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                {currentStep < 4 ? (
                  <Button
                    variant="secondary"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </Card>
      </div>
    </div>
  );
};

export default PartnerRegistrationPage;