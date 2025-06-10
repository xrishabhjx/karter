import express from "express";
import { check } from "express-validator";
import { 
  updateProfile, 
  addAddress, 
  updateAddress, 
  deleteAddress, 
  getAddresses, 
  getUserDeliveries, 
  getUserDeliveryById, 
  getDashboardStats, 
  checkPartnerStatus, 
  deleteAccount 
} from '../controllers/userController.js';
import { protect } from "../middleware/auth.js";

var router = express.Router()

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  [
    protect,
    check('name', 'Name is required').optional(),
    check('phone', 'Please enter a valid phone number').optional().matches(/^[0-9]{10}$/)
  ],
  updateProfile
);

// @route   POST /api/users/addresses
// @desc    Add user address
// @access  Private
router.post(
  '/addresses',
  [
    protect,
    check('address', 'Address is required').not().isEmpty(),
    check('coordinates', 'Coordinates are required').isArray()
  ],
  addAddress
);

// @route   PUT /api/users/addresses/:addressId
// @desc    Update user address
// @access  Private
router.put(
  '/addresses/:addressId',
  [
    protect,
    check('address', 'Address is required').optional()
  ],
  updateAddress
);

// @route   DELETE /api/users/addresses/:addressId
// @desc    Delete user address
// @access  Private
router.delete('/addresses/:addressId', protect, deleteAddress);

// @route   GET /api/users/addresses
// @desc    Get user addresses
// @access  Private
router.get('/addresses', protect, getAddresses);

// @route   GET /api/users/deliveries
// @desc    Get user deliveries
// @access  Private
router.get('/deliveries', protect, getUserDeliveries);

// @route   GET /api/users/deliveries/:deliveryId
// @desc    Get user delivery by ID
// @access  Private
router.get('/deliveries/:deliveryId', protect, getUserDeliveryById);

// @route   GET /api/users/dashboard
// @desc    Get user dashboard stats
// @access  Private
router.get('/dashboard', protect, getDashboardStats);

// @route   GET /api/users/is-partner
// @desc    Check if user is a partner
// @access  Private
router.get('/is-partner', protect, checkPartnerStatus);

// @route   DELETE /api/users
// @desc    Delete user account
// @access  Private
router.delete('/', protect, deleteAccount);

export default router