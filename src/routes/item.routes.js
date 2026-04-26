import express from 'express';
const router = express.Router();
import {
  getAllItems,
  createItem,
  getMyItems,
  searchItems,
  getItemById,
  updateItem,
  updateItemStatus,
  deleteItem,
} from '../controllers/item.controller.js';
import protect from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';

// @route   GET /api/items
// @desc    Get all items with optional filters
//          Query: ?type=lost|found&category=Electronics&location=Library&page=1&limit=10
// @access  Public
router.get('/', getAllItems);

// @route   POST /api/items
// @desc    Create a new lost/found item report
// @access  Private
router.post(
  '/',
  protect,
  upload.array('images', 5),
  createItem
);

// @route   GET /api/items/my
// @desc    Get all items reported by logged-in user
// @access  Private
router.get('/my', protect, getMyItems);

// @route   GET /api/items/search
// @desc    Full-text search across title, description & tags
//          Query: ?q=blue+wallet&type=lost
// @access  Public
router.get('/search', searchItems);

// @route   GET /api/items/:id
// @desc    Get a single item by ID
// @access  Public
router.get('/:id', getItemById);

// @route   PUT /api/items/:id
// @desc    Update item details (owner or admin)
// @access  Private
router.put(
  '/:id',
  protect,
  upload.array('images', 5),
  updateItem
);

// @route   PATCH /api/items/:id/status
// @desc    Update status: open | claimed | resolved | expired
// @access  Private
router.patch('/:id/status', protect, updateItemStatus);

// @route   DELETE /api/items/:id
// @desc    Delete item (owner or admin)
// @access  Private
router.delete('/:id', protect, deleteItem);

export default router;