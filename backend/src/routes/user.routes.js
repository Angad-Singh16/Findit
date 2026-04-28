import express from 'express';
const router = express.Router();
import {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  deleteUser,
} from '../controllers/user.controller.js';
import protect from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';
import upload from '../middlewares/upload.middleware.js';

// @route   GET /api/users/profile
// @desc    Get logged-in user's profile
// @access  Private
router.get('/profile', protect, getProfile);

// @route   PUT /api/users/profile
// @desc    Update profile (name, phone, avatar)
// @access  Private
router.put(
  '/profile',
  protect,
  upload.single('avatar'),
  updateProfile
);

// @route   PUT /api/users/password
// @desc    Change password
// @access  Private
router.put('/password', protect, changePassword);

// @route   GET /api/users
// @desc    Get all users — Admin only
// @access  Private/Admin
router.get('/', protect, authorize('admin'), getAllUsers);

// @route   DELETE /api/users/:id
// @desc    Delete a user — Admin only
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), deleteUser);

export default router;