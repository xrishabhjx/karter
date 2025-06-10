import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, CheckCircle, AlertTriangle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StripePaymentForm from '../components/payment/StripePaymentForm';
import PaymentMethodSelector from '../components/payment/PaymentMethodSelector';
import PriceBreakdown from '../components/payment/PriceBreakdown';
import PaymentConfirmation from '../components/payment/PaymentConfirmation';
import usePaymentStore from '../store/usePaymentStore';
import { PaymentMethod } from '../types';
import toast from 'react-hot-toast';

// Mock Stripe promise (in a real app, you would use your actual publishable key)
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const PaymentPage: React.FC = () => {
  const { deliveryId } = useParams<{ deliveryId: string }>();
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [deliveryDetails, setDeliveryDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    priceBreakdown, 
    calculatePrice, 
    isProcessingPayment, 
    setIsProcessingPayment 
  } = usePaymentStore();

  // Fetch delivery details and create payment intent
  useEffect(() => {
    const fetchDeliveryAndCreateIntent = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call to fetch delivery details
        // For demo purposes, we'll create mock data
        const mockDelivery = {
          id: deliveryId,
          pickupLocation: {
            address: 'Sector 18, Noida, UP',
            lat: 28.5697,
            lng: 77.3183
          },
          dropLocation: {
            address: 'Connaught Place, New Delhi',
            lat: 28.6289,
            lng: 77.2091
          },
          packageDetails: 'Small package, 2kg',
          vehicleType: 'Two-Wheeler',
          scheduledTime: null,
          status: 'pending',
          distance: 15.3,
          duration: 45
        };
        
        setDeliveryDetails(mockDelivery);
        
        // Calculate price
        calculatePrice(
          mockDelivery.distance, 
          mockDelivery.duration, 
          mockDelivery.vehicleType
        );
        
        // In a real app, you would create a payment intent on your server
        // and return the client secret
        // Mock client secret for demo purposes
        setClientSecret('pi_3NJkCpLkdIwHh6Ks0MQrTjAn_secret_vaBwNrt8HQxU1Y2HqFILVc2Ks');
        
      } catch (err) {
        console.error('Error fetching delivery details:', err);
        setError('Failed to load delivery details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDeliveryAndCreateIntent();
  }, [deliveryId, calculatePrice]);

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  const handlePaymentSuccess = (paymentResult: any) => {
    // Generate a random transaction ID
    const randomId = Math.random().toString(36).substring(2, 15);
    setTransactionId(`TXN${randomId.toUpperCase()}`);
    
    setPaymentComplete(true);
    toast.success('Payment successful!');
  };

  const handlePaymentError = (errorMessage: string) => {
    toast.error(`Payment failed: ${errorMessage}`);
    setIsProcessingPayment(false);
  };

  const handleProceedToPayment = async () => {
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    
    setIsProcessingPayment(true);
    
    try {
      // For non-card payments or if using a different payment processor
      if (selectedPaymentMethod !== 'card') {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate a random transaction ID
        const randomId = Math.random().toString(36).substring(2, 15);
        setTransactionId(`TXN${randomId.toUpperCase()}`);
        
        setPaymentComplete(true);
        toast.success('Payment successful!');
      }
      // For card payments with Stripe, the payment is handled in the StripePaymentForm component
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleDownloadInvoice = () => {
    toast.success('Invoice downloaded successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-light py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="text-center py-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-secondary mb-2">Error</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button
                variant="secondary"
                onClick={() => navigate('/book')}
              >
                Return to Booking
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary">Complete Your Payment</h1>
          <p className="mt-2 text-gray-600">
            Secure payment for your delivery with KARTER.
          </p>
        </div>

        {paymentComplete ? (
          <PaymentConfirmation
            transactionId={transactionId}
            amount={priceBreakdown?.total || 0}
            date={new Date()}
            paymentMethod={selectedPaymentMethod || 'Unknown'}
            onDownloadInvoice={handleDownloadInvoice}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Card className="mb-6">
                <h3 className="text-lg font-semibold text-secondary mb-4">Delivery Details</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pickup:</span>
                    <span className="font-medium">{deliveryDetails?.pickupLocation.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Drop-off:</span>
                    <span className="font-medium">{deliveryDetails?.dropLocation.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package:</span>
                    <span className="font-medium">{deliveryDetails?.packageDetails}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="font-medium">{deliveryDetails?.vehicleType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance:</span>
                    <span className="font-medium">{deliveryDetails?.distance} km</span>
                  </div>
                </div>
              </Card>
              
              <PriceBreakdown showDetailed={true} />
              
              <div className="mt-6">
                <PaymentMethodSelector
                  onSelect={handlePaymentMethodSelect}
                  selectedMethod={selectedPaymentMethod}
                />
              </div>
            </div>
            
            <div>
              {selectedPaymentMethod === 'card' && clientSecret ? (
                <Card>
                  <h3 className="text-lg font-semibold text-secondary mb-4">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Card Payment
                    </div>
                  </h3>
                  
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <StripePaymentForm
                      amount={priceBreakdown?.total || 0}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      clientSecret={clientSecret}
                    />
                  </Elements>
                </Card>
              ) : (
                <Card>
                  <h3 className="text-lg font-semibold text-secondary mb-4">Payment Summary</h3>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="text-xl font-bold text-secondary">
                        ₹{priceBreakdown?.total.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-gray-600 mb-2">Selected Payment Method</p>
                      {selectedPaymentMethod ? (
                        <div className="p-3 bg-gray-50 rounded-md">
                          {selectedPaymentMethod === 'wallet' && (
                            <div className="flex items-center">
                              <span className="font-medium">Wallet</span>
                              <span className="ml-auto text-green-600">Balance: ₹1,200.00</span>
                            </div>
                          )}
                          {selectedPaymentMethod === 'upi' && (
                            <div className="flex items-center">
                              <span className="font-medium">UPI</span>
                            </div>
                          )}
                          {selectedPaymentMethod === 'cash' && (
                            <div className="flex items-center">
                              <span className="font-medium">Cash on Delivery</span>
                            </div>
                          )}
                          {selectedPaymentMethod === 'paypal' && (
                            <div className="flex items-center">
                              <span className="font-medium">PayPal</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-red-500">No payment method selected</div>
                      )}
                    </div>
                    
                    <Button
                      variant="secondary"
                      fullWidth
                      disabled={!selectedPaymentMethod || isProcessingPayment}
                      onClick={handleProceedToPayment}
                    >
                      {isProcessingPayment ? 'Processing...' : 'Complete Payment'}
                    </Button>
                    
                    <p className="text-xs text-center text-gray-500">
                      By proceeding, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </div>
                </Card>
              )}
              
              <div className="mt-6">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => navigate('/book')}
                >
                  Cancel and Return to Booking
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;