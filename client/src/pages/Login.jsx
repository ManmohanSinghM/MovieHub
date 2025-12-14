import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/'); 
    } catch (err) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black md:bg-opacity-50">
      {/* Background Image (Standard Netflix-like Pattern) */}
      <div 
        className="absolute inset-0 bg-cover bg-center hidden md:block opacity-50"
        style={{ backgroundImage: "url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')" }}
      ></div>
      
      {/* Black Gradient Overlay */}
      <div className="absolute inset-0 bg-black/60 hidden md:block"></div>

      {/* Navbar Logo */}
      <div className="relative z-10 px-6 py-6">
        <Link to="/" className="text-3xl font-bold text-red-600 tracking-tighter">
          MOVIE<span className="text-white">HUB</span>
        </Link>
      </div>

      {/* Login Box */}
      <div className="relative z-10 flex justify-center items-center h-[80vh]">
        <div className="bg-black/75 p-12 rounded w-full max-w-md">
          <h2 className="text-3xl font-bold text-white mb-8">Sign In</h2>
          
          {error && <div className="bg-red-600/80 p-3 rounded text-sm text-white mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Username" 
              className="p-4 bg-[#333] rounded text-white focus:outline-none focus:bg-[#454545]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="p-4 bg-[#333] rounded text-white focus:outline-none focus:bg-[#454545]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <button className="bg-red-600 py-3 rounded font-bold text-white mt-6 hover:bg-red-700 transition">
              Sign In
            </button>
          </form>

          <div className="mt-8 text-gray-400 text-sm">
            New to MovieHub? <Link to="/signup" className="text-white hover:underline">Sign up now</Link>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;