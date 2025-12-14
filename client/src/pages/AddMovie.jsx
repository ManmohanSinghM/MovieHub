import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { MdArrowBack } from 'react-icons/md';

const AddMovie = () => {
  const navigate = useNavigate();
  const [movie, setMovie] = useState({
    title: '',
    description: '',
    rating: '',
    releaseDate: '',
    duration: '',
    poster: '',   // New Field
    backdrop: ''  // New Field
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/movies', movie);
      setMessage('Movie added successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error(error);
      setMessage('Error adding movie. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center px-4 py-10">
      <div className="max-w-2xl w-full bg-[#1F1F1F] rounded-lg p-8 shadow-2xl border border-white/10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/" className="text-gray-400 hover:text-white transition">
            <MdArrowBack size={24} />
          </Link>
          <h1 className="text-2xl font-bold">Add New Movie</h1>
        </div>

        {message && (
          <div className={`p-3 mb-4 rounded text-sm font-bold ${message.includes('Error') ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Movie Title</label>
            <input 
              type="text" name="title" required onChange={handleChange}
              className="w-full bg-[#333] text-white rounded p-3 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
              placeholder="e.g. Inception"
            />
          </div>

          {/* New Image Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <label className="block text-sm text-gray-400 mb-1">Poster Image URL</label>
               <input 
                 type="url" name="poster" onChange={handleChange}
                 className="w-full bg-[#333] text-white rounded p-3 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
                 placeholder="https://..."
               />
            </div>
            <div>
               <label className="block text-sm text-gray-400 mb-1">Backdrop Image URL</label>
               <input 
                 type="url" name="backdrop" onChange={handleChange}
                 className="w-full bg-[#333] text-white rounded p-3 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
                 placeholder="https://..."
               />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Rating (0-10)</label>
              <input 
                type="number" name="rating" required step="0.1" max="10" onChange={handleChange}
                className="w-full bg-[#333] text-white rounded p-3 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
                placeholder="8.8"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Duration (minutes)</label>
              <input 
                type="number" name="duration" required onChange={handleChange}
                className="w-full bg-[#333] text-white rounded p-3 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
                placeholder="e.g. 148"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Release Date</label>
            <input 
              type="date" name="releaseDate" required onChange={handleChange}
              className="w-full bg-[#333] text-white rounded p-3 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea 
              name="description" required rows="4" onChange={handleChange}
              className="w-full bg-[#333] text-white rounded p-3 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
              placeholder="Enter plot summary..."
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Movie'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMovie;