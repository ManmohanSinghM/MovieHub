const Queue = require('bull');
const Movie = require('../models/Movie');

// 1. Setup the Queue
// We use the REDIS_URL from your .env file
const movieQueue = new Queue('movie-insertion', process.env.REDIS_URL);

// 2. The "Worker" - This processes the jobs in the background
movieQueue.process(async (job) => {
  console.log('⚡ Background Worker: Processing new movie...');
  
  try {
    const movieData = job.data;
    
    // Save to MongoDB
    const newMovie = new Movie(movieData);
    await newMovie.save();
    
    console.log(`✅ Success: "${movieData.title}" added to database.`);
  } catch (error) {
    console.error('❌ Worker Error:', error.message);
  }
});

module.exports = movieQueue;