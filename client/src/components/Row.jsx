import { useEffect, useState } from 'react';
import { axiosTMDB } from '../api/tmdb';

const Row = ({ title, fetchUrl, onSelect }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await axiosTMDB.get(fetchUrl);
        setMovies(request.data.results || []);
      } catch (error) {
        console.error("TMDB Error:", error);
      }
    }
    fetchData();
  }, [fetchUrl]);

  if (!movies.length) return null;

  return (
    <div className="pl-6 mb-8">
      <h2 className="text-xl font-semibold text-white mb-4 pl-1 border-l-4 border-red-600">
        {title}
      </h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-2">
        {movies.map((movie) => (
          <div key={movie.id} className="relative group flex-shrink-0">
             <img
                onClick={() => onSelect(movie)} // ✅ CLICK HANDLER
                className="w-[160px] h-[240px] rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer object-cover shadow-lg border border-transparent hover:border-white/20"
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title || movie.name}
             />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Row;