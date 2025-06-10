import express from "express";
import { check } from "express-validator";
import { 
  rateDelivery, 
  getActiveDeliveries, 
  createCustomBidDelivery, 
  submitBid, 
  acceptBid 
} from '../controllers/deliveryController.js';
import { protect } from "../middleware/auth.js";

var router = express.Router();

// @route   POST /api/deliveries/:id/rate
// @desc    Rate delivery
// @access  Private
router.post(
  '/:id/rate',
  [
    protect,
    check('rating', 'Rating is required').isInt({ min: 1, max: 5 }),
    check('comment', 'Comment is optional').optional().isString()
  ],
  rateDelivery
);

// @route   GET /api/deliveries/active
// @desc    Get user's active deliveries
// @access  Private
router.get('/active', protect, getActiveDeliveries);

// @route   POST /api/deliveries/custom-bid
// @desc    Create custom bid delivery
// @access  Private
router.post(
  '/custom-bid',
  [
    protect,
    check('pickupLocation', 'Pickup location is required').not().isEmpty(),
    check('dropLocation', 'Drop location is required').not().isEmpty(),
    check('packageDetails', 'Package details are required').not().isEmpty(),
    check('vehicleType', 'Vehicle type is required').not().isEmpty(),
    check('userProposedPrice', 'Proposed price is required').isNumeric(),
    check('scheduledTime', 'Scheduled time is required').not().isEmpty()
  ],
  createCustomBidDelivery
);

// @route   POST /api/deliveries/:id/bid
// @desc    Submit bid for custom delivery
// @access  Private (Partner)
router.post(
  '/:id/bid',
  [
    protect,
    check('price', 'Bid price is required').isNumeric(),
    check('estimatedPickupTime', 'Estimated pickup time is required').not().isEmpty(),
    check('message', 'Message is optional').optional().isString()
  ],
  submitBid
);

// @route   POST /api/deliveries/:id/accept-bid/:bidId
// @desc    Accept bid for custom delivery
// @access  Private
router.post(
  '/:id/accept-bid/:bidId',
  [
    protect,
    check('paymentMethod', 'Payment method is optional').optional().isString()
  ],
  acceptBid
);

export default router;