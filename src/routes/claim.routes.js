import express from 'express';
const router = express.Router();
import {
  submitClaim,
  getMyClaims,
  getClaimsForItem,
  getAllClaims,
  updateClaimStatus,
  withdrawClaim,
} from "../controllers/claim.controller.js";
import protect from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';
import upload from '../middlewares/upload.middleware.js';

// @route   POST /api/claims
// @desc    Submit a claim for a found item
// @access  Private
router.post(
  '/',
  protect,
  upload.array('proof_images', 3),
  submitClaim
);

// @route   GET /api/claims/my
// @desc    Get all claims made by logged-in user
// @access  Private
router.get('/my', protect, getMyClaims);

// @route   GET /api/claims/item/:itemId
// @desc    Get all claims on a specific item
// @access  Private (item owner or admin)
router.get('/item/:itemId', protect, getClaimsForItem);

// @route   GET /api/claims
// @desc    Get all claims (admin dashboard)
// @access  Private/Admin
router.get(
  '/',
  protect,
  authorize('admin'),
  getAllClaims
);

// @route   PATCH /api/claims/:id/status
// @desc    Approve or reject a claim
//          Body: { status: 'approved' | 'rejected', rejection_reason? }
// @access  Private/Admin
router.patch(
  '/:id/status',
  protect,
  authorize('admin'),
  updateClaimStatus
);

// @route   DELETE /api/claims/:id
// @desc    Withdraw a pending claim
// @access  Private
router.delete('/:id', protect, withdrawClaim);

export default router;