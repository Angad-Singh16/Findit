import express from 'express'
const router = express.Router();
import {
  startSession,
  getMySessions,
  getSessionById,
  sendMessage,
  closeSession,
} from '../controllers/chat.controller.js';

import protect  from '../middlewares/auth.middleware.js';

// @route   POST /api/chat/session
// @desc    Start a new chatbot session
// @access  Private
router.post('/session', protect, startSession);

// @route   GET /api/chat/sessions
// @desc    Get all chat sessions of logged-in user
// @access  Private
router.get('/sessions', protect, getMySessions);

// @route   GET /api/chat/session/:id
// @desc    Get a specific session with all messages
// @access  Private
router.get('/session/:id', protect, getSessionById);

// @route   POST /api/chat/session/:id/message
// @desc    Send a message to the chatbot
//          Body: { content: "I lost my wallet near the library" }
//          Bot detects intent and responds with:
//          - Suggested items (search_item)
//          - Form prompt (report_lost / report_found)
//          - Claim instructions (claim_item)
//          - FAQ answer (faq)
// @access  Private
router.post(
  '/session/:id/message',
  protect,
  sendMessage
);

// @route   PATCH /api/chat/session/:id/close
// @desc    Close/end a chat session
// @access  Private
router.patch('/session/:id/close', protect, closeSession);

export default router;