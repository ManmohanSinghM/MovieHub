import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axios'; 
import requests, { axiosTMDB, API_KEY } from '../api/tmdb'; 
import Row from '../components/Row'; 
import Loader from '../components/Loader'; 
import { MdSearch, MdSort, MdDelete, MdAdd, MdClose, MdAccessTime, MdStar, MdPlayArrow, MdBookmarkAdd, MdPublic, MdExplore } from 'react-icons/md';

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  
  const [localMovies, setLocalMovies] = useState([]);
  const [tmdbSearchResults, setTmdbSearchResults] = useState([]); 
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [heroMovie, setHeroMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // --- HELPER: FALLBACK IMAGE ---
  const handleImageError = (e, title) => {
    e.target.onerror = null; 
    e.target.src = `https://placehold.co/600x900/111/FFF?text=${encodeURIComponent(title || 'No Image')}`;
  };

  const formatDuration = (minutes) => {
    if (!minutes || minutes === 'N/A' || minutes === '0') return 'N/A';
    const totalMins = parseInt(minutes);
    if (isNaN(totalMins)) return minutes; 
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const normalizeMovie = (movie, source) => {
    if (!movie) return null;

    if (source === 'tmdb') {
      return {
        id: movie.id, 
        title: movie.title || movie.name || movie.original_name,
        description: movie.overview || "No description available.",
        rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
        year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
        // Default to N/A initially (we fetch real duration on click)
        duration: 'N/A', 
        image: movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
            : `https://placehold.co/600x900/111/FFF?text=No+Poster`,
        backdrop: movie.backdrop_path 
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` 
            : null,
        isLocal: false 
      };
    }

    // LOCAL MOVIE (Already has duration)
    return {
      id: movie._id,
      title: movie.title,
      description: movie.description,
      rating: movie.rating,
      year: movie.year || '2024',
      duration: formatDuration(movie.duration),
      image: movie.poster || `https://placehold.co/600x900/111/FFF?text=${encodeURIComponent(movie.title)}`, 
      backdrop: movie.backdrop || null,
      isLocal: true
    };
  };

  // --- 🔍 UNIFIED SEARCH LOGIC ---
  useEffect(() => {
    const performSearch = async () => {
      try {
        const { data } = await api.get(`/movies?search=${search}&sort=${sort}`);
        if (Array.isArray(data)) setLocalMovies(data);
        else if (data.movies) setLocalMovies(data.movies);
        else setLocalMovies([]);
      } catch (err) {
        console.error('Error fetching local movies:', err);
      }

      if (search.length > 2) {
        setIsSearching(true);
        try {
          const searchUrl = `/search/movie?api_key=${API_KEY}&language=en-US&query=${search}&page=1&include_adult=false`;
          const tmdbRes = await axiosTMDB.get(searchUrl);
          setTmdbSearchResults(tmdbRes.data.results || []);
        } catch (err) {
          console.error("TMDB Search Error:", err);
        }
      } else {
        setIsSearching(false);
        setTmdbSearchResults([]);
      }
      
      setLoading(false);
    };

    const delayDebounce = setTimeout(() => performSearch(), 500);
    return () => clearTimeout(delayDebounce);
  }, [search, sort]);

  // --- HERO MOVIE ---
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const tmdbRes = await axiosTMDB.get(requests.trending);
        const random = Math.floor(Math.random() * tmdbRes.data.results.length);
        const hero = tmdbRes.data.results[random];
        
        // Fetch hero details to get duration if needed (optional)
        setHeroMovie(hero);
      } catch (err) { console.error('TMDB Error:', err); }
    };
    fetchHero();
  }, []);

  // --- ACTIONS ---
  const handleDelete = async (e, id) => {
    e.stopPropagation(); 
    if (!window.confirm('Delete this movie?')) return;
    try {
      await api.delete(`/movies/${id}`);
      setLocalMovies((prev) => prev.filter((m) => m._id !== id));
      if (selectedMovie?.id === id) setSelectedMovie(null);
    } catch (err) { alert('Error deleting movie'); }
  };

  const handleSaveToCollection = async () => {
    if (!user) {
        alert("Please login to save movies!");
        return;
    }
    // We need to convert formatted duration back to minutes for storage (optional, or store as string)
    // For simplicity, we just save the string like "2h 15m" or just pass it as is
    // If your backend expects a number, you might want to parse it. 
    // But since we are saving TMDB data, let's just save the duration string we have.

    try {
        const { data } = await api.post('/movies/save', {
            title: selectedMovie.title,
            description: selectedMovie.description,
            rating: selectedMovie.rating,
            year: selectedMovie.year,
            duration: selectedMovie.duration === 'N/A' ? '0' : selectedMovie.duration, // Save what we see
            poster: selectedMovie.image,
            backdrop: selectedMovie.backdrop
        });

        const newLocalMovie = { ...data, _id: data._id };
        setLocalMovies([newLocalMovie, ...localMovies]);
        
        alert("Movie added to your collection!");
        setSelectedMovie(null);
        setSearch(''); 
    } catch (err) {
        alert(err.response?.data?.message || 'Error saving movie');
    }
  };

  // 👇 UPDATED: Fetch Full Details on Click
  const handleMovieClick = async (movie, source) => {
      // 1. Show what we have immediately
      const basicData = normalizeMovie(movie, source);
      setSelectedMovie(basicData);

      // 2. If it's from TMDB, fetch the specific details to get runtime
      if (source === 'tmdb') {
          try {
              const detailRes = await axiosTMDB.get(`/movie/${movie.id}?api_key=${API_KEY}&language=en-US`);
              const runtime = detailRes.data.runtime; // Runtime in minutes
              
              // 3. Update the modal with the real duration
              setSelectedMovie(prev => ({
                  ...prev,
                  duration: formatDuration(runtime)
              }));
          } catch (err) {
              console.error("Could not fetch movie details", err);
          }
      }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans selection:bg-red-600 selection:text-white">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-red-600 hover:opacity-80 transition">
            MOVIE<span className="text-white">HUB</span>
          </Link>
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <span className="hidden md:block text-sm text-gray-400">Hi, {user.username}</span>
                {user.role === 'admin' && (
                  <Link to="/add-movie" className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 rounded-full hover:bg-red-700 transition shadow-lg shadow-red-600/25">
                    <MdAdd size={18} /> Add Movie
                  </Link>
                )}
                <button onClick={logout} className="text-sm font-medium text-gray-300 hover:text-white transition">Logout</button>
              </>
            ) : (
              <Link to="/login" className="px-6 py-2 text-sm font-medium bg-white text-background rounded-full hover:bg-gray-200 transition">Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      {!isSearching && (
        <header 
          className="relative h-[500px] flex items-center justify-center bg-cover bg-center"
          style={{ 
              backgroundImage: heroMovie?.backdrop_path 
                  ? `url(https://image.tmdb.org/t/p/original${heroMovie.backdrop_path})`
                  : 'none'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#141414]/60 via-transparent to-[#141414]" />
          <div className="relative z-10 text-center px-4 max-w-4xl mt-20">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-2xl tracking-tight">
              {heroMovie?.title || heroMovie?.name || "Welcome to MovieHub"}
            </h1>
            <p className="text-lg text-gray-200 line-clamp-2 max-w-2xl mx-auto drop-shadow-md">
              {heroMovie?.overview}
            </p>
          </div>
        </header>
      )}

      {/* --- SEARCH & COLLECTION --- */}
      <section className={`max-w-7xl mx-auto px-6 ${isSearching ? 'pt-24' : 'py-12'}`}>
        
        {/* HEADER & SEARCH */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold border-l-4 border-red-600 pl-3">
              {isSearching ? `Results for "${search}"` : "My Collection"}
            </h2>
            
            <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                    <MdSearch className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input 
                        id="search-input" name="search"
                        type="text" 
                        placeholder="Search your collection & TMDB..." 
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#1F1F1F] border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-red-600 transition placeholder-gray-500 text-white shadow-xl"
                    />
                </div>
                {!isSearching && (
                  <div className="relative">
                      <MdSort className="absolute left-3 top-3 text-gray-400" size={20} />
                      <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-[#1F1F1F] border border-white/10 rounded-full py-2 pl-10 pr-8 text-sm focus:outline-none focus:border-red-600 appearance-none cursor-pointer text-white">
                          <option value="createdAt">Newest</option>
                          <option value="rating">Top Rated</option>
                          <option value="year">Year</option>
                          <option value="title">A-Z</option>
                      </select>
                  </div>
                )}
            </div>
        </div>

        {/* 1. LOCAL RESULTS */}
        {localMovies.length > 0 && (
          <div className="mb-12">
            {isSearching && <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Matches in My Collection</h3>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {localMovies.map((movie) => {
                  const normalized = normalizeMovie(movie, 'local');
                  return (
                    <div 
                      key={normalized.id} 
                      onClick={() => setSelectedMovie(normalized)} 
                      className="bg-[#1F1F1F] rounded-xl overflow-hidden border border-white/5 shadow-lg hover:shadow-red-600/20 hover:border-red-600/50 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full relative group cursor-pointer"
                    >
                      {user?.role === 'admin' && (
                          <button onClick={(e) => handleDelete(e, normalized.id)} className="absolute top-2 right-2 z-10 bg-black/60 backdrop-blur p-2 rounded-full text-red-500 hover:bg-red-600 hover:text-white transition opacity-0 group-hover:opacity-100">
                              <MdDelete size={16} />
                          </button>
                      )}
                      <div className="h-48 overflow-hidden relative bg-black">
                          <img 
                              src={normalized.image}
                              alt={normalized.title}
                              onError={(e) => handleImageError(e, normalized.title)} 
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-500"
                          />
                          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur px-2 py-1 rounded text-xs font-bold text-yellow-400 border border-white/10 flex items-center gap-1">
                              <MdStar /> {normalized.rating}
                          </div>
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                          <h3 className="text-lg font-bold text-white mb-1 leading-tight line-clamp-1">{normalized.title}</h3>
                          <div className="text-xs text-red-600 mb-3 font-semibold">{normalized.year}</div>
                          <p className="text-sm text-gray-400 mb-4 flex-grow line-clamp-3">
                              {normalized.description}
                          </p>
                      </div>
                    </div>
                  );
              })}
            </div>
          </div>
        )}

        {/* 2. GLOBAL RESULTS */}
        {isSearching && tmdbSearchResults.length > 0 && (
          <div>
            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
               <MdPublic /> Global Search Results (TMDB)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tmdbSearchResults.map((movie) => {
                  const normalized = normalizeMovie(movie, 'tmdb');
                  if (!movie.poster_path) return null; 

                  return (
                    <div 
                      key={normalized.id} 
                      onClick={() => handleMovieClick(movie, 'tmdb')} // 👈 Updated Handler
                      className="bg-[#1F1F1F] rounded-xl overflow-hidden border border-white/5 shadow-lg hover:shadow-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full relative group cursor-pointer"
                    >
                      <div className="h-64 overflow-hidden relative bg-black">
                          <img 
                              src={normalized.image}
                              alt={normalized.title}
                              onError={(e) => handleImageError(e, normalized.title)} 
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">
                            TMDB
                          </div>
                      </div>
                      <div className="p-4">
                          <h3 className="text-sm font-bold text-white mb-1 leading-tight line-clamp-1">{normalized.title}</h3>
                          <div className="flex justify-between items-center mt-2">
                             <div className="text-xs text-yellow-400 flex items-center gap-1"><MdStar /> {normalized.rating}</div>
                             <div className="text-xs text-gray-500">{normalized.year}</div>
                          </div>
                      </div>
                    </div>
                  );
              })}
            </div>
          </div>
        )}
      </section>

      {/* --- TRENDING SECTION --- */}
      {!isSearching && (
        <section className="pb-20 pt-16 border-t border-white/5 bg-gradient-to-b from-[#0a0a0a] to-black">
           <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center gap-2">
              <MdExplore className="text-red-600 text-2xl" />
              <h3 className="text-2xl text-white font-bold tracking-wide">Discover & Trending</h3>
           </div>
           
           <Row title="Trending Now" fetchUrl={requests.trending} onSelect={(movie) => handleMovieClick(movie, 'tmdb')} />
           <Row title="Top Rated Classics" fetchUrl={requests.topRated} onSelect={(movie) => handleMovieClick(movie, 'tmdb')} />
           <Row title="Action Hits" fetchUrl={requests.action} onSelect={(movie) => handleMovieClick(movie, 'tmdb')} />
        </section>
      )}

      {/* MODAL */}
      {selectedMovie && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#1F1F1F] border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]">
                <button 
                    onClick={() => setSelectedMovie(null)}
                    className="absolute top-4 right-4 bg-black/50 hover:bg-white hover:text-black text-white p-2 rounded-full transition z-10"
                >
                    <MdClose size={24} />
                </button>

                <div className="hidden md:block md:w-1/3 bg-black relative">
                    <img 
                        src={selectedMovie.image} 
                        alt={selectedMovie.title}
                        onError={(e) => handleImageError(e, selectedMovie.title)}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="w-full md:w-2/3 p-6 md:p-10 flex flex-col overflow-y-auto bg-gradient-to-br from-[#1F1F1F] to-black">
                    <div className="md:hidden w-full h-40 mb-4 rounded-lg overflow-hidden relative">
                         <img 
                            src={selectedMovie.backdrop || selectedMovie.image} 
                            alt={selectedMovie.title} 
                            onError={(e) => handleImageError(e, selectedMovie.title)}
                            className="w-full h-full object-cover" 
                         />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">{selectedMovie.title}</h2>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6 font-medium">
                        <span className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
                            <MdStar size={18} /> {selectedMovie.rating}
                        </span>
                        <span>{selectedMovie.year}</span>
                        <span className="flex items-center gap-1">
                            {/* 👇 This will automatically update when the fetch finishes */}
                            <MdAccessTime size={18} /> {selectedMovie.duration}
                        </span>
                    </div>

                    <div className="flex-grow">
                        <h4 className="text-red-600 font-bold uppercase text-xs tracking-wider mb-3">Synopsis</h4>
                        <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                            {selectedMovie.description}
                        </p>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button className="flex-1 bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2">
                            <MdPlayArrow size={24} /> Play
                        </button>
                        
                        {!selectedMovie.isLocal && user && (
                            <button 
                                onClick={handleSaveToCollection}
                                className="flex-1 bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                            >
                                <MdBookmarkAdd size={24} /> Save to Collection
                            </button>
                        )}

                        {user?.role === 'admin' && selectedMovie.isLocal && (
                            <button 
                                onClick={(e) => handleDelete(e, selectedMovie.id)}
                                className="border border-red-600 text-red-500 font-bold py-3 px-6 rounded-lg hover:bg-red-600 hover:text-white transition"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Home;
