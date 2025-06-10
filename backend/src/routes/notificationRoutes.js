import express from "express";
import { check } from "express-validator";
import { 
  getUserNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification, 
  getNotificationCount, 
  createNotification 
} from '../controllers/notificationController.js';
import { protect } from "../middleware/auth.js";

var router = express.Router();

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get(
  '/',
  [
    protect
  ],
  getUserNotifications
);

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put(
  '/:id/read',
  [
    protect
  ],
  markAsRead
);

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put(
  '/read-all',
  [
    protect
  ],
  markAllAsRead
);

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete(
  '/:id',
  [
    protect
  ],
  deleteNotification
);

// @route   GET /api/notifications/count
// @desc    Get notification count
// @access  Private
router.get(
  '/count',
  [
    protect
  ],
  getNotificationCount
);

// @route   POST /api/notifications
// @desc    Create notification (Admin only)
// @access  Private (Admin)
router.post(
  '/',
  [
    protect,
    check('recipient', 'Recipient ID is required').not().isEmpty(),
    check('type', 'Notification type is required').not().isEmpty(),
    check('title', 'Notification title is required').not().isEmpty(),
    check('message', 'Notification message is required').not().isEmpty()
  ],
  createNotification
);

export default router;