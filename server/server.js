
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is missing');
  process.exit(1);
}


// server.js — connection guard + graceful shutdown
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// import routes...
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');

const app = express();
app.use(express.json());
app.use(cors());
app.options('*', cors());

app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('FATAL: MONGO_URI not set. Add it in Railway Variables.');
  process.exit(1);
}

async function connectAndStart() {
  try {
    // avoid reconnecting if mongoose is already connected
    if (mongoose.connection.readyState === 1) {
      console.log('Mongoose already connected (readyState=1).');
    } else if (mongoose.connection.readyState === 2) {
      console.log('Mongoose connecting (readyState=2). Waiting...');
      // optionally wait until ready
    } else {
      console.log('Connecting mongoose...');
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
      console.log('MongoDB connected');
    }

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server listening on ${PORT}`);
    });

    // graceful shutdown
    const graceful = async (signal) => {
      console.log(`Received ${signal}. Closing server and mongoose connection...`);
      server.close(async (err) => {
        if (err) {
          console.error('Error closing http server', err);
          process.exit(1);
        }
        try {
          await mongoose.disconnect();
          console.log('Mongoose disconnected. Exiting.');
          process.exit(0);
        } catch (e) {
          console.error('Error disconnecting mongoose', e);
          process.exit(1);
        }
      });
    };

    process.on('SIGINT', () => graceful('SIGINT'));
    process.on('SIGTERM', () => graceful('SIGTERM'));
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception', err);
      graceful('uncaughtException');
    });
    process.on('unhandledRejection', (reason) => {
      console.error('Unhandled Rejection', reason);
      // optionally call graceful or exit
    });

  } catch (err) {
    console.error('Failed to connect/start:', err);
    process.exit(1);
  }
}

connectAndStart();
