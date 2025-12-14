// import axios from 'axios';

// // Ensure you add VITE_TMDB_API_KEY=your_key_here to your .env file!
// const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// export const axiosTMDB = axios.create({
//   baseURL: 'https://api.themoviedb.org/3',
//   params: {
//     api_key: API_KEY,
//     language: 'en-US',
//   },
// });

// const requests = {
//   trending: '/trending/movie/week',
//   topRated: '/movie/top_rated',
//   action: '/discover/movie?with_genres=28',
//   comedy: '/discover/movie?with_genres=35',
//   horror: '/discover/movie?with_genres=27',
// };

// export default requests;

import axios from 'axios';

// 👇 YOUR REAL API KEY
export const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const BASE_URL = 'https://api.themoviedb.org/3';

export const axiosTMDB = axios.create({
  baseURL: BASE_URL,
});

const requests = {
  trending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
  netflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
  topRated: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  action: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
  comedy: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
  horror: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
  romance: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  documentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
  // 👇 Search Helper Function
  search: (query) => `/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`
};

export default requests;