import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import WalletSection from '../components/payment/WalletSection';

const WalletPage: React.FC = () => {
  // Mock wallet data
  const walletData = {
    balance: 1200.50,
    transactions: [
      {
        id: '1',
        amount: 500,
        type: 'credit' as const,
        description: 'Added money to wallet',
        date: new Date(2023, 5, 15, 14, 30),
        status: 'completed' as const
      },
      {
        id: '2',
        amount: 250.75,
        type: 'debit' as const,
        description: 'Payment for delivery #KTR12345',
        date: new Date(2023, 5, 14, 10, 15),
        status: 'completed' as const
      },
      {
        id: '3',
        amount: 100,
        type: 'credit' as const,
        description: 'Referral bonus',
        date: new Date(2023, 5, 10, 9, 45),
        status: 'completed' as const
      },
      {
        id: '4',
        amount: 180.25,
        type: 'debit' as const,
        description: 'Payment for delivery #KTR12 346',
        date: new Date(2023, 5, 8, 16, 20),
        status: 'completed' as const
      },
      {
        id: '5',
        amount: 1000,
        type: 'credit' as const,
        description: 'Added money to wallet',
        date: new Date(2023, 5, 5, 11, 10),
        status: 'completed' as const
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link to="/user/dashboard" className="inline-flex items-center text-secondary hover:text-primary">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold text-secondary mt-4">Your Wallet</h1>
          <p className="text-gray-600">
            Manage your wallet balance and view transaction history
          </p>
        </div>
        
        <WalletSection
          balance={walletData.balance}
          transactions={walletData.transactions}
        />
        
        <div className="mt-8">
          <Card>
            <h3 className="text-lg font-semibold text-secondary mb-4">Wallet Benefits</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <h4 className="font-medium text-secondary mb-2">Fast Checkout</h4>
                <p className="text-gray-600 text-sm">
                  Pay instantly without entering payment details every time
                </p>
              </div>
              
              <div className="p-4 bg-primary/10 rounded-lg">
                <h4 className="font-medium text-secondary mb-2">Exclusive Offers</h4>
                <p className="text-gray-600 text-sm">
                  Get special discounts when paying with wallet
                </p>
              </div>
              
              <div className="p-4 bg-primary/10 rounded-lg">
                <h4 className="font-medium text-secondary mb-2">Cashback Rewards</h4>
                <p className="text-gray-600 text-sm">
                  Earn cashback on every transaction
                </p>
              </div>
              
              <div className="p-4 bg-primary/10 rounded-lg">
                <h4 className="font-medium text-secondary mb-2">Secure Payments</h4>
                <p className="text-gray-600 text-sm">
                  Your wallet is protected with advanced security
                </p>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Button variant="secondary">
                Explore Wallet Offers
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;