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
import { auth } from "../middleware/auth.js";

var router = express.Router()

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  [
    auth,
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
    auth,
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
    auth,
    check('address', 'Address is required').optional()
  ],
  updateAddress
);

// @route   DELETE /api/users/addresses/:addressId
// @desc    Delete user address
// @access  Private
router.delete('/addresses/:addressId', auth, deleteAddress);

// @route   GET /api/users/addresses
// @desc    Get user addresses
// @access  Private
router.get('/addresses', auth, getAddresses);

// @route   GET /api/users/deliveries
// @desc    Get user deliveries
// @access  Private
router.get('/deliveries', auth, getUserDeliveries);

// @route   GET /api/users/deliveries/:deliveryId
// @desc    Get user delivery by ID
// @access  Private
router.get('/deliveries/:deliveryId', auth, getUserDeliveryById);

// @route   GET /api/users/dashboard
// @desc    Get user dashboard stats
// @access  Private
router.get('/dashboard', auth, getDashboardStats);

// @route   GET /api/users/is-partner
// @desc    Check if user is a partner
// @access  Private
router.get('/is-partner', auth, checkPartnerStatus);

// @route   DELETE /api/users
// @desc    Delete user account
// @access  Private
router.delete('/', auth, deleteAccount);

export default router