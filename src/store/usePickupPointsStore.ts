// Pickup points management store using Zustand
import { create } from 'zustand';

/**
 * Pickup point interface defining location data structure
 */
interface PickupPoint {
  id: string;
  name: string;
  type: 'store' | 'facility';
  address: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  workingHours: {
    open: string;
    close: string;
  };
  contactInfo: {
    phone: string;
    email: string;
  };
  isVerified: boolean;
  isActive: boolean;
  rating: number;
  totalOrders: number;
  capacity: {
    current: number;
    max: number;
  };
  amenities: string[];
}

/**
 * Store state interface for pickup points management
 */
interface PickupPointsState {
  points: PickupPoint[];
  selectedPoint: PickupPoint | null;
  loading: boolean;
  error: string | null;
  filters: {
    city: string;
    type: string;
    isVerified: boolean;
  };
  
  // Actions
  setPoints: (points: PickupPoint[]) => void;
  addPoint: (point: PickupPoint) => void;
  updatePoint: (id: string, updates: Partial<PickupPoint>) => void;
  deletePoint: (id: string) => void;
  setSelectedPoint: (point: PickupPoint | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<PickupPointsState['filters']>) => void;
  clearFilters: () => void;
}

/**
 * Pickup points store with filtering and management functionality
 * Features:
 * - Point listing and selection
 * - Filtering by city, type, and verification
 * - Loading and error states
 */
const usePickupPointsStore = create<PickupPointsState>((set) => ({
  points: [],
  selectedPoint: null,
  loading: false,
  error: null,
  filters: {
    city: '',
    type: '',
    isVerified: false
  },

  setPoints: (points) => set({ points }),
  
  addPoint: (point) => set((state) => ({
    points: [...state.points, point]
  })),
  
  updatePoint: (id, updates) => set((state) => ({
    points: state.points.map(point => 
      point.id === id ? { ...point, ...updates } : point
    )
  })),
  
  deletePoint: (id) => set((state) => ({
    points: state.points.filter(point => point.id !== id)
  })),
  
  setSelectedPoint: (point) => set({ selectedPoint: point }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  
  clearFilters: () => set({
    filters: {
      city: '',
      type: '',
      isVerified: false
    }
  })
}));

export default usePickupPointsStore;