require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');

// 1. Initialize App FIRST (Must be before app.use)
const app = express();

// 2. Middleware
app.use(express.json());
app.use(cors());

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// 4. Define Routes (Now app exists, so this works)
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));