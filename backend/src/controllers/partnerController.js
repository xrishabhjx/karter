import Partner from '../models/Partner.js';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Delivery from '../models/Delivery.js';
import Payment from '../models/Payment.js';
import Notification from '../models/Notification.js';
import { validationResult } from 'express-validator';
import logger from '../utils/logger.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Register as a partner
// @route   POST /api/partners/register
// @access  Private
export const registerPartner = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { 
    aadhaarNumber, 
    aadhaarFrontImage, 
    aadhaarBackImage,
    licenseNumber,
    licenseFrontImage,
    licenseBackImage,
    licenseExpiryDate,
    profilePhoto
  } = req.body;

  // Check if user is already a partner
  const existingPartner = await Partner.findOne({ user: req.user.id });
  if (existingPartner) {
    return next(new ErrorResponse('You are already registered as a partner', 400));
  }

  // Create partner
  const partner = await Partner.create({
    user: req.user.id,
    documents: {
      aadhaarCard: {
        number: aadhaarNumber,
        frontImage: aadhaarFrontImage,
        backImage: aadhaarBackImage
      },
      drivingLicense: {
        number: licenseNumber,
        frontImage: licenseFrontImage,
        backImage: licenseBackImage,
        expiryDate: licenseExpiryDate
      },
      profilePhoto
    },
    verificationStatus: 'pending'
  });

  // Update user role
  await User.findByIdAndUpdate(req.user.id, { role: 'partner' });

  // Create notification for admin
  await Notification.create({
    recipient: req.user.id,
    type: 'partner_request',
    title: 'Partner Registration Submitted',
    message: 'Your partner registration has been submitted and is under review. We will notify you once it\'s approved.',
    data: {
      partnerId: partner._id
    }
  });

  res.status(201).json({
    success: true,
    message: 'Partner registration submitted successfully. Your application is under review.',
    partner: {
      id: partner._id,
      verificationStatus: partner.verificationStatus
    }
  });
});

// @desc    Add vehicle
// @route   POST /api/partners/vehicles
// @access  Private (Partner)
export const addVehicle = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check if user is a partner
  const partner = await Partner.findOne({ user: req.user.id });
  if (!partner) {
    return next(new ErrorResponse('You are not registered as a partner', 404));
  }

  const {
    type,
    model,
    registrationNumber,
    registrationImage,
    insuranceNumber,
    insuranceExpiryDate,
    insuranceImage,
    capacity
  } = req.body;

  // Check if vehicle with same registration number already exists
  const existingVehicle = await Vehicle.findOne({ registrationNumber });
  if (existingVehicle) {
    return next(new ErrorResponse('Vehicle with this registration number already exists', 400));
  }

  // Create vehicle
  const vehicle = await Vehicle.create({
    partner: partner._id,
    type,
    model,
    registrationNumber,
    registrationImage,
    insuranceNumber,
    insuranceExpiryDate,
    insuranceImage,
    capacity,
    isVerified: false
  });

  res.status(201).json({
    success: true,
    message: 'Vehicle added successfully. It will be verified by our team.',
    vehicle
  });
});

// @desc    Update vehicle
// @route   PUT /api/partners/vehicles/:vehicleId
// @access  Private (Partner)
export const updateVehicle = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { vehicleId } = req.params;

  // Check if user is a partner
  const partner = await Partner.findOne({ user: req.user.id });
  if (!partner) {
    return next(new ErrorResponse('You are not registered as a partner', 404));
  }

  // Find vehicle
  const vehicle = await Vehicle.findOne({
    _id: vehicleId,
    partner: partner._id
  });

  if (!vehicle) {
    return next(new ErrorResponse('Vehicle not found', 404));
  }

  const {
    model,
    insuranceNumber,
    insuranceExpiryDate,
    insuranceImage,
    isActive
  } = req.body;

  // Update fields
  if (model) vehicle.model = model;
  if (insuranceNumber) vehicle.insuranceNumber = insuranceNumber;
  if (insuranceExpiryDate) vehicle.insuranceExpiryDate = insuranceExpiryDate;
  if (insuranceImage) vehicle.insuranceImage = insuranceImage;
  if (isActive !== undefined) vehicle.isActive = isActive;

  // If insurance details are updated, set verification to false
  if (insuranceNumber || insuranceExpiryDate || insuranceImage) {
    vehicle.isVerified = false;
  }

  // Save vehicle
  await vehicle.save();

  res.status(200).json({
    success: true,
    message: 'Vehicle updated successfully',
    vehicle
  });
});

// @desc    Get partner vehicles
// @route   GET /api/partners/vehicles
// @access  Private (Partner)
export const getVehicles = asyncHandler(async (req, res, next) => {
  // Check if user is a partner
  const partner = await Partner.findOne({ user: req.user.id });
  if (!partner) {
    return next(new ErrorResponse('You are not registered as a partner', 404));
  }

  // Find vehicles
  const vehicles = await Vehicle.find({ partner: partner._id });

  res.status(200).json({
    success: true,
    count: vehicles.length,
    vehicles
  });
});

// @desc    Update partner profile
// @route   PUT /api/partners/profile
// @access  Private (Partner)
export const updatePartnerProfile = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check if user is a partner
  const partner = await Partner.findOne({ user: req.user.id });
  if (!partner) {
    return next(new ErrorResponse('You are not registered as a partner', 404));
  }

  const {
    bankDetails,
    documents
  } = req.body;

  // Update fields
  if (bankDetails) {
    partner.bankDetails = {
      ...partner.bankDetails,
      ...bankDetails,
      verified: false // Reset verification when bank details are updated
    };
  }

  if (documents) {
    // Update only provided document fields
    if (documents.aadhaarCard) {
      partner.documents.aadhaarCard = {
        ...partner.documents.aadhaarCard,
        ...documents.aadhaarCard,
        verified: false // Reset verification when documents are updated
      };
    }

    if (documents.drivingLicense) {
      partner.documents.drivingLicense = {
        ...partner.documents.drivingLicense,
        ...documents.drivingLicense,
        verified: false // Reset verification when documents are updated
      };
    }

    if (documents.profilePhoto) {
      partner.documents.profilePhoto = documents.profilePhoto;
    }
  }

  // Save partner
  await partner.save();

  res.status(200).json({
    success: true,
    message: 'Partner profile updated successfully',
    partner
  });
});

// @desc    Update partner location
// @route   PUT /api/partners/location
// @access  Private (Partner)
export const updateLocation = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { coordinates, address } = req.body;

  // Check if user is a partner
  const partner = await Partner.findOne({ user: req.user.id });
  if (!partner) {
    return next(new ErrorResponse('You are not registered as a partner', 404));
  }

  // Update location
  partner.currentLocation = {
    type: 'Point',
    coordinates,
    address: address || partner.currentLocation.address,
    lastUpdated: Date.now()
  };

  // Save partner
  await partner.save();

  // If partner has an active delivery, update the delivery route
  const activeDelivery = await Delivery.findOne({
    partner: partner._id,
    status: { $in: ['accepted', 'picked-up', 'in-transit', 'arriving'] }
  });

  if (activeDelivery) {
    // Add waypoint to route
    activeDelivery.route.waypoints.push({
      location: {
        type: 'Point',
        coordinates
      },
      timestamp: Date.now()
    });

    await activeDelivery.save();

    // Emit socket event for real-time tracking
    if (req.io) {
      req.io.to(`delivery_${activeDelivery._id}`).emit('locationUpdate', {
        deliveryId: activeDelivery._id,
        location: {
          coordinates,
          address: address || 'Unknown location'
        },
        timestamp: Date.now()
      });
    }
  }

  res.status(200).json({
    success: true,
    message: 'Location updated successfully'
  });
});

// @desc    Update availability status
// @route   PUT /api/partners/availability
// @access  Private (Partner)
export const updateAvailability = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { status } = req.body;

  // Check if user is a partner
  const partner = await Partner.findOne({ user: req.user.id });
  if (!partner) {
    return next(new ErrorResponse('You are not registered as a partner', 404));
  }

  // Check if partner is verified
  if (partner.verificationStatus !== 'approved') {
    return next(new ErrorResponse('Your partner account is not approved yet', 400));
  }

  // Check if partner has active deliveries when going offline
  if (status === 'offline') {
    const activeDeliveries = await Delivery.countDocuments({
      partner: partner._id,
      status: { $in: ['accepted', 'picked-up', 'in-transit', 'arriving'] }
    });

    if (activeDeliveries > 0) {
      return next(new ErrorResponse('Cannot go offline with active deliveries', 400));
    }
  }

  // Update availability status
  partner.availabilityStatus = status;
  await partner.save();

  res.status(200).json({
    success: true,
    message: `You are now ${status}`,
    availabilityStatus: status
  });
});

// @desc    Get partner dashboard stats
// @route   GET /api/partners/dashboard
// @access  Private (Partner)
export const getDashboardStats = asyncHandler(async (req, res, next) => {
  // Check if user is a partner
  const partner = await Partner.findOne({ user: req.user.id });
  if (!partner) {
    return next(new ErrorResponse('You are not registered as a partner', 404));
  }

  // Get total deliveries
  const totalDeliveries = await Delivery.countDocuments({ partner: partner._id });

  // Get active deliveries
  const activeDeliveries = await Delivery.countDocuments({
    partner: partner._id,
    status: { $in: ['accepted', 'picked-up', 'in-transit', 'arriving'] }
  });

  // Get completed deliveries
  const completedDeliveries = await Delivery.countDocuments({
    partner: partner._id,
    status: 'delivered'
  });

  // Get today's deliveries
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayDeliveries = await Delivery.countDocuments({
    partner: partner._id,
    createdAt: { $gte: today }
  });

  // Get total earnings
  const payments = await Payment.find({
    partner: partner._id,
    status: 'completed'
  });

  const totalEarnings = payments.reduce((total, payment) => {
    return total + (payment.partnerPayout?.amount || 0);
  }, 0);

  // Get recent deliveries
  const recentDeliveries = await Delivery.find({ partner: partner._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name')
    .populate('vehicle', 'type model registrationNumber');

  res.status(200).json({
    success: true,
    stats: {
      totalDeliveries,
      activeDeliveries,
      completedDeliveries,
      todayDeliveries,
      totalEarnings,
      rating: partner.rating,
      availabilityStatus: partner.availabilityStatus
    },
    recentDeliveries
  });
});

// @desc    Get partner deliveries
// @route   GET /api/partners/deliveries
// @access  Private (Partner)
export const getPartnerDeliveries = asyncHandler(async (req, res, next) => {
  const { status, limit = 10, page = 1 } = req.query;

  // Check if user is a partner
  const partner = await Partner.findOne({ user: req.user.id });
  if (!partner) {
    return next(new ErrorResponse('You are not registered as a partner', 404));
  }

  // Build query
  const query = { partner: partner._id };
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
    .populate('user', 'name phone')
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

// @desc    Get nearby delivery requests
// @route   GET /api/partners/nearby-requests
// @access  Private (Partner)
export const getNearbyRequests = asyncHandler(async (req, res, next) => {
  // Check if user is a partner
  const partner = await Partner.findOne({ user: req.user.id });
  if (!partner) {
    return next(new ErrorResponse('You are not registered as a partner', 404));
  }

  // Check if partner is verified and online
  if (partner.verificationStatus !== 'approved') {
    return next(new ErrorResponse('Your partner account is not approved yet', 400));
  }

  if (partner.availabilityStatus !== 'online') {
    return next(new ErrorResponse('You must be online to see nearby requests', 400));
  }

  // Get partner's vehicles
  const vehicles = await Vehicle.find({
    partner: partner._id,
    isVerified: true,
    isActive: true
  });

  if (vehicles.length === 0) {
    return next(new ErrorResponse('You need at least one verified vehicle to accept deliveries', 400));
  }

  // Get vehicle types
  const vehicleTypes = vehicles.map(vehicle => vehicle.type);

  // Find nearby delivery requests
  const nearbyRequests = await Delivery.find({
    status: 'searching',
    vehicleType: { $in: vehicleTypes },
    'pickupLocation.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: partner.currentLocation.coordinates
        },
        $maxDistance: 5000 // 5km radius
      }
    }
  })
    .populate('user', 'name rating')
    .limit(10);

  res.status(200).json({
    success: true,
    count: nearbyRequests.length,
    requests: nearbyRequests
  });
});

// @desc    Accept delivery request
// @route   POST /api/partners/deliveries/:deliveryId/accept
// @access  Private (Partner)
export const acceptDelivery = asyncHandler(async (req, res, next) => {
  const { deliveryId } = req.params;
  const { vehicleId } = req.body;

  // Check if user is a partner
  const partner = await Partner.findOne({ user: req.user.id });
  if (!partner) {
    return next(new ErrorResponse('You are not registered as a partner', 404));
  }

  // Check if partner is verified and online
  if (partner.verificationStatus !== 'approved') {
    return next(new ErrorResponse('Your partner account is not approved yet', 400));
  }

  if (partner.availabilityStatus !== 'online') {
    return next(new ErrorResponse('You must be online to accept deliveries', 400));
  }

  // Check if partner already has an active delivery
  const activeDelivery = await Delivery.findOne({
    partner: partner._id,
    status: { $in: ['accepted', 'picked-up', 'in-transit'] }
  });

  if (activeDelivery) {
    return next(new ErrorResponse('You already have an active delivery', 400));
  }

  // Check if vehicle exists and belongs to partner
  const vehicle = await Vehicle.findOne({
    _id: vehicleId,
    partner: partner._id,
    isVerified: true,
    isActive: true
  });

  if (!vehicle) {
    return next(new ErrorResponse('Vehicle not found or not verified', 404));
  }

  // Find delivery
  const delivery = await Delivery.findById(deliveryId);
  if (!delivery) {
    return next(new ErrorResponse('Delivery not found', 404));
  }

  // Check if delivery is still available
  if (delivery.status !== 'searching') {
    return next(new ErrorResponse('This delivery is no longer available', 400));
  }

  // Check if vehicle type matches
  if (delivery.vehicleType !== vehicle.type) {
    return next(new ErrorResponse(`This delivery requires a ${delivery.vehicleType}`, 400));
  }

  // Update delivery
  delivery.partner = partner._id;
  delivery.vehicle = vehicle._id;
  delivery.status = 'accepted';
  
  // Add to timeline
  delivery.timeline.push({
    status: 'accepted',
    timestamp: Date.now(),
    description: 'Delivery accepted by partner',
    location: {
      coordinates: partner.currentLocation.coordinates,
      address: partner.currentLocation.address
    }
  });
  
  await delivery.save();

  // Update partner status
  partner.availabilityStatus = 'busy';
  await partner.save();

  // Create notification for user
  await Notification.create({
    recipient: delivery.user,
    type: 'delivery_update',
    title: 'Delivery Accepted',
    message: 'Your delivery has been accepted by a partner and is on the way.',
    data: {
      deliveryId: delivery._id,
      status: 'accepted'
    }
  });

  // Emit socket event
  if (req.io) {
    req.io.to(`user_${delivery.user}`).emit('deliveryUpdate', {
      deliveryId: delivery._id,
      status: 'accepted',
      partner: {
        name: req.user.name,
        phone: req.user.phone,
        rating: partner.rating
      },
      vehicle: {
        type: vehicle.type,
        model: vehicle.model,
        registrationNumber: vehicle.registrationNumber
      }
    });
  }

  res.status(200).json({
    success: true,
    message: 'Delivery accepted successfully',
    delivery
  });
});

// @desc    Update delivery status
// @route   PUT /api/partners/deliveries/:deliveryId/status
// @access  Private (Partner)
export const updateDeliveryStatus = asyncHandler(async (req, res, next) => {
  const { deliveryId } = req.params;
  const { status, location } = req.body;

  // Check if user is a partner
  const partner = await Partner.findOne({ user: req.user.id });
  if (!partner) {
    return next(new ErrorResponse('You are not registered as a partner', 404));
  }

  // Find delivery
  const delivery = await Delivery.findOne({
    _id: deliveryId,
    partner: partner._id
  });

  if (!delivery) {
    return next(new ErrorResponse('Delivery not found', 404));
  }

  // Validate status transition
  const validTransitions = {
    'accepted': ['picked-up', 'cancelled'],
    'picked-up': ['in-transit', 'cancelled'],
    'in-transit': ['arriving', 'cancelled'],
    'arriving': ['delivered', 'cancelled']
  };

  if (!validTransitions[delivery.status]?.includes(status)) {
    return next(new ErrorResponse(`Invalid status transition from ${delivery.status} to ${status}`, 400));
  }

  // Update delivery status
  delivery.status = status;

  // Add to timeline
  delivery.timeline.push({
    status,
    timestamp: Date.now(),
    description: `Delivery ${status.replace('-', ' ')}`,
    location: {
      coordinates: location?.coordinates || partner.currentLocation.coordinates,
      address: location?.address || partner.currentLocation.address
    }
  });

  // Handle delivery completion
  if (status === 'delivered') {
    // Update partner stats
    partner.totalDeliveries += 1;
    partner.availabilityStatus = 'online';
    await partner.save();

    // Handle payment if not cash
    if (delivery.payment.method !== 'cash') {
      // Update payment status
      delivery.payment.status = 'completed';
      delivery.payment.paidAt = Date.now();
    }
  }

  // Handle cancellation
  if (status === 'cancelled') {
    delivery.cancellation = {
      reason: req.body.reason || 'Cancelled by partner',
      cancelledBy: 'partner',
      timestamp: Date.now()
    };

    // Update partner status
    partner.availabilityStatus = 'online';
    await partner.save();
  }

  await delivery.save();

  // Create notification for user
  await Notification.create({
    recipient: delivery.user,
    type: 'delivery_update',
    title: `Delivery ${status.replace('-', ' ')}`,
    message: `Your delivery has been ${status.replace('-', ' ')}.`,
    data: {
      deliveryId: delivery._id,
      status
    }
  });

  // Emit socket event
  if (req.io) {
    req.io.to(`user_${delivery.user}`).emit('deliveryUpdate', {
      deliveryId: delivery._id,
      status,
      location: location || {
        coordinates: partner.currentLocation.coordinates,
        address: partner.currentLocation.address
      },
      timestamp: Date.now()
    });
  }

  res.status(200).json({
    success: true,
    message: `Delivery status updated to ${status}`,
    delivery
  });
});

// @desc    Get partner earnings
// @route   GET /api/partners/earnings
// @access  Private (Partner)
export const getEarnings = asyncHandler(async (req, res, next) => {
  const { period = 'week', startDate, endDate } = req.query;

  // Check if user is a partner
  const partner = await Partner.findOne({ user: req.user.id });
  if (!partner) {
    return next(new ErrorResponse('You are not registered as a partner', 404));
  }

  // Set date range based on period
  let dateRange = {};
  const now = new Date();

  if (startDate && endDate) {
    dateRange = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
  } else {
    switch (period) {
      case 'day':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dateRange = { createdAt: { $gte: today } };
        break;
      case 'week':
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        dateRange = { createdAt: { $gte: lastWeek } };
        break;
      case 'month':
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        dateRange = { createdAt: { $gte: lastMonth } };
        break;
      case 'year':
        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        dateRange = { createdAt: { $gte: lastYear } };
        break;
      default:
        const defaultRange = new Date();
        defaultRange.setDate(defaultRange.getDate() - 7);
        dateRange = { createdAt: { $gte: defaultRange } };
    }
  }

  // Find completed deliveries
  const completedDeliveries = await Delivery.find({
    partner: partner._id,
    status: 'delivered',
    ...dateRange
  }).sort({ createdAt: -1 });

  // Calculate earnings
  const earnings = completedDeliveries.reduce((total, delivery) => {
    // Partner typically gets 80% of the delivery price
    const partnerShare = delivery.pricing.totalPrice * 0.8;
    return total + partnerShare;
  }, 0);

  // Group earnings by day
  const earningsByDay = {};
  completedDeliveries.forEach(delivery => {
    const date = delivery.createdAt.toISOString().split('T')[0];
    const partnerShare = delivery.pricing.totalPrice * 0.8;
    
    if (!earningsByDay[date]) {
      earningsByDay[date] = {
        date,
        earnings: 0,
        deliveries: 0
      };
    }
    
    earningsByDay[date].earnings += partnerShare;
    earningsByDay[date].deliveries += 1;
  });

  res.status(200).json({
    success: true,
    period,
    totalEarnings: earnings,
    totalDeliveries: completedDeliveries.length,
    earningsByDay: Object.values(earningsByDay),
    deliveries: completedDeliveries
  });
});