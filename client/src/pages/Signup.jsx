import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Register
      const response = await api.post('/auth/register', {
        username: formData.username,
        password: formData.password,
        role: 'user' 
      });

      // 2. Save Token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({ 
          username: formData.username, 
          role: 'user', 
          token: response.data.token 
      }));
      
      // 3. Force Refresh/Navigate to Home to trigger Auth Context update
      window.location.href = '/'; 
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black md:bg-opacity-50">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center hidden md:block opacity-50"
        style={{ backgroundImage: "url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-black/60 hidden md:block"></div>

      <div className="relative z-10 px-6 py-6">
        <Link to="/" className="text-3xl font-bold text-red-600 tracking-tighter">
          MOVIE<span className="text-white">HUB</span>
        </Link>
      </div>

      <div className="relative z-10 flex justify-center items-center h-[80vh]">
        <div className="bg-black/75 p-12 rounded w-full max-w-md">
          <h2 className="text-3xl font-bold text-white mb-8">Sign Up</h2>
          
          {error && <div className="bg-red-600/80 p-3 rounded text-sm text-white mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
              type="text" 
              name="username"
              placeholder="Username" 
              className="p-4 bg-[#333] rounded text-white focus:outline-none focus:bg-[#454545]"
              onChange={handleChange}
            />
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              className="p-4 bg-[#333] rounded text-white focus:outline-none focus:bg-[#454545]"
              onChange={handleChange}
            />
            
            <button className="bg-red-600 py-3 rounded font-bold text-white mt-6 hover:bg-red-700 transition">
              Create Account
            </button>
          </form>

          <div className="mt-8 text-gray-400 text-sm">
            Already have an account? <Link to="/login" className="text-white hover:underline">Sign in now</Link>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;