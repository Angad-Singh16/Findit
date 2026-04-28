import rateLimit from 'express-rate-limit';

// ── Auth Rate Limiter (strict) ───────────────────────────
// Applied to: POST /api/auth/login, /api/auth/register
// Allows 10 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,  // Return rate limit info in headers
  legacyHeaders: false,
});

// ── General API Limiter (relaxed) ───────────────────────
// Applied globally in app.js
// Allows 100 requests per 10 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Chat Rate Limiter (medium) ───────────────────────────
// Applied to: POST /api/chat/session/:id/message
// Allows 30 messages per minute (prevents bot spam)
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: {
    success: false,
    message: 'Slow down! Too many messages sent.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
export { authLimiter, apiLimiter, chatLimiter };