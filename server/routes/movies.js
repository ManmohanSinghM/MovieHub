const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const movieQueue = require('../queues/movieQueue');
const { verifyToken, isAdmin } = require('../middleware/auth'); // We need to create this next

// @desc    Add a movie (Pushes to Queue)
// @route   POST /api/movies
// @access  Admin
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    // Add job to the queue instead of saving directly
    await movieQueue.add(req.body);
    
    res.status(202).json({ 
      message: 'Request accepted. Movie is being processed in the background.',
      movie: req.body 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all movies (with Pagination, Search, & SORTING)
// @route   GET /api/movies
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sort = 'createdAt' } = req.query;

    // 1. Search Logic
    const query = search 
      ? { 
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    // 2. Sort Logic
    let sortOption = {};
    if (sort === 'rating') sortOption = { rating: -1 }; // Highest rating first
    else if (sort === 'year') sortOption = { releaseDate: -1 }; // Newest first
    else if (sort === 'title') sortOption = { title: 1 }; // A-Z
    else sortOption = { createdAt: -1 }; // Default: Newest added

    const movies = await Movie.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOption);

    const total = await Movie.countDocuments(query);

    res.json({
      movies,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a movie
// @route   DELETE /api/movies/:id
// @access  Admin
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Movie removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;