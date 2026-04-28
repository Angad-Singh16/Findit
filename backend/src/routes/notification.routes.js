import express from 'express';
const router = express.Router();
import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";
import protect from "../middlewares/auth.middleware.js";

// @route   GET /api/notifications
// @desc    Get all notifications for logged-in user
//          Query: ?is_read=false&limit=20&page=1
// @access  Private
router.get('/', protect, getMyNotifications);

// @route   GET /api/notifications/unread-count
// @desc    Get count of unread notifications (for badge)
// @access  Private
router.get('/unread-count', protect, getUnreadCount);

// @route   PATCH /api/notifications/read-all
// @desc    Mark all notifications as read
//          NOTE: Must be above /:id route to avoid conflict
// @access  Private
router.patch('/read-all', protect, markAllAsRead);

// @route   PATCH /api/notifications/:id/read
// @desc    Mark a single notification as read
// @access  Private
router.patch('/:id/read', protect, markAsRead);

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private
router.delete('/:id', protect, deleteNotification);

export default router