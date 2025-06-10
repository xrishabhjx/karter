import { validationResult } from 'express-validator';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';
import Delivery from '../models/Delivery.js';
import Partner from '../models/Partner.js';
import Notification from '../models/Notification.js';
import Payment from '../models/Payment.js';
import calculatePrice from '../utils/calculatePrice.js';

// @desc    Cancel delivery
// @route   PUT /api/deliveries/:id/cancel
// @access  Private
export const cancelDelivery = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { reason } = req.body;

  // Find delivery
  const delivery = await Delivery.findById(id);

  if (!delivery) {
    return next(new ErrorResponse('Delivery not found', 404));
  }

  // Check if user is authorized to cancel
  if (delivery.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to cancel this delivery', 403));
  }

  // Check if delivery can be cancelled
  if (['delivered', 'cancelled'].includes(delivery.status)) {
    return next(
      new ErrorResponse(`Delivery cannot be cancelled as it is already ${delivery.status}`, 400)
    );
  }

  // Update delivery status
  delivery.status = 'cancelled';
  delivery.cancellation = {
    reason: reason || 'Cancelled by user',
    cancelledAt: Date.now(),
    cancelledBy: req.user.id
  };

  await delivery.save();

  // Create notification for user
  await Notification.create({
    recipient: req.user.id,
    type: 'delivery_update',
    title: 'Delivery Cancelled',
    message: 'Your delivery has been cancelled successfully.',
    data: {
      deliveryId: delivery._id,
      status: 'cancelled'
    }
  });

  // Process refund if payment was made
  if (delivery.payment.status === 'completed') {
    // Create refund record
    await Payment.findOneAndUpdate(
      { delivery: delivery._id },
      {
        $set: {
          'refund.status': 'pending',
          'refund.reason': reason || 'Cancelled by user',
          'refund.amount': delivery.pricing.totalPrice
        }
      }
    );
  }

  res.status(200).json({
    success: true,
    message: 'Delivery cancelled successfully',
    delivery
  });
});

// @desc    Rate delivery
// @route   POST /api/deliveries/:id/rate
// @access  Private
export const rateDelivery = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { rating, comment } = req.body;

  // Find delivery
  const delivery = await Delivery.findById(id);

  if (!delivery) {
    return next(new ErrorResponse('Delivery not found', 404));
  }

  // Check if user is authorized to rate this delivery
  if (delivery.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to rate this delivery', 403));
  }

  // Check if delivery is completed
  if (delivery.status !== 'delivered') {
    return next(new ErrorResponse('Only completed deliveries can be rated', 400));
  }

  // Check if delivery is already rated
  if (delivery.rating && delivery.rating.value) {
    return next(new ErrorResponse('This delivery has already been rated', 400));
  }

  // Update delivery with rating
  delivery.rating = {
    value: rating,
    comment,
    createdAt: Date.now()
  };

  await delivery.save();

  // Update partner's rating
  if (delivery.partner) {
    const partner = await Partner.findById(delivery.partner);
    if (partner) {
      // Calculate new average rating
      const newTotalRatings = partner.totalRatings + 1;
      const newRating = ((partner.rating * partner.totalRatings) + rating) / newTotalRatings;
      
      partner.rating = newRating;
      partner.totalRatings = newTotalRatings;
      await partner.save();

      // Create notification for partner
      await Notification.create({
        recipient: partner.user,
        type: 'delivery_update',
        title: 'New Rating Received',
        message: `You received a ${rating}-star rating for your delivery.`,
        data: {
          deliveryId: delivery._id,
          rating
        }
      });
    }
  }

  res.status(200).json({
    success: true,
    message: 'Delivery rated successfully',
    rating: delivery.rating
  });
});

// @desc    Get user's active deliveries
// @route   GET /api/deliveries/active
// @access  Private
export const getActiveDeliveries = asyncHandler(async (req, res, next) => {
  // Find active deliveries for the user
  const activeDeliveries = await Delivery.find({
    user: req.user.id,
    status: { $in: ['searching', 'accepted', 'picked-up', 'in-transit', 'arriving'] }
  })
    .sort({ createdAt: -1 })
    .populate('partner', 'user rating')
    .populate('vehicle', 'type model registrationNumber');

  res.status(200).json({
    success: true,
    count: activeDeliveries.length,
    deliveries: activeDeliveries
  });
});

// @desc    Create custom bid delivery
// @route   POST /api/deliveries/custom-bid
// @access  Private
export const createCustomBidDelivery = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    pickupLocation,
    dropLocation,
    packageDetails,
    vehicleType,
    userProposedPrice,
    scheduledTime
  } = req.body;

  // Calculate distance and duration
  const distance = await calculateDistance(
    pickupLocation.coordinates,
    dropLocation.coordinates
  );

  // Calculate minimum acceptable price (70% of standard price)
  const standardPricing = calculatePrice(distance.value, vehicleType);
  const minAcceptablePrice = standardPricing.totalPrice * 0.7;

  // Check if proposed price is too low
  if (userProposedPrice < minAcceptablePrice) {
    return next(new ErrorResponse(`Proposed price is too low. Minimum acceptable price is ₹${minAcceptablePrice.toFixed(2)}`, 400));
  }

  // Set expiry time (24 hours from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  // Create delivery with custom bid
  const delivery = await Delivery.create({
    user: req.user.id,
    type: 'custom-bid',
    pickupLocation,
    dropLocation,
    packageDetails,
    vehicleType,
    scheduledTime,
    distance: {
      value: distance.value,
      duration: distance.duration
    },
    pricing: {
      ...standardPricing,
      totalPrice: userProposedPrice
    },
    payment: {
      method: 'cash', // Default to cash, can be updated later
      status: 'pending'
    },
    status: 'pending',
    customBid: {
      userProposedPrice,
      bids: [],
      expiresAt,
      status: 'open'
    }
  });

  // Notify nearby partners about the custom bid
  if (req.io) {
    req.io.to(`vehicleType_${vehicleType}`).emit('newCustomBid', {
      deliveryId: delivery._id,
      pickupLocation,
      dropLocation,
      vehicleType,
      userProposedPrice,
      expiresAt
    });
  }

  // Create notification for user
  await Notification.create({
    recipient: req.user.id,
    type: 'delivery_update',
    title: 'Custom Bid Created',
    message: 'Your custom bid delivery has been created. Partners will now be able to bid on your request.',
    data: {
      deliveryId: delivery._id,
      status: 'pending'
    }
  });

  res.status(201).json({
    success: true,
    message: 'Custom bid delivery created successfully',
    delivery
  });
});

// @desc    Submit bid for custom delivery
// @route   POST /api/deliveries/:id/bid
// @access  Private (Partner)
export const submitBid = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { price, estimatedPickupTime, message } = req.body;

  // Check if user is a partner
  const partner = await Partner.findOne({ user: req.user.id });
  if (!partner) {
    return next(new ErrorResponse('You are not registered as a partner', 404));
  }

  // Check if partner is verified
  if (partner.verificationStatus !== 'approved') {
    return next(new ErrorResponse('Your partner account is not approved yet', 400));
  }

  // Find delivery
  const delivery = await Delivery.findById(id);
  if (!delivery) {
    return next(new ErrorResponse('Delivery not found', 404));
  }

  // Check if delivery is a custom bid
  if (delivery.type !== 'custom-bid') {
    return next(new ErrorResponse('This is not a custom bid delivery', 400));
  }

  // Check if bid is still open
  if (delivery.customBid.status !== 'open') {
    return next(new ErrorResponse('This bid is no longer open', 400));
  }

  // Check if bid has expired
  if (new Date(delivery.customBid.expiresAt) < new Date()) {
    return next(new ErrorResponse('This bid has expired', 400));
  }

  // Check if partner has already submitted a bid
  const existingBid = delivery.customBid.bids.find(
    bid => bid.partner.toString() === partner._id.toString()
  );

  if (existingBid) {
    return next(new ErrorResponse('You have already submitted a bid for this delivery', 400));
  }

  // Add bid to delivery
  delivery.customBid.bids.push({
    partner: partner._id,
    price,
    estimatedPickupTime,
    message,
    createdAt: Date.now()
  });

  await delivery.save();

  // Create notification for user
  await Notification.create({
    recipient: delivery.user,
    type: 'delivery_update',
    title: 'New Bid Received',
    message: `A partner has submitted a bid of ₹${price} for your delivery.`,
    data: {
      deliveryId: delivery._id,
      bidPrice: price
    }
  });

  // Emit socket event to user
  if (req.io) {
    req.io.to(`user_${delivery.user}`).emit('newBid', {
      deliveryId: delivery._id,
      partnerId: partner._id,
      partnerName: req.user.name,
      price,
      estimatedPickupTime
    });
  }

  res.status(200).json({
    success: true,
    message: 'Bid submitted successfully',
    bid: {
      partner: partner._id,
      price,
      estimatedPickupTime,
      message,
      createdAt: new Date()
    }
  });
});

// @desc    Accept bid for custom delivery
// @route   POST /api/deliveries/:id/accept-bid/:bidId
// @access  Private
export const acceptBid = asyncHandler(async (req, res, next) => {
  const { id, bidId } = req.params;
  const { paymentMethod = 'cash' } = req.body;

  // Find delivery
  const delivery = await Delivery.findById(id);
  if (!delivery) {
    return next(new ErrorResponse('Delivery not found', 404));
  }

  // Check if user is authorized
  if (delivery.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to accept bids for this delivery', 403));
  }

  // Check if delivery is a custom bid
  if (delivery.type !== 'custom-bid') {
    return next(new ErrorResponse('This is not a custom bid delivery', 400));
  }

  // Check if bid is still open
  if (delivery.customBid.status !== 'open') {
    return next(new ErrorResponse('This bid is no longer open', 400));
  }

  // Find the bid
  const bid = delivery.customBid.bids.id(bidId);
  if (!bid) {
    return next(new ErrorResponse('Bid not found', 404));
  }

  // Update delivery
  delivery.partner = bid.partner;
  delivery.status = 'accepted';
  delivery.pricing.totalPrice = bid.price;
  delivery.payment.method = paymentMethod;
  delivery.customBid.status = 'accepted';

  // Add to timeline
  delivery.timeline.push({
    status: 'accepted',
    timestamp: Date.now(),
    description: 'Bid accepted and delivery assigned to partner'
  });

  await delivery.save();

  // Update partner status
  const partner = await Partner.findById(bid.partner);
  if (partner) {
    partner.availabilityStatus = 'busy';
    await partner.save();

    // Create notification for partner
    await Notification.create({
      recipient: partner.user,
      type: 'delivery_update',
      title: 'Bid Accepted',
      message: 'Your bid has been accepted. Please proceed with the delivery.',
      data: {
        deliveryId: delivery._id,
        status: 'accepted'
      }
    });

    // Emit socket event to partner
    if (req.io) {
      req.io.to(`partner_${partner.user}`).emit('bidAccepted', {
        deliveryId: delivery._id,
        price: bid.price
      });
    }
  }

  // Create notification for user
  await Notification.create({
    recipient: req.user.id,
    type: 'delivery_update',
    title: 'Bid Accepted',
    message: 'You have accepted a bid for your delivery. The partner will contact you shortly.',
    data: {
      deliveryId: delivery._id,
      status: 'accepted'
    }
  });

  res.status(200).json({
    success: true,
    message: 'Bid accepted successfully',
    delivery
  });
});