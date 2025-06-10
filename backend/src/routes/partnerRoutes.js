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
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Partner registration
router.post('/register', auth, registerPartner);

// Vehicle routes
router.post('/vehicles', auth, authorize('partner'), addVehicle);
router.put('/vehicles/:vehicleId', auth, authorize('partner'), updateVehicle);
router.get('/vehicles', auth, authorize('partner'), getVehicles);

// Profile update
router.put('/profile', auth, authorize('partner'), updatePartnerProfile);

// Location update
router.put('/location', auth, authorize('partner'), updateLocation);

// Availability update
router.put('/availability', auth, authorize('partner'), updateAvailability);

// Partner dashboard stats
router.get('/dashboard', auth, authorize('partner'), getDashboardStats);

// Partner deliveries
router.get('/deliveries', auth, authorize('partner'), getPartnerDeliveries);
router.get('/nearby-requests', auth, authorize('partner'), getNearbyRequests);
router.post('/deliveries/:deliveryId/accept', auth, authorize('partner'), acceptDelivery);
router.put('/deliveries/:deliveryId/status', auth, authorize('partner'), updateDeliveryStatus);

// Partner earnings
router.get('/earnings', auth, authorize('partner'), getEarnings);

export default router;