import 'dotenv/config';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import app from './app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 5000;

// Create HTTP server (needed for Socket.IO)
const server = http.createServer(app);

// ── Socket.IO Setup ───────────────────────────────────────
const io = new SocketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Make io accessible in controllers via app
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // Each user joins their own room for private notifications
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// Export io for use in controllers
export { io };

// ── Start Server ──────────────────────────────────────────
const startServer = async () => {
  try {
    // 1. Connect to MongoDB first
    await connectDB();

    // 2. Start listening
    server.listen(PORT, () => {
      console.log(``);
      console.log(`  🎓 Campus Lost & Found API`);
      console.log(`  🚀 Server running on port ${PORT}`);
      console.log(`  🌍 Mode: ${process.env.NODE_ENV}`);
      console.log(`  📡 URL: http://localhost:${PORT}/api/health`);
      console.log(``);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

// ── Graceful Crash Handling ───────────────────────────────

// Unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err.message);
  server.close(() => process.exit(1));
});

// Uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err.message);
  process.exit(1);
});