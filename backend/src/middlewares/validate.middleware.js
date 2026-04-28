import { body, validationResult } from 'express-validator';

// Middleware: run validation result check
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

// ── Auth Rules ───────────────────────────────────────────
const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('campus_id').notEmpty().withMessage('Campus ID is required'),
];

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// ── Item Rules ───────────────────────────────────────────
const itemRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('type')
    .isIn(['lost', 'found'])
    .withMessage('Type must be lost or found'),
  body('category.name').notEmpty().withMessage('Category is required'),
  body('location.name').notEmpty().withMessage('Location is required'),
];

// ── Claim Rules ──────────────────────────────────────────
const claimRules = [
  body('item_id').notEmpty().withMessage('Item ID is required'),
  body('proof_description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Proof description must be at least 10 characters'),
];

// ── Chat Rules ───────────────────────────────────────────
const messageRules = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Message content cannot be empty')
    .isLength({ max: 1000 })
    .withMessage('Message too long (max 1000 chars)'),
];

export default {
  validate,
  registerRules,
  loginRules,
  itemRules,
  claimRules,
  messageRules,
};