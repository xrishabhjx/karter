import Notification from '../models/Notification.js';
import { validationResult } from 'express-validator';
import logger from '../utils/logger.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getUserNotifications = asyncHandler(async (req, res, next) => {
  const { limit = 20, page = 1, read } = req.query;
  
  // Build query
  const query = { recipient: req.user.id };
  if (read !== undefined) {
    query.read = read === 'true';
  }
  
  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Find notifications
  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  // Get total count
  const total = await Notification.countDocuments(query);
  
  // Get unread count
  const unreadCount = await Notification.countDocuments({
    recipient: req.user.id,
    read: false
  });
  
  res.status(200).json({
    success: true,
    count: notifications.length,
    total,
    unreadCount,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    notifications
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);
  
  if (!notification) {
    return next(new ErrorResponse('Notification not found', 404));
  }
  
  // Check if user is authorized
  if (notification.recipient.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this notification', 403));
  }
  
  // Update notification
  notification.read = true;
  notification.readAt = Date.now();
  await notification.save();
  
  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    notification
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(async (req, res, next) => {
  // Update all unread notifications
  await Notification.updateMany(
    { recipient: req.user.id, read: false },
    { read: true, readAt: Date.now() }
  );
  
  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);
  
  if (!notification) {
    return next(new ErrorResponse('Notification not found', 404));
  }
  
  // Check if user is authorized
  if (notification.recipient.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this notification', 403));
  }
  
  // Delete notification
  await notification.remove();
  
  res.status(200).json({
    success: true,
    message: 'Notification deleted successfully'
  });
});

// @desc    Get notification count
// @route   GET /api/notifications/count
// @access  Private
export const getNotificationCount = asyncHandler(async (req, res, next) => {
  // Get unread count
  const unreadCount = await Notification.countDocuments({
    recipient: req.user.id,
    read: false
  });
  
  res.status(200).json({
    success: true,
    unreadCount
  });
});

// @desc    Create notification (admin only)
// @route   POST /api/notifications
// @access  Private (Admin)
export const createNotification = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to create notifications', 403));
  }
  
  const { recipient, type, title, message, data } = req.body;
  
  // Create notification
  const notification = await Notification.create({
    recipient,
    type,
    title,
    message,
    data
  });
  
  // Emit socket event
  if (req.io) {
    req.io.to(`user_${recipient}`).emit('newNotification', {
      id: notification._id,
      type,
      title,
      message,
      createdAt: notification.createdAt
    });
  }
  
  res.status(201).json({
    success: true,
    message: 'Notification created successfully',
    notification
  });
});