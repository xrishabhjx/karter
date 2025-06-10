// Partner management store using Zustand
import { create } from 'zustand';

/**
 * Partner state management interface
 * Features:
 * - Online status tracking
 * - Location management
 * - Delivery tracking
 * - Earnings and stats
 */
interface PartnerState {
  isOnline: boolean;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  activeDelivery: any | null;
  earnings: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
  stats: {
    totalDeliveries: number;
    completionRate: number;
    rating: number;
    reviews: number;
  };
  
  // Actions
  setOnlineStatus: (status: boolean) => void;
  updateLocation: (location: { lat: number; lng: number; address: string }) => void;
  setActiveDelivery: (delivery: any | null) => void;
  updateEarnings: (earnings: { today: number; week: number; month: number; total: number }) => void;
  updateStats: (stats: { totalDeliveries: number; completionRate: number; rating: number; reviews: number }) => void;
}

/**
 * Partner store for managing delivery partner state
 * Handles:
 * - Availability status
 * - Current location updates
 * - Active deliveries
 * - Performance metrics
 */
const usePartnerStore = create<PartnerState>((set) => ({
  isOnline: false,
  currentLocation: null,
  activeDelivery: null,
  earnings: {
    today: 0,
    week: 0,
    month: 0,
    total: 0
  },
  stats: {
    totalDeliveries: 0,
    completionRate: 0,
    rating: 0,
    reviews: 0
  },

  setOnlineStatus: (status) => set({ isOnline: status }),
  
  updateLocation: (location) => set({ currentLocation: location }),
  
  setActiveDelivery: (delivery) => set({ activeDelivery: delivery }),
  
  updateEarnings: (earnings) => set({ earnings }),
  
  updateStats: (stats) => set({ stats }),
}));

export default usePartnerStore;