import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import taskRoutes from './routes/tasks';
import departmentRoutes from './routes/departments';
import projectRoutes from './routes/projects';
import notificationRoutes from './routes/notifications';

// Middleware
import { authenticateToken } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const prisma = new PrismaClient();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Socket.io для реального времени
io.on('connection', (socket) => {
  console.log('Пользователь подключен:', socket.id);

  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`Пользователь ${socket.id} присоединился к комнате ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключен:', socket.id);
  });
});

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes);
app.use('/api/departments', authenticateToken, departmentRoutes);
app.use('/api/projects', authenticateToken, projectRoutes);
app.use('/api/notifications', authenticateToken, notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM получен, закрываем сервер...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Сервер закрыт');
    process.exit(0);
  });
});

export { io };
