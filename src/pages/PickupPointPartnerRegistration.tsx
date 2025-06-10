import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, Building, MapPin, ArrowLeft, Upload, Clock } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

const PickupPointPartnerRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    workingHours: '',
    storageSpace: '',
    gstNumber: '',
    panNumber: '',
    storeImages: [] as string[],
    documents: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Here you would typically make an API call to submit the form
      toast.success('Registration submitted successfully! We will contact you shortly.');
    } catch (error) {
      toast.error('Failed to submit registration. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link to="/pickup-points" className="inline-flex items-center text-secondary hover:text-primary">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Pickup Points
          </Link>
          
          <h1 className="text-3xl font-bold text-secondary mt-4">Become a Pickup Point Partner</h1>
          <p className="text-gray-600">
            Fill in the details below to register your location as a KARTER pickup point
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">Business Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Business Name"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Type
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="retail">Retail Store</option>
                    <option value="supermarket">Supermarket</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="bookstore">Bookstore</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Owner Name"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">Location Details</h2>
              <div className="space-y-4">
                <Input
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                  <Input
                    label="Pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    required
                  />
                  <Input
                    label="Working Hours"
                    value={formData.workingHours}
                    onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                    placeholder="e.g., 9 AM - 9 PM"
                    required
                  />
                </div>
                <Input
                  label="Available Storage Space (in sq ft)"
                  type="number"
                  value={formData.storageSpace}
                  onChange={(e) => setFormData({ ...formData, storageSpace: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">Business Documents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="GST Number"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                  required
                />
                <Input
                  label="PAN Number"
                  value={formData.panNumber}
                  onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">Store Images & Documents</h2>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    Upload store images (storefront, storage area, etc.)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      // Handle file upload
                    }}
                  />
                  <Button variant="outline" className="mt-2">
                    Select Files
                  </Button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    Upload business documents (GST certificate, PAN card, etc.)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      // Handle file upload
                    }}
                  />
                  <Button variant="outline" className="mt-2">
                    Select Files
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <Button type="submit" variant="secondary" fullWidth>
                Submit Registration
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PickupPointPartnerRegistration;