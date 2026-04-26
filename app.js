import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// ── Middleware ────────────────────────────────────────────
import { apiLimiter } from './src/middlewares/ratelimit.middleware.js';
import errorHandler   from './src/middlewares/error.middleware.js';

// ── Routes ────────────────────────────────────────────────
import authRoutes         from './src/routes/auth.routes.js';
import userRoutes         from './src/routes/user.routes.js';
import itemRoutes         from './src/routes/item.routes.js';
import claimRoutes        from './src/routes/claim.routes.js';
import matchRoutes        from './src/routes/match.routes.js';
import chatRoutes         from './src/routes/chat.routes.js';
import notificationRoutes from './src/routes/notification.routes.js';

// __dirname workaround for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

// ── Global Middleware ─────────────────────────────────────

// CORS — allow frontend origin
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,   // allow cookies
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser (for httpOnly JWT cookie)
app.use(cookieParser());

// HTTP request logger (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiter — all API routes
app.use('/api', apiLimiter);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/items',         itemRoutes);
app.use('/api/claims',        claimRoutes);
app.use('/api/matches',       matchRoutes);
app.use('/api/chat',          chatRoutes);
app.use('/api/notifications', notificationRoutes);

// ── Health Check ──────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Campus Lost & Found API is running 🎓',
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── 404 Handler ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ── Global Error Handler (must be last) ───────────────────
app.use(errorHandler);

export default app;