import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, DollarSign, CheckCircle } from 'lucide-react';
import { PaymentMethod } from '../../types';
import usePaymentStore from '../../store/usePaymentStore';
import Button from '../common/Button';

interface PaymentSummaryProps {
  selectedMethod: PaymentMethod | null;
  onProceed: () => void;
  isProcessing: boolean;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ 
  selectedMethod, 
  onProceed,
  isProcessing
}) => {
  const { priceBreakdown } = usePaymentStore();

  if (!priceBreakdown) {
    return null;
  }

  const getPaymentMethodIcon = () => {
    switch (selectedMethod) {
      case 'card':
        return <CreditCard className="h-6 w-6 text-secondary" />;
      case 'wallet':
        return <Wallet className="h-6 w-6 text-secondary" />;
      case 'upi':
        return <DollarSign className="h-6 w-6 text-secondary" />;
      default:
        return null;
    }
  };

  const getPaymentMethodName = () => {
    switch (selectedMethod) {
      case 'card':
        return 'Credit/Debit Card';
      case 'wallet':
        return 'Wallet';
      case 'upi':
        return 'UPI';
      case 'cash':
        return 'Cash';
      case 'paypal':
        return 'PayPal';
      case 'razorpay':
        return 'Razorpay';
      default:
        return 'Select a payment method';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h3 className="text-xl font-semibold text-secondary mb-4">Payment Summary</h3>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Amount</span>
          <span className="text-xl font-bold text-secondary">₹{priceBreakdown.total.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <p className="text-gray-600 mb-2">Payment Method</p>
          {selectedMethod ? (
            <div className="flex items-center p-3 bg-gray-50 rounded-md">
              {getPaymentMethodIcon()}
              <span className="ml-2 font-medium">{getPaymentMethodName()}</span>
            </div>
          ) : (
            <div className="text-red-500">No payment method selected</div>
          )}
        </div>
        
        <div className="bg-green-50 p-3 rounded-md">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
            <div>
              <p className="font-medium text-green-800">Secure Payment</p>
              <p className="text-sm text-green-700">
                Your payment information is encrypted and secure
              </p>
            </div>
          </div>
        </div>
        
        <Button
          variant="secondary"
          fullWidth
          disabled={!selectedMethod || isProcessing}
          onClick={onProceed}
        >
          {isProcessing ? 'Processing...' : 'Proceed to Payment'}
        </Button>
        
        <p className="text-xs text-center text-gray-500">
          By proceeding, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </motion.div>
  );
};

export default PaymentSummary;