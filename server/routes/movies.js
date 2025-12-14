const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
// 👇 FIX: Use destructuring to match the exports in auth.js
const { verifyToken, isAdmin } = require('../middleware/auth'); 

// ==========================================
// 1. GET ALL MOVIES (Search, Sort, Pagination)
// ==========================================
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sort = 'createdAt' } = req.query;

    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    let sortOption = {};
    if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'year') sortOption = { releaseDate: -1 };
    else if (sort === 'title') sortOption = { title: 1 };
    else sortOption = { createdAt: -1 };

    const movies = await Movie.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOption);

    const total = await Movie.countDocuments(query);

    res.json({
      movies,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 2. SAVE TMDB MOVIE TO COLLECTION
// ==========================================
router.post('/save', verifyToken, async (req, res) => {
  try {
    const { title, description, rating, year, duration, poster, backdrop } = req.body;

    // A. Check for duplicates
    const existingMovie = await Movie.findOne({ title });
    if (existingMovie) {
      return res.status(409).json({ message: 'Movie already exists in your collection' });
    }

    // B. Create new movie
    const newMovie = new Movie({
      title,
      description: description || "No description available",
      rating: rating === 'N/A' ? 0 : rating,
      year: year || '2024',
      duration: duration === 'N/A' ? '0' : duration,
      poster,
      backdrop,
      createdBy: req.user.id
    });

    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    console.error("Save Error:", err); // Log error to terminal
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 3. MANUALLY ADD MOVIE (Admin Only)
// ==========================================
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const newMovie = new Movie({
      ...req.body,
      createdBy: req.user.id
    });
    await newMovie.save();
    res.status(201).json({ message: 'Movie added', movie: newMovie });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 4. DELETE MOVIE (Admin Only)
// ==========================================
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Movie removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;