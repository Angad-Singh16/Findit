import express from "express";
const router = express.Router();
import {
  getMatchesForItem,
  getMyMatches,
  createMatch,
  updateMatchStatus,
  getAllMatches,
} from "../controllers/match.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";

// @route   GET /api/matches/item/:itemId
// @desc    Get all AI-suggested matches for a specific item
// @access  Private
router.get("/item/:itemId", protect, getMatchesForItem);

// @route   GET /api/matches/my
// @desc    Get matches related to logged-in user's items
// @access  Private
router.get("/my", protect, getMyMatches);

// @route   POST /api/matches
// @desc    System/admin creates a match between lost & found item
//          Body: { lost_item_id, found_item_id, confidence, match_reason }
// @access  Private/Admin
router.post("/", protect, authorize("admin"), createMatch);

// @route   PATCH /api/matches/:id
// @desc    Confirm or dismiss a suggested match
//          Body: { status: 'confirmed' | 'dismissed' }
// @access  Private
router.patch("/:id", protect, updateMatchStatus);

// @route   GET /api/matches
// @desc    Get all matches (admin view)
// @access  Private/Admin
router.get("/", protect, authorize("admin"), getAllMatches);

export default router;
