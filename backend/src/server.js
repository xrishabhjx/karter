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
import passport from './config/passport.js';


// Import routes
import authRoutes from "./routes/authRoutes.js"; 
import userRoutes from "./routes/userRoutes.js"; 
import partnerRoutes from './routes/partnerRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
// import vehicleRoutes from './routes/vehicleRoutes.js';
// import reviewRoutes from './routes/reviewRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
// import webhookRoutes from './routes/webhookRoutes.js';
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
    origin: process.env.SOCKET_CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Ensure socket module exists before requiring it
import socketHandler from './socket/index.js';

try {
  socketHandler(io);
} catch (err) {
  logger.error(`Socket Module Error: ${err.message}`);
}

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(passport.initialize()); // Initialize Passport

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
// app.use('/api/vehicles', vehicleRoutes);
// app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
// app.use('/api/webhooks', webhookRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to KARTER API' });
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

app.get('/api/deliveries', (req, res) => {
  const dummyDeliveries = [
    { id: 1, status: "Delivered", date: "2024-03-20" },
    { id: 2, status: "In Transit", date: "2024-03-22" }
  ];
  res.json(dummyDeliveries);
});

