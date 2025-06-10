import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import Button from '../common/Button';

interface WalletSectionProps {
  balance: number;
  transactions: {
    id: string;
    amount: number;
    type: 'credit' | 'debit';
    description: string;
    date: Date;
    status: 'completed' | 'pending' | 'failed';
  }[];
}

const WalletSection: React.FC<WalletSectionProps> = ({ balance, transactions }) => {
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  
  const handleAddMoney = () => {
    // In a real app, this would integrate with a payment gateway
    console.log(`Adding ${addAmount} to wallet`);
    setShowAddMoney(false);
    setAddAmount('');
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-secondary to-secondary-dark rounded-lg p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Your Wallet</h3>
          <Wallet className="h-6 w-6" />
        </div>
        
        <div className="mb-6">
          <p className="text-sm opacity-80">Available Balance</p>
          <p className="text-3xl font-bold">₹{balance.toFixed(2)}</p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => setShowAddMoney(true)}
          icon={<Plus className="h-4 w-4 mr-1" />}
        >
          Add Money
        </Button>
      </div>
      
      {showAddMoney && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-secondary mb-4">Add Money to Wallet</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter amount"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                min="1"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {[100, 200, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => setAddAmount(amount.toString())}
                >
                  ₹{amount}
                </button>
              ))}
            </div>
            
            <div className="flex space-x-3 mt-4">
              <Button
                variant="secondary"
                onClick={handleAddMoney}
                disabled={!addAmount || parseFloat(addAmount) <= 0}
              >
                Proceed to Add
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowAddMoney(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-secondary mb-4">Recent Transactions</h3>
        
        {transactions.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-3 border-b border-gray-100"
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-3 ${
                    transaction.type === 'credit' 
                      ? 'bg-green-100' 
                      : 'bg-red-100'
                  }`}>
                    {transaction.type === 'credit' ? (
                      <ArrowDownLeft className={`h-5 w-5 ${
                        transaction.type === 'credit' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`} />
                    ) : (
                      <ArrowUpRight className={`h-5 w-5 ${
                        transaction.type === 'credit' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{transaction.description}</p>
                    <p className="text-xs text-gray-500">
                      {transaction.date.toLocaleDateString()} • {transaction.date.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    transaction.type === 'credit' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-xs flex items-center justify-end">
                    {transaction.status === 'completed' ? (
                      <span className="text-green-600 flex items-center">
                        <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                        Completed
                      </span>
                    ) : transaction.status === 'pending' ? (
                      <span className="text-amber-600 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center">
                        <span className="w-2 h-2 bg-red-600 rounded-full mr-1"></span>
                        Failed
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {transactions.length > 0 && (
          <div className="mt-4 text-center">
            <Button variant="text">View All Transactions</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletSection;