import express from 'express';
import {
  registerPartner,
  addVehicle,
  updateVehicle,
  getVehicles,
  updatePartnerProfile,
  updateLocation,
  updateAvailability,
  getDashboardStats,
  getPartnerDeliveries,
  getNearbyRequests,
  acceptDelivery,
  updateDeliveryStatus,
  getEarnings
} from '../controllers/partnerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Partner registration
router.post('/register', protect, registerPartner);

// Vehicle routes
router.post('/vehicles', protect, authorize('partner'), addVehicle);
router.put('/vehicles/:vehicleId', protect, authorize('partner'), updateVehicle);
router.get('/vehicles', protect, authorize('partner'), getVehicles);

// Profile update
router.put('/profile', protect, authorize('partner'), updatePartnerProfile);

// Location update
router.put('/location', protect, authorize('partner'), updateLocation);

// Availability update
router.put('/availability', protect, authorize('partner'), updateAvailability);

// Partner dashboard stats
router.get('/dashboard', protect, authorize('partner'), getDashboardStats);

// Partner deliveries
router.get('/deliveries', protect, authorize('partner'), getPartnerDeliveries);
router.get('/nearby-requests', protect, authorize('partner'), getNearbyRequests);
router.post('/deliveries/:deliveryId/accept', protect, authorize('partner'), acceptDelivery);
router.put('/deliveries/:deliveryId/status', protect, authorize('partner'), updateDeliveryStatus);

// Partner earnings
router.get('/earnings', protect, authorize('partner'), getEarnings);

export default router;