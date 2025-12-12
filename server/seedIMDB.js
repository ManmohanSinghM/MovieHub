require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');

const adjectives = ['Dark', 'Golden', 'Silent', 'Lost', 'Hidden', 'Brave', 'Wild', 'Infinite', 'Secret', 'Broken'];
const nouns = ['Knight', 'Kingdom', 'Dream', 'Future', 'Legend', 'Warrior', 'Soul', 'Star', 'Memory', 'Promise'];
const genres = ['Action', 'Drama', 'Sci-Fi', 'Comedy', 'Thriller'];

const generateMovies = (count) => {
  const movies = [];
  for (let i = 0; i < count; i++) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const genre = genres[Math.floor(Math.random() * genres.length)];
    
    movies.push({
      title: `The ${adj} ${noun} ${i + 1}`, // e.g., "The Dark Knight 1"
      description: `A gripping ${genre} movie about a ${adj.toLowerCase()} journey to find the ${noun.toLowerCase()}.`,
      rating: (Math.random() * 5 + 4).toFixed(1), // Random rating between 4.0 and 9.0
      releaseDate: new Date(+(new Date()) - Math.floor(Math.random() * 100000000000)), // Random past date
      duration: `${90 + Math.floor(Math.random() * 90)} min`
    });
  }
  return movies;
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    console.log('Clearing old movies...');
    await Movie.deleteMany({});

    console.log('Generating 100 new movies...');
    const fakeMovies = generateMovies(100);
    
    await Movie.insertMany(fakeMovies);
    console.log(`✅ Success! Added ${fakeMovies.length} movies to the database.`);
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedDB();