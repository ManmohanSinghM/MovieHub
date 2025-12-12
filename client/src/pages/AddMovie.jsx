import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Container, TextField, Button, Typography, Box, Paper, Alert } from '@mui/material';

const AddMovie = () => {
  const navigate = useNavigate();
  const [movie, setMovie] = useState({
    title: '',
    description: '',
    rating: '',
    releaseDate: '',
    duration: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send data to backend (which pushes to Queue)
      await api.post('/movies', movie);
      setMessage('Success! Movie sent to processing queue.');
      
      // Clear form after 2 seconds and go home
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error(error);
      setMessage('Error adding movie. Are you an Admin?');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>Add New Movie</Typography>
          
          {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField fullWidth margin="normal" label="Title" name="title" onChange={handleChange} required />
            <TextField fullWidth margin="normal" label="Description" name="description" multiline rows={3} onChange={handleChange} required />
            <TextField fullWidth margin="normal" label="Rating (0-10)" name="rating" type="number" onChange={handleChange} required />
            <TextField fullWidth margin="normal" type="date" label="Release Date" name="releaseDate" InputLabelProps={{ shrink: true }} onChange={handleChange} required />
            <TextField fullWidth margin="normal" label="Duration (e.g. 142 min)" name="duration" onChange={handleChange} required />
            
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
              Add Movie to Queue
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AddMovie;