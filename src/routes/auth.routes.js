import express from 'express';
const router = express.Router();
import {
  register,
  login,
  getMe,
  logout,
  refreshToken,
} from '../controllers/auth.controller.js';

import protect from '../middlewares/auth.middleware.js';
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user & return JWT token
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get currently logged in user
// @access  Private
router.get('/me', protect, getMe);

// @route   POST /api/auth/logout
// @desc    Logout user (clear cookie / token)
// @access  Private
router.post('/logout', protect, logout);

// @route   POST /api/auth/refresh
// @desc    Refresh access token using refresh token
// @access  Public
router.post('/refresh', refreshToken);

export default router;