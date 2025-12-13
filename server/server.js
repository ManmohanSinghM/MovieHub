// server.js — production ready
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');

// ---- ENV VALIDATION ----
if (!process.env.MONGO_URI) {
  console.error('FATAL: MONGO_URI not set');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is missing');
  process.exit(1);
}

// ---- APP INIT ----
const app = express();
app.use(express.json());
app.use(cors());
app.options('*', cors());

// ---- ROOT & HEALTH ----
app.get('/', (req, res) => {
  res.json({
    message: 'MERN Movie App API is running',
    health: '/health',
    movies: '/api/movies'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ---- ROUTES ----
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// ---- SERVER ----
const PORT = process.env.PORT || 5000;

async function connectAndStart() {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 15000
      });
      console.log('MongoDB connected');
    }

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });

    const graceful = async (signal) => {
      console.log(`Received ${signal}. Shutting down...`);
      server.close(async () => {
        await mongoose.disconnect();
        process.exit(0);
      });
    };

    process.on('SIGINT', graceful);
    process.on('SIGTERM', graceful);
    process.on('uncaughtException', graceful);
    process.on('unhandledRejection', graceful);

  } catch (err) {
    console.error('Startup failed:', err);
    process.exit(1);
  }
}

connectAndStart();
