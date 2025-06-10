import React, { useState } from 'react';
import { CreditCard, Wallet, DollarSign, Plus, Check, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import usePaymentStore from '../../store/usePaymentStore';
import { PaymentMethod } from '../../types';
import Button from '../common/Button';

interface PaymentMethodSelectorProps {
  onSelect: (method: PaymentMethod) => void;
  selectedMethod: PaymentMethod | null;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  onSelect, 
  selectedMethod 
}) => {
  const { 
    savedPaymentMethods, 
    addPaymentMethod, 
    removePaymentMethod, 
    setDefaultPaymentMethod 
  } = usePaymentStore();
  
  const [showAddNew, setShowAddNew] = useState(false);
  const [newCardName, setNewCardName] = useState('');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');
  const [newUpiId, setNewUpiId] = useState('');
  const [addingMethod, setAddingMethod] = useState<PaymentMethod | null>(null);

  const handleMethodSelect = (method: PaymentMethod) => {
    onSelect(method);
  };

  const handleAddNewMethod = (type: PaymentMethod) => {
    setAddingMethod(type);
    setShowAddNew(true);
  };

  const handleSaveNewMethod = () => {
    if (addingMethod === 'card') {
      if (!newCardName || !newCardNumber || !newCardExpiry || !newCardCvv) {
        return; // Validation failed
      }
      
      addPaymentMethod({
        type: 'card',
        name: newCardName,
        last4: newCardNumber.slice(-4),
        expiryDate: newCardExpiry,
        isDefault: savedPaymentMethods.length === 0
      });
      
      // Reset form
      setNewCardName('');
      setNewCardNumber('');
      setNewCardExpiry('');
      setNewCardCvv('');
    } else if (addingMethod === 'upi') {
      if (!newUpiId) {
        return; // Validation failed
      }
      
      addPaymentMethod({
        type: 'upi',
        name: newUpiId,
        isDefault: savedPaymentMethods.length === 0
      });
      
      // Reset form
      setNewUpiId('');
    }
    
    setShowAddNew(false);
    setAddingMethod(null);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setNewCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    
    setNewCardExpiry(value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-secondary mb-4">Payment Method</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedPaymentMethods.map((method) => (
          <motion.div
            key={method.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedMethod === method.type && method.isDefault
                ? 'border-secondary bg-secondary/10'
                : 'border-gray-300 hover:border-primary'
            }`}
            onClick={() => handleMethodSelect(method.type)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {method.type === 'card' && <CreditCard className="h-6 w-6 text-secondary mr-2" />}
                {method.type === 'upi' && <DollarSign className="h-6 w-6 text-secondary mr-2" />}
                {method.type === 'wallet' && <Wallet className="h-6 w-6 text-secondary mr-2" />}
                <div>
                  <p className="font-medium">
                    {method.type === 'card' 
                      ? `${method.name} •••• ${method.last4}` 
                      : method.name}
                  </p>
                  {method.type === 'card' && (
                    <p className="text-sm text-gray-500">Expires {method.expiryDate}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {method.isDefault && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Default
                  </span>
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removePaymentMethod(method.id);
                  }}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Add New Payment Method Button */}
        {!showAddNew && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary"
            onClick={() => setShowAddNew(true)}
          >
            <Plus className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-600">Add Payment Method</p>
          </motion.div>
        )}
      </div>
      
      {/* Add New Payment Method Form */}
      {showAddNew && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 border border-gray-300 rounded-lg p-6"
        >
          <h4 className="text-lg font-medium text-secondary mb-4">Add New Payment Method</h4>
          
          {/* Method Type Selection */}
          {!addingMethod && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:border-primary hover:bg-primary/5"
                onClick={() => handleAddNewMethod('card')}
              >
                <CreditCard className="h-8 w-8 text-secondary mb-2" />
                <p className="font-medium">Credit/Debit Card</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:border-primary hover:bg-primary/5"
                onClick={() => handleAddNewMethod('upi')}
              >
                <DollarSign className="h-8 w-8 text-secondary mb-2" />
                <p className="font-medium">UPI</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:border-primary hover:bg-primary/5"
                onClick={() => handleMethodSelect('wallet')}
              >
                <Wallet className="h-8 w-8 text-secondary mb-2" />
                <p className="font-medium">Wallet</p>
              </motion.div>
            </div>
          )}
          
          {/* Card Form */}
          {addingMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="John Doe"
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  value={newCardNumber}
                  onChange={handleCardNumberChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={newCardExpiry}
                    onChange={handleExpiryChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="123"
                    maxLength={3}
                    value={newCardCvv}
                    onChange={(e) => setNewCardCvv(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* UPI Form */}
          {addingMethod === 'upi' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UPI ID
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="username@bankname"
                value={newUpiId}
                onChange={(e) => setNewUpiId(e.target.value)}
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter your UPI ID in the format username@bankname
              </p>
            </div>
          )}
          
          <div className="mt-6 flex space-x-4">
            <Button
              variant="secondary"
              onClick={handleSaveNewMethod}
            >
              Save
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                setShowAddNew(false);
                setAddingMethod(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}
      
      {/* Quick Payment Options */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Options</h4>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-md border ${
              selectedMethod === 'cash'
                ? 'bg-secondary text-white border-secondary'
                : 'border-gray-300 hover:border-primary'
            }`}
            onClick={() => handleMethodSelect('cash')}
          >
            Cash
          </button>
          
          <button
            className={`px-4 py-2 rounded-md border ${
              selectedMethod === 'wallet'
                ? 'bg-secondary text-white border-secondary'
                : 'border-gray-300 hover:border-primary'
            }`}
            onClick={() => handleMethodSelect('wallet')}
          >
            Wallet
          </button>
          
          <button
            className={`px-4 py-2 rounded-md border ${
              selectedMethod === 'paypal'
                ? 'bg-secondary text-white border-secondary'
                : 'border-gray-300 hover:border-primary'
            }`}
            onClick={() => handleMethodSelect('paypal')}
          >
            PayPal
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;