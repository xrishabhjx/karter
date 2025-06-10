import Payment from '../models/Payment.js';
import Delivery from '../models/Delivery.js';
import User from '../models/User.js';
import Partner from '../models/Partner.js';
import Notification from '../models/Notification.js';
import stripe from 'stripe';
import { validationResult } from 'express-validator';
import logger from '../utils/logger.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);


// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
export const createPaymentIntent = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { deliveryId, paymentMethod } = req.body;

  // Find delivery
  const delivery = await Delivery.findById(deliveryId);
  if (!delivery) {
    return next(new ErrorResponse('Delivery not found', 404));
  }

  // Check if user is authorized
  if (delivery.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to make payment for this delivery', 403));
  }

  // Check if payment is already completed
  if (delivery.payment.status === 'completed') {
    return next(new ErrorResponse('Payment has already been completed for this delivery', 400));
  }

  // Update payment method
  delivery.payment.method = paymentMethod;
  await delivery.save();

  // If payment method is cash, no need to create payment intent
  if (paymentMethod === 'cash') {
    return res.status(200).json({
      success: true,
      message: 'Cash payment selected. Pay directly to the delivery partner.',
      paymentMethod: 'cash'
    });
  }

  // Create payment intent with Stripe
  try {
    const amount = Math.round(delivery.pricing.totalPrice * 100); // Convert to cents/paise
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'inr',
      metadata: {
        deliveryId: delivery._id.toString(),
        userId: req.user.id
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: delivery.pricing.totalPrice
    });
  } catch (error) {
    logger.error(`Stripe payment intent error: ${error.message}`);
    return next(new ErrorResponse('Error creating payment intent', 500));
  }
});

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
export const confirmPayment = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { deliveryId, paymentIntentId, paymentMethod } = req.body;

  // Find delivery
  const delivery = await Delivery.findById(deliveryId);
  if (!delivery) {
    return next(new ErrorResponse('Delivery not found', 404));
  }

  // Check if user is authorized
  if (delivery.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to confirm payment for this delivery', 403));
  }

  // Update delivery payment status
  delivery.payment.status = 'completed';
  delivery.payment.transactionId = paymentIntentId;
  delivery.payment.paidAt = Date.now();
  await delivery.save();

  // Create payment record
  const payment = await Payment.create({
    user: req.user.id,
    delivery: delivery._id,
    partner: delivery.partner,
    amount: delivery.pricing.totalPrice,
    method: paymentMethod,
    status: 'completed',
    transactionId: paymentIntentId,
    paymentGateway: paymentMethod === 'cash' ? 'cash' : 'stripe',
    gatewayPaymentId: paymentIntentId,
    description: `Payment for delivery ${delivery.trackingId}`,
    partnerPayout: {
      amount: delivery.pricing.totalPrice * 0.8, // Partner gets 80%
      status: 'pending'
    }
  });

  // Create notification for user
  await Notification.create({
    recipient: req.user.id,
    type: 'payment_update',
    title: 'Payment Successful',
    message: `Your payment of ₹${delivery.pricing.totalPrice} for delivery ${delivery.trackingId} has been completed.`,
    data: {
      deliveryId: delivery._id,
      paymentId: payment._id,
      amount: delivery.pricing.totalPrice
    }
  });

  // Create notification for partner if assigned
  if (delivery.partner) {
    await Notification.create({
      recipient: delivery.partner.user,
      type: 'payment_update',
      title: 'Payment Received',
      message: `Payment of ₹${delivery.pricing.totalPrice} has been received for delivery ${delivery.trackingId}.`,
      data: {
        deliveryId: delivery._id,
        paymentId: payment._id,
        amount: delivery.pricing.totalPrice
      }
    });
  }

  res.status(200).json({
    success: true,
    message: 'Payment confirmed successfully',
    payment: {
      id: payment._id,
      amount: payment.amount,
      status: payment.status,
      method: payment.method,
      transactionId: payment.transactionId,
      createdAt: payment.createdAt
    }
  });
});

// @desc    Get user payments
// @route   GET /api/payments
// @access  Private
export const getUserPayments = asyncHandler(async (req, res, next) => {
  const { limit = 10, page = 1 } = req.query;
  
  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Find payments
  const payments = await Payment.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('delivery', 'trackingId status')
    .populate('partner', 'user rating');
  
  // Get total count
  const total = await Payment.countDocuments({ user: req.user.id });
  
  res.status(200).json({
    success: true,
    count: payments.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    payments
  });
});

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
export const getPaymentById = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id)
    .populate('delivery', 'trackingId status pickupLocation dropLocation')
    .populate('partner', 'user rating')
    .populate('user', 'name email');
  
  if (!payment) {
    return next(new ErrorResponse('Payment not found', 404));
  }
  
  // Check if user is authorized
  if (
    payment.user._id.toString() !== req.user.id &&
    (!payment.partner || payment.partner.user.toString() !== req.user.id) &&
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse('Not authorized to view this payment', 403));
  }
  
  res.status(200).json({
    success: true,
    payment
  });
});

// @desc    Process Stripe webhook
// @route   POST /api/payments/webhook
// @access  Public
export const stripeWebhook = asyncHandler(async (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    logger.error(`Webhook signature verification failed: ${error.message}`);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      await handlePaymentIntentFailed(failedPaymentIntent);
      break;
    default:
      // Unexpected event type
      logger.info(`Unhandled event type: ${event.type}`);
  }
  
  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
});

// Helper function to handle successful payment intent
const handlePaymentIntentSucceeded = async (paymentIntent) => {
  try {
    const { deliveryId, userId } = paymentIntent.metadata;
    
    if (!deliveryId || !userId) {
      return logger.error('Missing metadata in payment intent');
    }
    
    // Find delivery
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return logger.error(`Delivery not found: ${deliveryId}`);
    }
    
    // Update delivery payment status if not already completed
    if (delivery.payment.status !== 'completed') {
      delivery.payment.status = 'completed';
      delivery.payment.transactionId = paymentIntent.id;
      delivery.payment.paidAt = new Date(paymentIntent.created * 1000);
      await delivery.save();
      
      // Create payment record if it doesn't exist
      const existingPayment = await Payment.findOne({
        delivery: deliveryId,
        gatewayPaymentId: paymentIntent.id
      });
      
      if (!existingPayment) {
        await Payment.create({
          user: userId,
          delivery: deliveryId,
          partner: delivery.partner,
          amount: paymentIntent.amount / 100, // Convert from cents/paise
          method: 'card', // Default to card for Stripe
          status: 'completed',
          transactionId: paymentIntent.id,
          paymentGateway: 'stripe',
          gatewayPaymentId: paymentIntent.id,
          description: `Payment for delivery ${delivery.trackingId}`,
          partnerPayout: {
            amount: (paymentIntent.amount / 100) * 0.8, // Partner gets 80%
            status: 'pending'
          }
        });
      }
      
      // Create notifications
      await Notification.create({
        recipient: userId,
        type: 'payment_update',
        title: 'Payment Successful',
        message: `Your payment of ₹${paymentIntent.amount / 100} for delivery ${delivery.trackingId} has been completed.`,
        data: {
          deliveryId,
          amount: paymentIntent.amount / 100
        }
      });
      
      if (delivery.partner) {
        const partner = await Partner.findById(delivery.partner);
        if (partner) {
          await Notification.create({
            recipient: partner.user,
            type: 'payment_update',
            title: 'Payment Received',
            message: `Payment of ₹${paymentIntent.amount / 100} has been received for delivery ${delivery.trackingId}.`,
            data: {
              deliveryId,
              amount: paymentIntent.amount / 100
            }
          });
        }
      }
    }
  } catch (error) {
    logger.error(`Error handling payment intent succeeded: ${error.message}`);
  }
};

// Helper function to handle failed payment intent
const handlePaymentIntentFailed = async (paymentIntent) => {
  try {
    const { deliveryId, userId } = paymentIntent.metadata;
    
    if (!deliveryId || !userId) {
      return logger.error('Missing metadata in payment intent');
    }
    
    // Find delivery
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return logger.error(`Delivery not found: ${deliveryId}`);
    }
    
    // Update delivery payment status
    delivery.payment.status = 'failed';
    await delivery.save();
    
    // Create payment record
    await Payment.create({
      user: userId,
      delivery: deliveryId,
      partner: delivery.partner,
      amount: paymentIntent.amount / 100, // Convert from cents/paise
      method: 'card', // Default to card for Stripe
      status: 'failed',
      transactionId: paymentIntent.id,
      paymentGateway: 'stripe',
      gatewayPaymentId: paymentIntent.id,
      description: `Failed payment for delivery ${delivery.trackingId}`
    });
    
    // Create notification
    await Notification.create({
      recipient: userId,
      type: 'payment_update',
      title: 'Payment Failed',
      message: `Your payment for delivery ${delivery.trackingId} has failed. Please try again.`,
      data: {
        deliveryId,
        error: paymentIntent.last_payment_error?.message || 'Payment failed'
      }
    });
  } catch (error) {
    logger.error(`Error handling payment intent failed: ${error.message}`);
  }
};