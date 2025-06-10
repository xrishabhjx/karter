import express from "express";
import { check } from "express-validator";
import { 
  createPaymentIntent,
  confirmPayment,
  getUserPayments,
  getPaymentById,
  stripeWebhook
} from "../controllers/paymentController.js";
import { auth, authorize } from '../middleware/auth.js';
const router = express.Router();

// @route   POST /api/payments/create-intent
// @desc    Create payment intent
// @access  Private
router.post(
  '/create-intent',
  auth,
  [
    check('deliveryId', 'Delivery ID is required').notEmpty(),
    check('paymentMethod', 'Payment method is required').notEmpty()
  ],
  createPaymentIntent
);

// @route   POST /api/payments/confirm
// @desc    Confirm payment
// @access  Private
router.post(
  '/confirm',
  auth,
  [
    check('deliveryId', 'Delivery ID is required').notEmpty(),
    check('paymentMethod', 'Payment method is required').notEmpty(),
    check('paymentIntentId', 'Payment intent ID is required').optional()
  ],
  confirmPayment
);

// @route   GET /api/payments
// @desc    Get user payments
// @access  Private
router.get('/', auth, getUserPayments);

// @route   GET /api/payments/:id
// @desc    Get payment by ID
// @access  Private
router.get('/:id', auth, getPaymentById);

// @route   POST /api/payments/webhook
// @desc    Process Stripe webhook
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;