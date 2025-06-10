import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Share2 } from 'lucide-react';
import Button from '../common/Button';
import { Link } from 'react-router-dom';

interface PaymentConfirmationProps {
  transactionId: string;
  amount: number;
  date: Date;
  paymentMethod: string;
  onDownloadInvoice: () => void;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  transactionId,
  amount,
  date,
  paymentMethod,
  onDownloadInvoice
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto text-center"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-secondary mb-2">Payment Successful!</h2>
      <p className="text-gray-600 mb-6">
        Your payment has been processed successfully.
      </p>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4 text-left">
          <div>
            <p className="text-sm text-gray-500">Transaction ID</p>
            <p className="font-medium text-secondary">{transactionId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Amount</p>
            <p className="font-medium text-secondary">₹{amount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium text-secondary">{date.toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Payment Method</p>
            <p className="font-medium text-secondary">{paymentMethod}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          variant="outline"
          fullWidth
          icon={<Download className="h-5 w-5 mr-2" />}
          onClick={onDownloadInvoice}
        >
          Download Invoice
        </Button>
        
        <Button
          variant="outline"
          fullWidth
          icon={<Share2 className="h-5 w-5 mr-2" />}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Payment Receipt',
                text: `Payment of ₹${amount.toFixed(2)} completed successfully. Transaction ID: ${transactionId}`,
                url: window.location.href,
              });
            }
          }}
        >
          Share Receipt
        </Button>
      </div>
      
      <div className="space-y-3">
        <Link to="/track">
          <Button variant="secondary" fullWidth>
            Track Your Delivery
          </Button>
        </Link>
        
        <Link to="/book">
          <Button variant="text" fullWidth>
            Book Another Delivery
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default PaymentConfirmation;