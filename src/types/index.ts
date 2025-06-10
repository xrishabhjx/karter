export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'partner' | 'admin';
  profileImage?: string;
  verified: boolean;
  wallet?: Wallet;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface Vehicle {
  id: string;
  partnerId: string;
  type: 'bike' | 'auto' | 'car' | 'truck' | 'van';
  model: string;
  registrationNumber: string;
  capacity: string;
  verified: boolean;
}

export interface Delivery {
  id: string;
  userId: string;
  partnerId?: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  pickupLocation: Location;
  dropLocation: Location;
  pickupTime: Date;
  deliveryTime?: Date;
  price: number;
  bidPrice?: number;
  distance: number;
  paymentStatus: 'pending' | 'completed';
  paymentMethod?: PaymentMethod;
  vehicleType: 'bike' | 'auto' | 'car' | 'truck' | 'van';
  items: DeliveryItem[];
  createdAt: Date;
  updatedAt: Date;
}

export type PaymentMethod = 'upi' | 'wallet' | 'card' | 'cash' | 'paypal' | 'razorpay';

export interface DeliveryItem {
  name: string;
  quantity: number;
  weight: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface Location {
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Partner {
  id: string;
  userId: string;
  vehicles: Vehicle[];
  rating: number;
  totalTrips: number;
  earnings: number;
  available: boolean;
  documents: {
    license: string;
    insurance: string;
    registration: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface Review {
  id: string;
  deliveryId: string;
  userId: string;
  partnerId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  clientSecret: string;
  paymentMethod?: string;
  created: number;
}

export interface Invoice {
  id: string;
  deliveryId: string;
  userId: string;
  amount: number;
  tax: number;
  total: number;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  dueDate: Date;
  paidAt?: Date;
  items: InvoiceItem[];
  createdAt: Date;
}

export interface InvoiceItem {
  description: string;
  amount: number;
  quantity: number;
}

export interface PriceBreakdown {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  surgeFare: number;
  tax: number;
  total: number;
}