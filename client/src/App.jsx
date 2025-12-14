import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddMovie from './pages/AddMovie'; // ✅ Import AddMovie

// --- Admin Route Guard ---
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return null; // Wait for user check
  
  // Only allow if user is logged in AND is an admin
  if (user && user.role === 'admin') {
    return children;
  }
  
  // Otherwise redirect to Home
  return <Navigate to="/" />;
};

function App() {
  const { user, loading } = useContext(AuthContext);

  // Show a simple loader while checking if user is logged in
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Home />} />

      {/* Guest Routes (Redirect to Home if already logged in) */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

      {/* ✅ Admin Protected Route */}
      <Route 
        path="/add-movie" 
        element={
          <AdminRoute>
            <AddMovie />
          </AdminRoute>
        } 
      />
    </Routes>
  );
}

export default App;