import User from '../models/User.js';
import Partner from '../models/Partner.js';
import Delivery from '../models/Delivery.js';
import { validationResult } from 'express-validator';
import logger from '../utils/logger.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from "../middleware/asyncHandler.js";


// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, phone, profileImage } = req.body;

  // Find user
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Update fields
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (profileImage) user.profileImage = profileImage;

  // Save user
  await user.save();

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileImage: user.profileImage,
      verified: user.verified
    }
  });
});

// @desc    Add user address
// @route   POST /api/users/addresses
// @access  Private
export const addAddress = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { type, address, city, state, pincode, coordinates, isDefault } = req.body;

  // Find user
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Create new address
  const newAddress = {
    type: type || 'home',
    address,
    city,
    state,
    pincode,
    coordinates,
    isDefault: isDefault || false
  };

  // If this address is set as default, unset any existing default
  if (newAddress.isDefault) {
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }

  // Add address to user
  user.addresses.push(newAddress);
  await user.save();

  res.status(201).json({
    success: true,
    message: 'Address added successfully',
    address: newAddress
  });
});

// @desc    Update user address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
export const updateAddress = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { addressId } = req.params;
  const { type, address, city, state, pincode, coordinates, isDefault } = req.body;

  // Find user
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Find address
  const addressToUpdate = user.addresses.id(addressId);
  if (!addressToUpdate) {
    return next(new ErrorResponse('Address not found', 404));
  }

  // Update fields
  if (type) addressToUpdate.type = type;
  if (address) addressToUpdate.address = address;
  if (city) addressToUpdate.city = city;
  if (state) addressToUpdate.state = state;
  if (pincode) addressToUpdate.pincode = pincode;
  if (coordinates) addressToUpdate.coordinates = coordinates;

  // Handle default address
  if (isDefault) {
    user.addresses.forEach(addr => {
      addr.isDefault = addr._id.toString() === addressId;
    });
  }

  // Save user
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Address updated successfully',
    address: addressToUpdate
  });
});

// @desc    Delete user address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
export const deleteAddress = asyncHandler(async (req, res, next) => {
  const { addressId } = req.params;

  // Find user
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Find address
  const addressToDelete = user.addresses.id(addressId);
  if (!addressToDelete) {
    return next(new ErrorResponse('Address not found', 404));
  }

  // Remove address
  addressToDelete.remove();
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Address deleted successfully'
  });
});

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
export const getAddresses = asyncHandler(async (req, res, next) => {
  // Find user
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    addresses: user.addresses
  });
});

// @desc    Get user deliveries
// @route   GET /api/users/deliveries
// @access  Private
export const getUserDeliveries = asyncHandler(async (req, res, next) => {
  const { status, limit = 10, page = 1 } = req.query;
  
  // Build query
  const query = { user: req.user.id };
  if (status) {
    query.status = status;
  }
  
  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Find deliveries
  const deliveries = await Delivery.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('partner', 'user rating')
    .populate('vehicle', 'type model registrationNumber');
  
  // Get total count
  const total = await Delivery.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: deliveries.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    deliveries
  });
});

// @desc    Get user delivery by ID
// @route   GET /api/users/deliveries/:deliveryId
// @access  Private
export const getUserDeliveryById = asyncHandler(async (req, res, next) => {
  const { deliveryId } = req.params;
  
  // Find delivery
  const delivery = await Delivery.findOne({
    _id: deliveryId,
    user: req.user.id
  })
    .populate('partner', 'user rating')
    .populate('vehicle', 'type model registrationNumber');
  
  if (!delivery) {
    return next(new ErrorResponse('Delivery not found', 404));
  }
  
  res.status(200).json({
    success: true,
    delivery
  });
});

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard
// @access  Private
export const getDashboardStats = asyncHandler(async (req, res, next) => {
  // Get total deliveries
  const totalDeliveries = await Delivery.countDocuments({ user: req.user.id });
  
  // Get active deliveries
  const activeDeliveries = await Delivery.countDocuments({
    user: req.user.id,
    status: { $in: ['pending', 'searching', 'accepted', 'picked-up', 'in-transit', 'arriving'] }
  });
  
  // Get completed deliveries
  const completedDeliveries = await Delivery.countDocuments({
    user: req.user.id,
    status: 'delivered'
  });
  
  // Get cancelled deliveries
  const cancelledDeliveries = await Delivery.countDocuments({
    user: req.user.id,
    status: 'cancelled'
  });
  
  // Get total spent
  const deliveries = await Delivery.find({
    user: req.user.id,
    status: 'delivered'
  });
  
  const totalSpent = deliveries.reduce((total, delivery) => {
    return total + (delivery.pricing?.totalPrice || 0);
  }, 0);
  
  // Get recent deliveries
  const recentDeliveries = await Delivery.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('partner', 'user rating')
    .populate('vehicle', 'type model registrationNumber');
  
  res.status(200).json({
    success: true,
    stats: {
      totalDeliveries,
      activeDeliveries,
      completedDeliveries,
      cancelledDeliveries,
      totalSpent
    },
    recentDeliveries
  });
});

// @desc    Check if user is a partner
// @route   GET /api/users/is-partner
// @access  Private
export const checkPartnerStatus = asyncHandler(async (req, res, next) => {
  // Check if user is a partner
  const partner = await Partner.findOne({ user: req.user.id });
  
  res.status(200).json({
    success: true,
    isPartner: !!partner,
    partnerStatus: partner ? partner.verificationStatus : null,
    partnerId: partner ? partner._id : null
  });
});

// @desc    Delete user account
// @route   DELETE /api/users
// @access  Private
export const deleteAccount = asyncHandler(async (req, res, next) => {
  // Find user
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  
  // Check if user has active deliveries
  const activeDeliveries = await Delivery.countDocuments({
    user: req.user.id,
    status: { $in: ['pending', 'searching', 'accepted', 'picked-up', 'in-transit', 'arriving'] }
  });
  
  if (activeDeliveries > 0) {
    return next(new ErrorResponse('Cannot delete account with active deliveries', 400));
  }
  
  // Check if user is a partner
  const partner = await Partner.findOne({ user: req.user.id });
  if (partner) {
    // Check if partner has active deliveries
    const activePartnerDeliveries = await Delivery.countDocuments({
      partner: partner._id,
      status: { $in: ['accepted', 'picked-up', 'in-transit', 'arriving'] }
    });
    
    if (activePartnerDeliveries > 0) {
      return next(new ErrorResponse('Cannot delete account with active partner deliveries', 400));
    }
    
    // Delete partner
    await Partner.findByIdAndDelete(partner._id);
  }
  
  // Delete user
  await User.findByIdAndDelete(req.user.id);
  
  res.status(200).json({
    success: true,
    message: 'Account deleted successfully'
  });
});