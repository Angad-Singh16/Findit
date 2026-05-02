import rateLimit from 'express-rate-limit';

// ── Auth Rate Limiter ────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 10 : 100, // relaxed in dev
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── General API Limiter ──────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,  // 10 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // very relaxed in dev
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Chat Rate Limiter ────────────────────────────────────
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute
  max: process.env.NODE_ENV === 'production' ? 30 : 200,
  message: {
    success: false,
    message: 'Slow down! Too many messages sent.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export { authLimiter, apiLimiter, chatLimiter };