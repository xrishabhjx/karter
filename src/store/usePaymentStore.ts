// Payment management store using Zustand
import { create } from 'zustand';
import { PaymentMethod, PriceBreakdown } from '../types';

/**
 * Payment state management store
 * Features:
 * - Payment method selection and management
 * - Price calculation and breakdown
 * - Payment processing status
 * - Error handling
 */
interface PaymentState {
  selectedPaymentMethod: PaymentMethod | null;
  savedPaymentMethods: {
    id: string;
    type: PaymentMethod;
    last4?: string;
    expiryDate?: string;
    name?: string;
    isDefault: boolean;
  }[];
  priceBreakdown: PriceBreakdown | null;
  isProcessingPayment: boolean;
  paymentError: string | null;
  
  // Actions
  setSelectedPaymentMethod: (method: PaymentMethod | null) => void;
  addPaymentMethod: (method: { 
    type: PaymentMethod; 
    last4?: string; 
    expiryDate?: string; 
    name?: string;
    isDefault?: boolean;
  }) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  setPriceBreakdown: (breakdown: PriceBreakdown | null) => void;
  setIsProcessingPayment: (isProcessing: boolean) => void;
  setPaymentError: (error: string | null) => void;
  calculatePrice: (distance: number, duration: number, vehicleType: string, isPeakHour?: boolean) => PriceBreakdown;
}

const usePaymentStore = create<PaymentState>((set, get) => ({
  selectedPaymentMethod: null,
  savedPaymentMethods: [
    {
      id: '1',
      type: 'card',
      last4: '4242',
      expiryDate: '12/25',
      name: 'Visa',
      isDefault: true
    },
    {
      id: '2',
      type: 'upi',
      name: 'user@okbank',
      isDefault: false
    }
  ],
  priceBreakdown: null,
  isProcessingPayment: false,
  paymentError: null,

  // Store actions and state management
  setSelectedPaymentMethod: (method) => set({ selectedPaymentMethod: method }),
  
  // Add new payment method with validation
  addPaymentMethod: (method) => set((state) => {
    const newMethod = {
      id: Math.random().toString(36).substring(2, 9),
      type: method.type,
      last4: method.last4,
      expiryDate: method.expiryDate,
      name: method.name,
      isDefault: method.isDefault || false
    };
    
    // If this is set as default, update other methods
    let updatedMethods = [...state.savedPaymentMethods];
    if (newMethod.isDefault) {
      updatedMethods = updatedMethods.map(m => ({
        ...m,
        isDefault: false
      }));
    }
    
    return { 
      savedPaymentMethods: [...updatedMethods, newMethod] 
    };
  }),
  
  removePaymentMethod: (id) => set((state) => ({
    savedPaymentMethods: state.savedPaymentMethods.filter(method => method.id !== id)
  })),
  
  setDefaultPaymentMethod: (id) => set((state) => ({
    savedPaymentMethods: state.savedPaymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    }))
  })),
  
  setPriceBreakdown: (breakdown) => set({ priceBreakdown: breakdown }),
  
  setIsProcessingPayment: (isProcessing) => set({ isProcessingPayment: isProcessing }),
  
  setPaymentError: (error) => set({ paymentError: error }),
  
  // Calculate delivery price based on parameters
  calculatePrice: (distance, duration, vehicleType, isPeakHour = false) => {
    // Base fare by vehicle type
    const baseFareByType = {
      'bike': 30,
      'auto': 50,
      'car': 80,
      'van': 120,
      'truck': 200
    };
    
    // Rate per km by vehicle type
    const ratePerKmByType = {
      'bike': 10,
      'auto': 15,
      'car': 20,
      'van': 25,
      'truck': 30
    };
    
    // Rate per minute by vehicle type
    const ratePerMinuteByType = {
      'bike': 1,
      'auto': 1.5,
      'car': 2,
      'van': 2.5,
      'truck': 3
    };
    
    // Default to bike if vehicle type not found
    const vehicleKey = vehicleType in baseFareByType ? vehicleType : 'bike';
    
    // Calculate base components
    const baseFare = baseFareByType[vehicleKey as keyof typeof baseFareByType];
    const distanceFare = distance * ratePerKmByType[vehicleKey as keyof typeof ratePerKmByType];
    const timeFare = duration * ratePerMinuteByType[vehicleKey as keyof typeof ratePerMinuteByType];
    
    // Apply surge pricing if it's peak hour (1.5x)
    const surgeFactor = isPeakHour ? 1.5 : 1;
    const surgeFare = isPeakHour ? (baseFare + distanceFare + timeFare) * 0.5 : 0;
    
    // Calculate subtotal
    const subtotal = baseFare + distanceFare + timeFare + surgeFare;
    
    // Apply tax (18% GST)
    const tax = subtotal * 0.18;
    
    // Calculate total
    const total = subtotal + tax;
    
    const breakdown: PriceBreakdown = {
      baseFare,
      distanceFare,
      timeFare,
      surgeFare,
      tax,
      total: Math.round(total)
    };
    
    // Update the store with the calculated breakdown
    set({ priceBreakdown: breakdown });
    
    return breakdown;
  }
}));

export default usePaymentStore;