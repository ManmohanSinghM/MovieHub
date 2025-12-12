import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Button, Container, Grid, Card, 
  CardContent, CardMedia, Box, TextField, Chip,
  Select, MenuItem, FormControl, InputLabel, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  
  // Default is 'createdAt' which means "Newest Added"
  const [sort, setSort] = useState('createdAt'); 
  
  // PAGINATION STATE
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMovies = async () => {
    try {
      // Pass 'page' to backend
      const { data } = await api.get(`/movies?search=${search}&sort=${sort}&page=${page}`);
      setMovies(data.movies);
      setTotalPages(data.totalPages); // Save total pages
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this movie?')) {
      try {
        await api.delete(`/movies/${id}`);
        fetchMovies(); // Refresh list
      } catch (error) {
        alert('Error deleting movie');
      }
    }
  };

  // Refetch when search, sort, OR PAGE changes
  useEffect(() => {
    fetchMovies();
  }, [search, sort, page]);

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh', pb: 5 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Movie App</Typography>
          {user && user.role === 'admin' && (
            <Button color="inherit" component={Link} to="/add-movie" sx={{ mr: 2, border: '1px solid white' }}>+ Add Movie</Button>
          )}
          {user ? (
            <>
              <Typography sx={{ mr: 2 }}>Hi, {user.username}</Typography>
              <Button color="inherit" onClick={logout}>Logout</Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <TextField 
            label="Search Movies..." variant="outlined" sx={{ width: '60%', bgcolor: 'white' }}
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
          <FormControl sx={{ width: '30%', bgcolor: 'white' }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sort} label="Sort By" onChange={(e) => setSort(e.target.value)}>
              <MenuItem value="createdAt">Newest Added</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
              <MenuItem value="year">Release Date</MenuItem>
              <MenuItem value="title">Title (A-Z)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3} alignItems="stretch">
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} key={movie._id} sx={{ display: 'flex' }}>
              <Card elevation={3} sx={{ width: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                {user && user.role === 'admin' && (
                  <IconButton 
                    onClick={() => handleDelete(movie._id)}
                    sx={{ position: 'absolute', top: 10, right: 10, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'white', color: 'red' } }}
                  >
                    <DeleteIcon color="action" />
                  </IconButton>
                )}
                <CardMedia
                  component="img" height="180"
                  image={`https://placehold.co/600x400/2a2a2a/FFF?text=${encodeURIComponent(movie.title)}`}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, lineHeight: '1.2em', height: '2.4em', overflow: 'hidden' }}>
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {movie.description.length > 100 ? movie.description.substring(0, 100) + '...' : movie.description}
                  </Typography>
                  <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                    <Chip label={`★ ${movie.rating}`} color="primary" size="small" />
                    <Typography variant="caption">{movie.duration}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* PAGINATION CONTROLS */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center' }}>
          <Button variant="contained" disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <Typography>Page {page} of {totalPages}</Typography>
          <Button variant="contained" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;