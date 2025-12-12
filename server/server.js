// server.js (copy-paste this file)
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');

const app = express();

// Middlewares
app.use(express.json());
// Allow all origins temporarily for testing. Tighten origin list later.
app.use(cors());
// Ensure preflight requests are handled before reaching routes
app.options('*', cors());

// Health route (easy check)
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Register routes AFTER middleware
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// Validate required env vars early
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('FATAL: MONGO_URI not set in environment. Add it in Railway variables.');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not set. Set it in Railway variables to sign tokens.');
}

// Start: connect to Mongo first, then start listening
const PORT = process.env.PORT || 5000;

console.log('Startup: attempting to connect to MongoDB...');
mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 })
  .then(() => {
    console.log('MongoDB connected successfully.');
    // Start server AFTER DB connection
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is listening on port ${PORT} (bound to 0.0.0.0)`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection failed. Exiting with error:\n', err);
    // Exit so Railway shows failure and doesn't return 502 silently
    process.exit(1);
  });

// Helpful global handlers so we log crashes
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
