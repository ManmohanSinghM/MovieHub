require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // ✅ NEW: Required for file paths

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

// 1. CORS
app.use(cors());
app.options('*', cors());

// 2. SECURITY HEADERS
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

// 3. BODY PARSER
app.use(express.json());

// ---- API ROUTES (Must come BEFORE frontend) ----
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);


// =========================================================
// ✅ NEW: SERVE FRONTEND (The "dist" folder)
// =========================================================

// 1. Tell Express to use the "dist" folder for static files
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// 2. The "Catch-All" Route
// If a user goes to a page like /login or /collection directly,
// send them the React app (index.html) so React can handle the routing.
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});
// =========================================================


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

    // Graceful Shutdown
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