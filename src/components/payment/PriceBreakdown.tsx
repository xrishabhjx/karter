import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import usePaymentStore from '../../store/usePaymentStore';

interface PriceBreakdownProps {
  showDetailed?: boolean;
}

const PriceBreakdown: React.FC<PriceBreakdownProps> = ({ showDetailed = false }) => {
  const { priceBreakdown } = usePaymentStore();

  if (!priceBreakdown) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-secondary mb-4">Price Breakdown</h3>
      
      {showDetailed ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2"
        >
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Base Fare</span>
            <span className="font-medium">₹{priceBreakdown.baseFare.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Distance Fare</span>
            <span className="font-medium">₹{priceBreakdown.distanceFare.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Time Fare</span>
            <span className="font-medium">₹{priceBreakdown.timeFare.toFixed(2)}</span>
          </div>
          
          {priceBreakdown.surgeFare > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-gray-600">Surge Pricing</span>
                <div className="relative group ml-1">
                  <Info className="h-4 w-4 text-gray-400" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    Higher rates during peak demand times
                  </div>
                </div>
              </div>
              <span className="font-medium text-amber-600">₹{priceBreakdown.surgeFare.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tax (18% GST)</span>
            <span className="font-medium">₹{priceBreakdown.tax.toFixed(2)}</span>
          </div>
          
          <div className="border-t border-gray-200 my-2 pt-2"></div>
        </motion.div>
      ) : (
        <div className="text-right mb-2">
          <button 
            onClick={() => {}} 
            className="text-sm text-primary hover:text-primary-dark"
          >
            View Details
          </button>
        </div>
      )}
      
      <div className="flex justify-between items-center text-lg font-bold">
        <span className="text-secondary">Total</span>
        <span className="text-secondary">₹{priceBreakdown.total.toFixed(2)}</span>
      </div>
      
      {!showDetailed && (
        <p className="text-xs text-gray-500 mt-2">
          Includes all taxes and fees
        </p>
      )}
    </div>
  );
};

export default PriceBreakdown;