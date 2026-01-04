const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const net = require('net');
// Deleted: const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const { errorHandler } = require('./middleware/error.middleware');
const security = require('./middleware/security.middleware');
const { setIo } = require('./utils/socket');
const messagesController = require('./controllers/messages.controller');

// Load environment variables early and from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const { pool } = require('./config/db');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  },
  pingInterval: 25000,
  pingTimeout: 60000
});
setIo(io);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(security.helmetMiddleware);
app.use(security.rateLimiter);
app.use(security.xssClean);
app.use(security.mongoSanitize);
app.use(morgan('dev'));

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Define routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/students', require('./routes/student.routes'));
app.use('/api/courses', require('./routes/course.routes'));
app.use('/api/grades', require('./routes/grade.routes'));
app.use('/api/assignments', require('./routes/assignment.routes'));
app.use('/api/messages', require('./routes/message.routes'));
app.use('/api/events', require('./routes/event.routes'));
app.use('/api/presence', require('./routes/presence.routes'));
app.use('/api/teacher', require('./routes/teacher.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/academics', require('./routes/academics.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/finance', require('./routes/finance.routes'));
app.use('/api/messages', require('./routes/messages.routes'));
app.use('/api/profile', require('./routes/profile.routes'));
app.use('/api/support', require('./routes/support.routes'));
app.use('/api/admissions', require('./routes/admission.routes'));

// API health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// PostgreSQL health check (uses stub in dev mode)
app.get('/api/db/health', async (req, res) => {
  try {
    if (process.env.AUTH_DEV_MODE === 'true') {
      return res.status(200).json({ ok: true, mode: 'dev', now: new Date().toISOString() });
    }
    const result = await pool.query('SELECT NOW() as now');
    res.status(200).json({ ok: true, now: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});
// Socket.io for real-time notifications
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Pass the socket to the messages controller
  messagesController.handleConnection(socket);
  
  // Send a welcome notification to verify real-time connection
  socket.emit('notification', {
    type: 'system',
    message: 'Connected to real-time updates',
    timestamp: new Date().toISOString()
  });
  
  // Join student-specific room for targeted notifications
  socket.on('join', (studentId) => {
    socket.join(`student-${studentId}`);
    console.log(`Student ${studentId} joined their notification room`);
  });

  // Join generic per-user room for messaging and notifications
  socket.on('joinUser', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Client acknowledges receipt of a specific message id
  socket.on('message:ack', async ({ messageId }) => {
    try {
      if (process.env.AUTH_DEV_MODE !== 'true') {
        const res = await pool.query('UPDATE messages SET delivered_at = NOW() WHERE id = $1 AND delivered_at IS NULL RETURNING from_user_id', [messageId]);
        if (res.rows.length) {
          io.to(`user-${res.rows[0].from_user_id}`).emit('message:status', { messageId, delivered: true });
        }
      }
    } catch (e) {
      console.error('Failed to mark delivered', e.message);
    }
  });

  socket.on('typing:start', async ({ threadId, userId }) => {
    try {
      if (process.env.AUTH_DEV_MODE === 'true') return;
      const res = await pool.query('SELECT user_id FROM message_participants WHERE thread_id=$1 AND user_id<>$2', [threadId, userId]);
      res.rows.forEach(r => io.to(`user-${r.user_id}`).emit('typing', { threadId, userId, typing: true }));
    } catch {}
  });

  socket.on('typing:stop', async ({ threadId, userId }) => {
    try {
      if (process.env.AUTH_DEV_MODE === 'true') return;
      const res = await pool.query('SELECT user_id FROM message_participants WHERE thread_id=$1 AND user_id<>$2', [threadId, userId]);
      res.rows.forEach(r => io.to(`user-${r.user_id}`).emit('typing', { threadId, userId, typing: false }));
    } catch {}
  });

  socket.on('joinTeacher', ({ teacherId }) => {
    try { socket.join(`teacher-${teacherId}`) } catch {}
  })

  // Dev-only triggers for teacher dashboard live updates
  socket.on('dev:assignments:update', ({ teacherId, pending }) => {
    try { io.to(`teacher-${teacherId}`).emit('assignments:update', { pendingAssignments: pending }) } catch {}
  })
  socket.on('dev:attendance:update', ({ teacherId, total }) => {
    try { io.to(`teacher-${teacherId}`).emit('attendance:update', { totalStudents: total }) } catch {}
  })
  socket.on('dev:timetable:update', ({ teacherId, today }) => {
    try { io.to(`teacher-${teacherId}`).emit('timetable:update', { today }) } catch {}
  })

  socket.on('presence:online', async ({ userId, role, classId }) => {
    try {
      if (process.env.AUTH_DEV_MODE === 'true') {
        try { if (!global.__presenceDev) global.__presenceDev = new Map(); } catch {}
        global.__presenceDev.set(userId, { user_id: userId, role, class_id: classId || null, is_online: true, last_seen: new Date().toISOString() })
        io.emit('presence:update', { userId, role, classId, is_online: true, last_seen: new Date().toISOString() });
        return;
      }
      await pool.query(
        'INSERT INTO user_presence (user_id, role, class_id, is_online, last_seen) VALUES ($1,$2,$3,TRUE,NOW()) ON CONFLICT (user_id) DO UPDATE SET role=EXCLUDED.role, class_id=EXCLUDED.class_id, is_online=TRUE, last_seen=NOW()',
        [userId, role, classId || null]
      );
      io.emit('presence:update', { userId, role, classId, is_online: true });
    } catch (e) { console.error('presence:online failed', e.message); }
  });

  socket.on('presence:offline', async ({ userId }) => {
    try {
      if (process.env.AUTH_DEV_MODE === 'true') {
        try { if (!global.__presenceDev) global.__presenceDev = new Map(); } catch {}
        const prev = global.__presenceDev.get(userId)
        global.__presenceDev.set(userId, { ...(prev || { user_id: userId }), is_online: false, last_seen: new Date().toISOString() })
        io.emit('presence:update', { userId, is_online: false, last_seen: new Date().toISOString() });
        return;
      }
      await pool.query('UPDATE user_presence SET is_online=FALSE, last_seen=NOW() WHERE user_id=$1', [userId]);
      io.emit('presence:update', { userId, is_online: false });
    } catch (e) { console.error('presence:offline failed', e.message); }
  });
});

// Global socket instance for use in controllers
global.io = io;

// Connect to MongoDB
// Deleted MongoDB connect function and invocation to avoid unhandled rejections while migrating to PostgreSQL
async function findFreePort(startPort) {
  const tryPort = (p) => new Promise((resolve, reject) => {
    const tester = net.createServer()
      .once('error', (err) => {
        if (err && (err.code === 'EADDRINUSE' || err.code === 'EACCES')) resolve(null);
        else reject(err);
      })
      .once('listening', () => {
        tester.close(() => resolve(p));
      })
      .listen(p, '0.0.0.0');
  });
  for (let p = Number(startPort); p < Number(startPort) + 50; p++) {
    const res = await tryPort(p);
    if (res !== null) return res;
  }
  throw new Error('No free port found');
}

const DEFAULT_PORT = Number(process.env.PORT) || 5001;
let activePort = DEFAULT_PORT;
findFreePort(DEFAULT_PORT)
  .then((port) => {
    activePort = port;
    server.listen(port, '0.0.0.0', () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
      console.log('AUTH_DEV_MODE =', process.env.AUTH_DEV_MODE);
      ensureMessageTables();
    });
  })
  .catch((err) => {
    console.error('Port selection failed', err.message);
    process.exit(1);
  });

server.on('error', async (err) => {
  if (err && err.code === 'EADDRINUSE') {
    try {
      const next = await findFreePort(activePort + 1);
      activePort = next;
      server.listen(next, '0.0.0.0');
    } catch (e) {
      process.exit(1);
    }
  }
});

function shutdown() {
  try { io.close(); } catch {}
  server.close(() => process.exit(0));
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Attempt to connect to MongoDB (will not block server startup)
// Deleted process.on('unhandledRejection') block tied to MongoDB
// Test broadcast endpoint for real-time verification
app.post('/api/test/broadcast', (req, res) => {
  const { message = 'Test broadcast', type = 'info' } = req.body || {};
  io.emit('notification', {
    type,
    message,
    timestamp: new Date().toISOString(),
  });
  res.status(200).json({ ok: true });
});

module.exports = { app, io };
// Ensure message tables exist
async function ensureMessageTables() {
  const createThreads = `
    CREATE TABLE IF NOT EXISTS message_threads (
      id UUID PRIMARY KEY,
      subject TEXT,
      last_message_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  const createParticipants = `
    CREATE TABLE IF NOT EXISTS message_participants (
      thread_id UUID REFERENCES message_threads(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL,
      PRIMARY KEY (thread_id, user_id)
    );
  `;
  const createMessages = `
    CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY,
      thread_id UUID REFERENCES message_threads(id) ON DELETE CASCADE,
      from_user_id TEXT NOT NULL,
      from_role TEXT NOT NULL,
      to_user_id TEXT NOT NULL,
      to_role TEXT NOT NULL,
      subject TEXT,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      delivered_at TIMESTAMPTZ,
      read_at TIMESTAMPTZ
    );
  `;
  const createAttachments = `
    CREATE TABLE IF NOT EXISTS message_attachments (
      id UUID PRIMARY KEY,
      message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
      filename TEXT NOT NULL,
      mime TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      path TEXT NOT NULL,
      uploaded_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  const createFlags = `
    CREATE TABLE IF NOT EXISTS message_flags (
      user_id TEXT NOT NULL,
      message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
      flagged_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (user_id, message_id)
    );
  `;
  const createArchives = `
    CREATE TABLE IF NOT EXISTS message_archives (
      user_id TEXT NOT NULL,
      thread_id UUID REFERENCES message_threads(id) ON DELETE CASCADE,
      archived_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (user_id, thread_id)
    );
  `;
  const createAudit = `
    CREATE TABLE IF NOT EXISTS message_audit (
      id UUID PRIMARY KEY,
      actor_user_id TEXT NOT NULL,
      action TEXT NOT NULL,
      message_id UUID,
      thread_id UUID,
      metadata JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  const createPresence = `
    CREATE TABLE IF NOT EXISTS user_presence (
      user_id TEXT PRIMARY KEY,
      role TEXT NOT NULL,
      class_id TEXT,
      is_online BOOLEAN DEFAULT FALSE,
      last_seen TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  try {
    if (process.env.AUTH_DEV_MODE !== 'true') {
      await pool.query(createThreads);
      await pool.query(createParticipants);
      await pool.query(createMessages);
      await pool.query(createAttachments);
      await pool.query(createFlags);
      await pool.query(createArchives);
      await pool.query(createAudit);
      await pool.query(createPresence);
      console.log('Message tables ensured');
    }
  } catch (e) {
    console.error('Failed to ensure message tables', e.message);
  }
}