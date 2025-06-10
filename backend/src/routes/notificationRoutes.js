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
import { auth } from "../middleware/auth.js";

var router = express.Router();

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get(
  '/',
  [
    auth
  ],
  getUserNotifications
);

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put(
  '/:id/read',
  [
    auth
  ],
  markAsRead
);

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put(
  '/read-all',
  [
    auth
  ],
  markAllAsRead
);

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete(
  '/:id',
  [
    auth
  ],
  deleteNotification
);

// @route   GET /api/notifications/count
// @desc    Get notification count
// @access  Private
router.get(
  '/count',
  [
    auth
  ],
  getNotificationCount
);

// @route   POST /api/notifications
// @desc    Create notification (Admin only)
// @access  Private (Admin)
router.post(
  '/',
  [
    auth,
    check('recipient', 'Recipient ID is required').not().isEmpty(),
    check('type', 'Notification type is required').not().isEmpty(),
    check('title', 'Notification title is required').not().isEmpty(),
    check('message', 'Notification message is required').not().isEmpty()
  ],
  createNotification
);

export default router;
