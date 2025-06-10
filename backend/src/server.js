import dotenv from 'dotenv';
dotenv.config();  // Load environment variables

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './utils/logger.js';
import limiter from './middleware/rateLimiter.js';

// Import routes
import authRoutes from "./routes/authRoutes.js"; 
import userRoutes from "./routes/userRoutes.js"; 
import partnerRoutes from './routes/partnerRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import EnterpriseForm from './models/EnterpriseForm.js';

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Connect to MongoDB
connectDB().catch((err) => {
  logger.error(`MongoDB Connection Error: ${err.message}`);
  process.exit(1); // Exit if DB connection fails
});

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('message', (data) => {
    console.log('Received message:', data);
    io.emit('message', data); // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Apply rate limiter to all requests
app.use(limiter);

// Make io accessible to route handlers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to KARTER API' });
});

// Enterprise form endpoint
app.post('/enterprise', express.json(), async (req, res) => {
  try {
    const form = new EnterpriseForm(req.body);
    await form.save();
    res.status(201).json({ message: 'Form saved successfully!' });
  } catch (err) {
    console.error('Error saving form:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Mock deliveries endpoint for testing
app.get('/api/deliveries', (req, res) => {
  const dummyDeliveries = [
    { 
      id: 'KTR12345678', 
      status: "in-progress", 
      date: "2024-03-20",
      time: "14:30",
      pickupLocation: "Sector 18, Noida, UP",
      dropLocation: "Connaught Place, New Delhi",
      price: 149.99
    },
    { 
      id: 'KTR87654321', 
      status: "pending", 
      date: "2024-03-22",
      time: "16:00",
      pickupLocation: "Lajpat Nagar, New Delhi",
      dropLocation: "Saket, New Delhi",
      price: 99.50
    }
  ];
  res.json(dummyDeliveries);
});

// Error handling middleware
app.use(errorHandler);

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  httpServer.close(() => process.exit(1));
});

export { app, httpServer };