import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TruckIcon,
  Upload,
  CheckCircle,
  AlertTriangle,
  Camera,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Shield,
  X,
  ChevronRight,
  Info
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface FormData {
  // Personal Information
  fullName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  
  // Vehicle Information
  vehicleType: string;
  vehicleNumber: string;
  vehicleMake: string;
  vehicleModel: string;
  fuelType: string;
  rcNumber: string;
  rcImage: File | null;
  insuranceNumber: string;
  insuranceExpiry: string;
  insuranceImage: File | null;
  
  // Identity Documents
  aadhaarNumber: string;
  aadhaarFrontImage: File | null;
  aadhaarBackImage: File | null;
  licenseNumber: string;
  licenseExpiry: string;
  licenseFrontImage: File | null;
  licenseBackImage: File | null;
  panNumber: string;
  panImage: File | null;
  
  // Profile Photos
  profilePhoto: File | null;
  vehiclePhoto: File | null;
  selfieWithId: File | null;
  
  // Terms
  agreeTerms: boolean;
  agreeBackground: boolean;
}

const PartnerRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [currentPhotoType, setCurrentPhotoType] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: user?.name || '',
    dateOfBirth: '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    vehicleType: '',
    vehicleNumber: '',
    vehicleMake: '',
    vehicleModel: '',
    fuelType: '',
    rcNumber: '',
    rcImage: null,
    insuranceNumber: '',
    insuranceExpiry: '',
    insuranceImage: null,
    
    aadhaarNumber: '',
    aadhaarFrontImage: null,
    aadhaarBackImage: null,
    licenseNumber: '',
    licenseExpiry: '',
    licenseFrontImage: null,
    licenseBackImage: null,
    panNumber: '',
    panImage: null,
    
    profilePhoto: null,
    vehiclePhoto: null,
    selfieWithId: null,
    
    agreeTerms: false,
    agreeBackground: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const vehicleTypes = [
    { id: 'bike', name: 'Bike/Scooter', icon: '🛵' },
    { id: 'auto', name: 'Auto Rickshaw', icon: '🛺' },
    { id: 'car', name: 'Car', icon: '🚗' },
    { id: 'van', name: 'Van', icon: '🚐' },
    { id: 'truck', name: 'Mini Truck', icon: '🚛' },
  ];

  const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Electric'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when field is edited
    if (errors[name as keyof FormData]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof FormData) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, [fieldName]: file });
    
    // Clear error when field is edited
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: '' });
    }
  };

  const startCamera = async (photoType: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCurrentPhotoType(photoType);
      setShowCamera(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      toast.error('Could not access camera. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `${currentPhotoType}.jpg`, { type: 'image/jpeg' });
            setFormData({ ...formData, [currentPhotoType]: file });
          }
        }, 'image/jpeg');
      }
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
    setCurrentPhotoType('');
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Please enter a valid 10-digit phone number';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.pincode.trim()) newErrors.pincode = 'PIN code is required';
    } else if (step === 2) {
      if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle type is required';
      if (!formData.vehicleNumber.trim()) newErrors.vehicleNumber = 'Vehicle number is required';
      if (!formData.rcNumber.trim()) newErrors.rcNumber = 'RC number is required';
      if (!formData.rcImage) newErrors.rcImage = 'RC image is required';
    } else if (step === 3) {
      if (!formData.aadhaarNumber.trim()) newErrors.aadhaarNumber = 'Aadhaar number is required';
      if (!/^\d{12}$/.test(formData.aadhaarNumber)) newErrors.aadhaarNumber = 'Please enter a valid 12-digit Aadhaar number';
      if (!formData.aadhaarFrontImage) newErrors.aadhaarFrontImage = 'Aadhaar front image is required';
      if (!formData.aadhaarBackImage) newErrors.aadhaarBackImage = 'Aadhaar back image is required';
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
      if (!formData.licenseFrontImage) newErrors.licenseFrontImage = 'License front image is required';
      if (!formData.licenseBackImage) newErrors.licenseBackImage = 'License back image is required';
    } else if (step === 4) {
      if (!formData.profilePhoto) newErrors.profilePhoto = 'Profile photo is required';
      if (!formData.vehiclePhoto) newErrors.vehiclePhoto = 'Vehicle photo is required';
      if (!formData.selfieWithId) newErrors.selfieWithId = 'Selfie with ID is required';
      if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms and conditions';
      if (!formData.agreeBackground) newErrors.agreeBackground = 'You must agree to the background verification';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call to submit the partner registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      
      // Reset form after 5 seconds and redirect
      setTimeout(() => {
        navigate('/partner/dashboard');
      }, 5000);
    } catch (error) {
      console.error('Error submitting partner registration:', error);
      toast.error('Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-secondary mb-4">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                error={errors.fullName}
                icon={<User className="h-5 w-5 text-gray-400" />}
                required
              />
              
              <Input
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                error={errors.dateOfBirth}
                icon={<Calendar className="h-5 w-5 text-gray-400" />}
                required
              />
              
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                icon={<Phone className="h-5 w-5 text-gray-400" />}
                required
              />
              
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                icon={<Mail className="h-5 w-5 text-gray-400" />}
                required
              />
            </div>
            
            <div className="space-y-4">
              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                error={errors.address}
                icon={<MapPin className="h-5 w-5 text-gray-400" />}
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  error={errors.city}
                />
                
                <Input
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  error={errors.state}
                />
                
                <Input
                  label="PIN Code"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  error={errors.pincode}
                  required
                />
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-md flex items-start">
              <Info className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                Please ensure all information provided matches your official documents. This will be verified during the onboarding process.
              </p>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-secondary mb-4">Vehicle Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {vehicleTypes.map((type) => (
                  <motion.div
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                      formData.vehicleType === type.id
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                    onClick={() => handleInputChange({
                      target: { name: 'vehicleType', value: type.id }
                    } as any)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <span className="text-3xl mb-2">{type.icon}</span>
                      <span className="text-sm font-medium">{type.name}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              {errors.vehicleType && (
                <p className="mt-1 text-sm text-red-600">{errors.vehicleType}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Vehicle Number"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleInputChange}
                error={errors.vehicleNumber}
                placeholder="e.g., DL01AB1234"
                required
              />
              
              <Input
                label="Vehicle Make"
                name="vehicleMake"
                value={formData.vehicleMake}
                onChange={handleInputChange}
                error={errors.vehicleMake}
                placeholder="e.g., Honda, TVS"
                required
              />
              
              <Input
                label="Vehicle Model"
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleInputChange}
                error={errors.vehicleModel}
                placeholder="e.g., Activa 6G"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                >
                  <option value="">Select Fuel Type</option>
                  {fuelTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.fuelType && (
                  <p className="mt-1 text-sm text-red-600">{errors.fuelType}</p>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-secondary mb-4">Vehicle Documents</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="RC Number"
                    name="rcNumber"
                    value={formData.rcNumber}
                    onChange={handleInputChange}
                    error={errors.rcNumber}
                    required
                  />
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RC Image
                    </label>
                    <div className={`border-2 border-dashed rounded-md p-4 ${
                      errors.rcImage ? 'border-red-500' : 'border-gray-300'
                    }`}>
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400 mb-2">JPG, PNG or PDF (max 5MB)</p>
                        <input
                          type="file"
                          id="rcImage"
                          name="rcImage"
                          accept=".jpg,.jpeg,.png,.pdf"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, 'rcImage')}
                        />
                        <label
                          htmlFor="rcImage"
                          className="px-4 py-2 bg-primary text-secondary rounded-md cursor-pointer"
                        >
                          Select File
                        </label>
                        {formData.rcImage && (
                          <p className="mt-2 text-sm text-gray-600">
                            Selected: {formData.rcImage.name}
                          </p>
                        )}
                      </div>
                    </div>
                    {errors.rcImage && (
                      <p className="mt-1 text-sm text-red-600">{errors.rcImage}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Input
                    label="Insurance Number"
                    name="insuranceNumber"
                    value={formData.insuranceNumber}
                    onChange={handleInputChange}
                    error={errors.insuranceNumber}
                    required
                  />
                  
                  <Input
                    label="Insurance Expiry Date"
                    name="insuranceExpiry"
                    type="date"
                    value={formData.insuranceExpiry}
                    onChange={handleInputChange}
                    error={errors.insuranceExpiry}
                    required
                  />
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Insurance Image
                    </label>
                    <div className={`border-2 border-dashed rounded-md p-4 ${
                      errors.insuranceImage ? 'border-red-500' : 'border-gray-300'
                    }`}>
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400 mb-2">JPG, PNG or PDF (max 5MB)</p>
                        <input
                          type="file"
                          id="insuranceImage"
                          name="insuranceImage"
                          accept=".jpg,.jpeg,.png,.pdf"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, 'insuranceImage')}
                        />
                        <label
                          htmlFor="insuranceImage"
                          className="px-4 py-2 bg-primary text-secondary rounded-md cursor-pointer"
                        >
                          Select File
                        </label>
                        {formData.insuranceImage && (
                          <p className="mt-2 text-sm text-gray-600">
                            Selected: {formData.insuranceImage.name}
                          </p>
                        )}
                      </div>
                    </div>
                    {errors.insuranceImage && (
                      <p className="mt-1 text-sm text-red-600">{errors.insuranceImage}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-secondary mb-4">Identity Verification</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-secondary mb-4">Aadhaar Card</h3>
                
                <Input
                  label="Aadhaar Number"
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={handleInputChange}
                  error={errors.aadhaarNumber}
                  placeholder="12-digit Aadhaar number"
                  required
                />
                
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aadhaar Front
                    </label>
                    <div className={`border-2 border-dashed rounded-md p-4 ${
                      errors.aadhaarFrontImage ? 'border-red-500' : 'border-gray-300'
                    }`}>
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400 mb-2">JPG or PNG (max 5MB)</p>
                        <div className="flex gap-2">
                          <input
                            type="file"
                            id="aadhaarFrontImage"
                            name="aadhaarFrontImage"
                            accept=".jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, 'aadhaarFrontImage')}
                          />
                          <label
                            htmlFor="aadhaarFrontImage"
                            className="px-4 py-2 bg-primary text-secondary rounded-md cursor-pointer"
                          >
                            Select File
                          </label>
                          <Button
                            variant="outline"
                            onClick={() => startCamera('aadhaarFrontImage')}
                            icon={<Camera className="h-5 w-5" />}
                          >
                            Use Camera
                          </Button>
                        </div>
                        {formData.aadhaarFrontImage && (
                          <p className="mt-2 text-sm text-gray-600">
                            Selected: {formData.aadhaarFrontImage.name}
                          </p>
                        )}
                      </div>
                    </div>
                    {errors.aadhaarFrontImage && (
                      <p className="mt-1 text-sm text-red-600">{errors.aadhaarFrontImage}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aadhaar Back
                    </label>
                    <div className={`border-2 border-dashed rounded-md p-4 ${
                      errors.aadhaarBackImage ? 'border-red-500' : 'border-gray-300'
                    }`}>
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400 mb-2">JPG or PNG (max 5MB)</p>
                        <div className="flex gap-2">
                          <input
                            type="file"
                            id="aadhaarBackImage"
                            name="aadhaarBackImage"
                            accept=".jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, 'aadhaarBackImage')}
                          />
                          <label
                            htmlFor="aadhaarBackImage"
                            className="px-4 py-2 bg-primary text-secondary rounded-md cursor-pointer"
                          >
                            Select File
                          </label>
                          <Button
                            variant="outline"
                            onClick={() => startCamera('aadhaarBackImage')}
                            icon={<Camera className="h-5 w-5" />}
                          >
                            Use Camera
                          </Button>
                        </div>
                        {formData.aadhaarBackImage && (
                          <p className="mt-2 text-sm text-gray-600">
                            Selected: {formData.aadhaarBackImage.name}
                          </p>
                        )}
                      </div>
                    </div>
                    {errors.aadhaarBackImage && (
                      <p className="mt-1 text-sm text-red-600">{errors.aadhaarBackImage}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-secondary mb-4">Driving License</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="License Number"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    error={errors.licenseNumber}
                    required
                  />
                  
                  <Input
                    label="License Expiry"
                    name="licenseExpiry"
                    type="date"
                    value={formData.licenseExpiry}
                    onChange={handleInputChange}
                    error={errors.licenseExpiry}
                    required
                  />
                </div>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Front
                    </label>
                    <div className={`border-2 border-dashed rounded-md p-4 ${
                      errors.licenseFrontImage ? 'border-red-500' : 'border-gray-300'
                    }`}>
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400 mb-2">JPG or PNG (max 5MB)</p>
                        <div className="flex gap-2">
                          <input
                            type="file"
                            id="licenseFrontImage"
                            name="licenseFrontImage"
                            accept=".jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, 'licenseFrontImage')}
                          />
                          <label
                            htmlFor="licenseFrontImage"
                            className="px-4 py-2 bg-primary text-secondary rounded-md cursor-pointer"
                          >
                            Select File
                          </label>
                          <Button
                            variant="outline"
                            onClick={() => startCamera('licenseFrontImage')}
                            icon={<Camera className="h-5 w-5" />}
                          >
                            Use Camera
                          </Button>
                        </div>
                        {formData.licenseFrontImage && (
                          <p className="mt-2 text-sm text-gray-600">
                            Selected: {formData.licenseFrontImage.name}
                          </p>
                        )}
                      </div>
                    </div>
                    {errors.licenseFrontImage && (
                      <p className="mt-1 text-sm text-red-600">{errors.licenseFrontImage}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Back
                    </label>
                    <div className={`border-2 border-dashed rounded-md p-4 ${
                      errors.licenseBackImage ? 'border-red-500' : 'border-gray-300'
                    }`}>
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400 mb-2">JPG or PNG ( max 5MB)</p>
                        <div className="flex gap-2">
                          <input
                            type="file"
                            id="licenseBackImage"
                            name="licenseBackImage"
                            accept=".jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, 'licenseBackImage')}
                          />
                          <label
                            htmlFor="licenseBackImage"
                            className="px-4 py-2 bg-primary text-secondary rounded-md cursor-pointer"
                          >
                            Select File
                          </label>
                          <Button
                            variant="outline"
                            onClick={() => startCamera('licenseBackImage')}
                            icon={<Camera className="h-5 w-5" />}
                          >
                            Use Camera
                          </Button>
                        </div>
                        {formData.licenseBackImage && (
                          <p className="mt-2 text-sm text-gray-600">
                            Selected: {formData.licenseBackImage.name}
                          </p>
                        )}
                      </div>
                    </div>
                    {errors.licenseBackImage && (
                      <p className="mt-1 text-sm text-red-600">{errors.licenseBackImage}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-secondary mb-4">PAN Card (Optional)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="PAN Number"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleInputChange}
                  error={errors.panNumber}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PAN Card Image
                  </label>
                  <div className="border-2 border-dashed rounded-md p-4 border-gray-300">
                    <div className="flex flex-col items-center">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-400 mb-2">JPG or PNG (max 5MB)</p>
                      <div className="flex gap-2">
                        <input
                          type="file"
                          id="panImage"
                          name="panImage"
                          accept=".jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, 'panImage')}
                        />
                        <label
                          htmlFor="panImage"
                          className="px-4 py-2 bg-primary text-secondary rounded-md cursor-pointer"
                        >
                          Select File
                        </label>
                        <Button
                          variant="outline"
                          onClick={() => startCamera('panImage')}
                          icon={<Camera className="h-5 w-5" />}
                        >
                          Use Camera
                        </Button>
                      </div>
                      {formData.panImage && (
                        <p className="mt-2 text-sm text-gray-600">
                          Selected: {formData.panImage.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-md flex items-start">
              <AlertTriangle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                Please ensure all documents are clear, valid, and not expired. Blurry or expired documents will delay your verification process.
              </p>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-secondary mb-4">Profile Photos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Photo
                </label>
                <div className={`border-2 border-dashed rounded-md p-4 ${
                  errors.profilePhoto ? 'border-red-500' : 'border-gray-300'
                }`}>
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Front-facing clear photo</p>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        id="profilePhoto"
                        name="profilePhoto"
                        accept=".jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'profilePhoto')}
                      />
                      <label
                        htmlFor="profilePhoto"
                        className="px-4 py-2 bg-primary text-secondary rounded-md cursor-pointer"
                      >
                        Select File
                      </label>
                      <Button
                        variant="outline"
                        onClick={() => startCamera('profilePhoto')}
                        icon={<Camera className="h-5 w-5" />}
                      >
                        Use Camera
                      </Button>
                    </div>
                    {formData.profilePhoto && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected: {formData.profilePhoto.name}
                      </p>
                    )}
                  </div>
                </div>
                {errors.profilePhoto && (
                  <p className="mt-1 text-sm text-red-600">{errors.profilePhoto}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Photo
                </label>
                <div className={`border-2 border-dashed rounded-md p-4 ${
                  errors.vehiclePhoto ? 'border-red-500' : 'border-gray-300'
                }`}>
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Clear photo with number plate visible</p>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        id="vehiclePhoto"
                        name="vehiclePhoto"
                        accept=".jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'vehiclePhoto')}
                      />
                      <label
                        htmlFor="vehiclePhoto"
                        className="px-4 py-2 bg-primary text-secondary rounded-md cursor-pointer"
                      >
                        Select File
                      </label>
                      <Button
                        variant="outline"
                        onClick={() => startCamera('vehiclePhoto')}
                        icon={<Camera className="h-5 w-5" />}
                      >
                        Use Camera
                      </Button>
                    </div>
                    {formData.vehiclePhoto && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected: {formData.vehiclePhoto.name}
                      </p>
                    )}
                  </div>
                </div>
                {errors.vehiclePhoto && (
                  <p className="mt-1 text-sm text-red-600">{errors.vehiclePhoto}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selfie with ID
                </label>
                <div className={`border-2 border-dashed rounded-md p-4 ${
                  errors.selfieWithId ? 'border-red-500' : 'border-gray-300'
                }`}>
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Hold your ID next to your face</p>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        id="selfieWithId"
                        name="selfieWithId"
                        accept=".jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'selfieWithId')}
                      />
                      <label
                        htmlFor="selfieWithId"
                        className="px-4 py-2 bg-primary text-secondary rounded-md cursor-pointer"
                      >
                        Select File
                      </label>
                      <Button
                        variant="outline"
                        onClick={() => startCamera('selfieWithId')}
                        icon={<Camera className="h-5 w-5" />}
                      >
                        Use Camera
                      </Button>
                    </div>
                    {formData.selfieWithId && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected: {formData.selfieWithId.name}
                      </p>
                    )}
                  </div>
                </div>
                {errors.selfieWithId && (
                  <p className="mt-1 text-sm text-red-600">{errors.selfieWithId}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-4 mt-8">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeTerms" className="font-medium text-gray-700">
                    I agree to the Terms of Service, Privacy Policy, and Partner Guidelines
                  </label>
                  {errors.agreeTerms && (
                    <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeBackground"
                    name="agreeBackground"
                    type="checkbox"
                    checked={formData.agreeBackground}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeBackground" className="font-medium text-gray-700">
                    I agree to background verification and understand that my application may be rejected based on the verification results
                  </label>
                  {errors.agreeBackground && (
                    <p className="mt-1 text-sm text-red-600">{errors.agreeBackground}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-md flex items-start">
              <Shield className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                Your information is secure and will only be used for verification purposes. We follow strict data protection guidelines.
              </p>
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
          <TruckIcon className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-3xl font-bold text-secondary mt-2">Become a KARTER Partner</h1>
          <p className="mt-2 text-gray-600">
            Join our network of delivery partners and earn money on your own schedule
          </p>
        </div>

        {showSuccess ? (
          <Card className="text-center py-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-secondary mb-2">Registration Successful!</h2>
              <p className="text-gray-600 mb-6">
                Your application has been submitted successfully. Our team will review your details and documents.
              </p>
              <p className="text-gray-600 mb-6">
                You will receive an email notification once your application is approved.
              </p>
              <Button
                variant="secondary"
                onClick={() => navigate('/partner/dashboard')}
              >
                Go to Dashboard
              </Button>
            </div>
          </Card>
        ) : (
          <>
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
                        {step === 1 && <User className="h-5 w-5" />}
                        {step === 2 && <TruckIcon className="h-5 w-5" />}
                        {step === 3 && <FileText className="h-5 w-5" />}
                        {step === 4 && <Camera className="h-5 w-5" />}
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
                          {step === 1 && 'Personal Info'}
                          {step === 2 && 'Vehicle'}
                          {step === 3 && 'Identity'}
                          {step === 4 && 'Photos'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card>
              <form onSubmit={handleSubmit}>
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
                      disabled={isSubmitting}
                      icon={<CheckCircle className="h-5 w-5" />}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  )}
                </motion.div>
              </form>
            </Card>
          </>
        )}
      </div>

      {/* Camera Modal */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-secondary">Take Photo</h3>
                <button
                  onClick={stopCamera}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
                <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none"></div>
              </div>
              
              <div className="mt-4 flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={stopCamera}
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={capturePhoto}
                  icon={<Camera className="h-5 w-5" />}
                >
                  Capture
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PartnerRegistrationPage;